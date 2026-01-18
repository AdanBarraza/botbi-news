import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { crearHTMLNewsletter } from "@/lib/newsletter";

export const runtime = "nodejs";

export async function POST() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ ok: false, error: "Falta RESEND_API_KEY" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Top 10
    const top10 = await prisma.noticia.findMany({
      orderBy: [{ puntajeRelevancia: "desc" }, { fechaPublicacion: "desc" }],
      take: 10,
    });

    const html = crearHTMLNewsletter(top10);

    // Suscriptores activos
    const suscriptores = await prisma.suscriptor.findMany({
      where: { activo: true },
      select: { correo: true },
    });

    let enviados = 0;
    let fallas = 0;

    for (const s of suscriptores) {
      const r = await resend.emails.send({
        from: "Botbi News <onboarding@resend.dev>",
        to: s.correo,
        subject: "📰 Botbi News – Top 10 del día",
        html,
      });

      if ((r as any)?.error) fallas++;
      else enviados++;
    }

    return NextResponse.json({ ok: true, enviados, fallas });
  } catch (e) {
    console.error("ERROR /api/newsletter/enviar:", e);
    return NextResponse.json({ ok: false, error: "Error al enviar newsletter" }, { status: 500 });
  }
}