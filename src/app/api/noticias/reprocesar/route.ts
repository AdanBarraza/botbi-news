import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reescribirNoticiaIA } from "@/lib/ia";

export const runtime = "nodejs";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function reintentarIA(fn: () => Promise<{ tituloES: string; contenidoES: string }>) {
  // backoff: 2s, 5s, 10s (útil para rate limit por minuto)
  const esperas = [10000, 20000, 30000];

  let ultimoError: any = null;
  for (let i = 0; i < esperas.length; i++) {
    try {
      return await fn();
    } catch (e: any) {
      ultimoError = e;
      const msg = (e?.message || "").toString();
      const es429 = msg.includes(" 429") || msg.includes("Quota") || msg.includes("rate");
      if (!es429) break; // si no es 429, no tiene sentido reintentar
      await sleep(esperas[i]);
    }
  }
  throw ultimoError;
}

export async function POST() {
  try {
    const pendientes = await prisma.noticia.findMany({
      where: { puntajeRelevancia: -1 },
      take: 2, // procesa solo 2 por vez
      orderBy: { fechaPublicacion: "desc" },
    });

    let actualizadas = 0;
    const fallas: Array<{ id: string; titulo: string; error: string }> = [];

    for (const n of pendientes) {
      try {
        const r = await reintentarIA(() =>
          reescribirNoticiaIA({
            titulo: n.titulo,
            contenido: n.contenidoOriginal.slice(0, 800),
            categoria: n.categoria as any,
          })
        );

        await prisma.noticia.update({
          where: { id: n.id },
          data: {
            titulo: r.tituloES,
            contenidoIA: r.contenidoES,
            puntajeRelevancia: 10,
          },
        });

        actualizadas++;
        await sleep(5000); // throttle extra
      } catch (e: any) {
        fallas.push({
          id: n.id,
          titulo: n.titulo,
          error: (e?.message ?? e).toString().slice(0, 250),
        });
      }
    }

    return NextResponse.json({
      ok: true,
      totalPendientesProcesados: pendientes.length,
      actualizadas,
      fallas,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: (e?.message ?? e).toString() },
      { status: 500 }
    );
  }
}