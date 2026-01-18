import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { prisma } from "@/lib/prisma";
import { reescribirNoticiaIA } from "@/lib/ia";

export const runtime = "nodejs";

const parser = new Parser();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Fuentes RSS (ajusta si quieres)
const FUENTES = {
  TECNOLOGIA: [
    "https://techcrunch.com/feed/",
    "https://www.theverge.com/rss/index.xml",
  ],
  NEGOCIOS: [
    "https://www.businessinsider.com/rss",
    "https://feeds.a.dj.com/rss/RSSWorldNews.xml",
  ],
} as const;

// Para evitar 429
const MAX_ITEMS_POR_FEED = 3;
const ESPERA_MS_ENTRE_IA = 1200;

function extraerTexto(item: any) {
  const raw =
    item.contentSnippet ||
    item.content ||
    item.summary ||
    item["content:encoded"] ||
    "";
  return raw.toString().replace(/\s+/g, " ").trim();
}

async function leerFeed(url: string) {
  try {
    return await parser.parseURL(url);
  } catch (e: any) {
    throw new Error(`Fallo leyendo RSS: ${url} -> ${e?.message ?? e}`);
  }
}

// POST /api/ingest
export async function POST() {
  try {
    const creadas: any[] = [];
    const omitidas: any[] = [];
    const errores: any[] = [];

    for (const categoria of ["TECNOLOGIA", "NEGOCIOS"] as const) {
      for (const rssUrl of FUENTES[categoria]) {
        let feed: any;
        try {
          feed = await leerFeed(rssUrl);
        } catch (e: any) {
          errores.push({ categoria, rssUrl, error: e.message });
          continue;
        }

        const fuenteNombre = (feed.title || "RSS").toString();

        for (const item of (feed.items || []).slice(0, MAX_ITEMS_POR_FEED)) {
          try {
            const urlFuente = item.link?.toString() || "";
            if (!urlFuente) {
              omitidas.push({ categoria, rssUrl, motivo: "sin link" });
              continue;
            }

            // Evita duplicados
            const existe = await prisma.noticia.findUnique({ where: { urlFuente } });
            if (existe) {
              omitidas.push({ categoria, urlFuente, motivo: "duplicada" });
              continue;
            }

            const tituloOriginal = (item.title || "Sin título").toString().trim();
            const contenidoOriginal = extraerTexto(item);

            if (!contenidoOriginal) {
              omitidas.push({ categoria, urlFuente, motivo: "sin contenido" });
              continue;
            }

            // IA con throttle + fallback
            let tituloFinal = tituloOriginal;
            let contenidoIA = contenidoOriginal;
            let puntajeRelevancia = 0;

            try {
              const r = await reescribirNoticiaIA({
                titulo: tituloOriginal,
                contenido: contenidoOriginal.slice(0, 800),
                categoria,
              });

              tituloFinal = r.tituloES || tituloOriginal;
              contenidoIA = r.contenidoES || contenidoOriginal;

              await sleep(ESPERA_MS_ENTRE_IA);

              // IA OK
              puntajeRelevancia = 10;
            } catch (e: any) {
              // Fallback (se guarda igual)
              tituloFinal = tituloOriginal;
              contenidoIA = contenidoOriginal;

              // marca como pendiente (no IA)
              puntajeRelevancia = -1;

              errores.push({
                categoria,
                rssUrl,
                itemTitle: tituloOriginal,
                error: e?.message ?? e,
              });
            }

            const fechaPublicacion = item.pubDate ? new Date(item.pubDate) : new Date();

            const noticia = await prisma.noticia.create({
              data: {
                urlFuente,
                nombreFuente: fuenteNombre,
                categoria,
                titulo: tituloFinal,
                fechaPublicacion,
                contenidoOriginal,
                contenidoIA,
                puntajeRelevancia,
              },
            });

            creadas.push({ id: noticia.id, categoria, titulo: noticia.titulo });
          } catch (e: any) {
            errores.push({
              categoria,
              rssUrl,
              itemTitle: item?.title,
              error: e?.message ?? e,
            });
          }
        }
      }
    }

    return NextResponse.json({
      ok: true,
      creadas: creadas.length,
      omitidas: omitidas.length,
      errores: errores.length,
      ejemplos: creadas.slice(0, 5),
      detallesErrores: errores.slice(0, 5),
      config: { MAX_ITEMS_POR_FEED, ESPERA_MS_ENTRE_IA },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error desconocido" },
      { status: 500 }
    );
  }
}