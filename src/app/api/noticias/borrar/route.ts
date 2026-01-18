import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  const r = await prisma.noticia.deleteMany({});
  return NextResponse.json({ ok: true, borradas: r.count });
}