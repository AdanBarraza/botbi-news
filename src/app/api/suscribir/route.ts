import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { crearHTMLNewsletter } from "@/lib/newsletter";

export const runtime = "nodejs";

function esCorreoValido(correo: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const correo = body?.correo?.toString().trim().toLowerCase();

    if (!esCorreoValido(correo)) {
      return NextResponse.json({ ok: false, error: "Correo inválido" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Falta RESEND_API_KEY en .env (reinicia el servidor)" },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    let suscriptor = await prisma.suscriptor.findUnique({ where: { correo } });
    if (!suscriptor) {
      suscriptor = await prisma.suscriptor.create({ data: { correo, activo: true } });
    }

    const top10 = await prisma.noticia.findMany({
      orderBy: [{ puntajeRelevancia: "desc" }, { fechaPublicacion: "desc" }],
      take: 10,
    });

    const html = crearHTMLNewsletter(top10);

    const r = await resend.emails.send({
      from: "Botbi News <onboarding@resend.dev>",
      to: correo,
      subject: "📰 Bienvenido a Botbi News – Top 10 del día",
      html,
    });

    // CLAVE: ver qué devolvió Resend
    console.log("RESEND RESPUESTA:", JSON.stringify(r, null, 2));

    // CLAVE: Resend puede traer error sin lanzar excepción
    if ((r as any)?.error) {
      return NextResponse.json(
        { ok: false, error: (r as any).error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      suscriptor,
      emailEnviado: true,
      resendId: (r as any)?.data?.id || null,
    });
  } catch (e) {
    console.error("ERROR /api/suscribir:", e);
    return NextResponse.json(
      { ok: false, error: "Error al registrar o enviar correo" },
      { status: 500 }
    );
  }
}