import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function inicioFinHoyMonterrey() {
  const tz = "America/Monterrey";
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = fmt.formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;

  const inicio = new Date(`${y}-${m}-${d}T00:00:00`);
  const fin = new Date(`${y}-${m}-${d}T23:59:59`);
  return { inicio, fin };
}

export async function GET() {
  const { inicio, fin } = inicioFinHoyMonterrey();

  const top10 = await prisma.noticia.findMany({
    where: { fechaPublicacion: { gte: inicio, lte: fin } },
    orderBy: [{ puntajeRelevancia: "desc" }, { fechaPublicacion: "desc" }],
    take: 10,
    select: {
      id: true,
      categoria: true,
      titulo: true,
      fechaPublicacion: true,
      contenidoIA: true,
      urlFuente: true,
      nombreFuente: true,
    },
  });

  return NextResponse.json({ ok: true, total: top10.length, top10 });
}