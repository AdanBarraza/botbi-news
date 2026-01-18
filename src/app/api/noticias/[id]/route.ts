import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // IMPORTANTE: según tu schema, el modelo se llama "Noticias" (plural),
  // por eso el cliente suele ser prisma.noticias.
  const noticia = await prisma.noticia.findUnique({
    where: { id },
  });

  if (!noticia) {
    return NextResponse.json(
      { ok: false, error: "No encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json(noticia);
}