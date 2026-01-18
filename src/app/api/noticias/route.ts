import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const categoria = url.searchParams.get("categoria");

  const noticias = await prisma.noticia.findMany({
    where: categoria ? { categoria: categoria as any } : undefined,
    orderBy: { fechaCreacion: "desc" },
    take: 50,
  });

  return NextResponse.json(noticias);
}