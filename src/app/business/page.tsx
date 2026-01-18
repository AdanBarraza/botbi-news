import React from "react";
import Link from "next/link";
import { headers } from "next/headers";

async function obtenerNoticias() {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/noticias?categoria=NEGOCIOS`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const texto = await res.text();
    throw new Error(`Error API ${res.status}: ${texto.slice(0, 200)}`);
  }

  return res.json();
}

function recortar(texto: string, max = 420) {
  const t = (texto || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max).trim() + "..." : t;
}

export default async function BusinessPage() {
  const noticias = await obtenerNoticias();

  return (
    <main style={contenedor}>
      <header style={header}>
        <h1 style={titulo}>Negocios</h1>
        <p style={subtitulo}>Noticias económicas y empresariales</p>
      </header>

      {noticias.length === 0 && (
        <div style={vacio}>
          <p>No hay noticias aún.</p>
        </div>
      )}

      <section style={grid}>
        {noticias.map((n: any) => (
          <article key={n.id} style={card}>
            <h2 style={cardTitulo}>{n.titulo}</h2>
            <p style={cardTexto}>{recortar(n.contenidoIA)}</p>

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href={`/noticias/${n.id}`} style={btn}>
                Ver detalle
              </Link>

              {n.urlFuente ? (
                <a href={n.urlFuente} target="_blank" rel="noreferrer" style={btnPrimary}>
                  Fuente
                </a>
              ) : null}
            </div>

            <span style={fecha}>
              {new Date(n.fechaPublicacion).toLocaleDateString("es-MX")}
            </span>
          </article>
        ))}
      </section>
    </main>
  );
}

/* ESTILOS */

const contenedor: React.CSSProperties = {
  width: "100%",
  padding: 24,
  fontFamily: "system-ui",
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
};

const header: React.CSSProperties = {
  marginBottom: 32,
};

const titulo: React.CSSProperties = {
  fontSize: 36,
  margin: 0,
  color: "#0f172a",
};

const subtitulo: React.CSSProperties = {
  marginTop: 8,
  color: "#64748b",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 20,
};

const card: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const cardTitulo: React.CSSProperties = {
  fontSize: 20,
  marginBottom: 10,
  color: "#0f172a",
};

const cardTexto: React.CSSProperties = {
  color: "#475569",
  lineHeight: 1.6,
  margin: 0,
};

const fecha: React.CSSProperties = {
  marginTop: 12,
  fontSize: 12,
  color: "#94a3b8",
};

const vacio: React.CSSProperties = {
  backgroundColor: "white",
  padding: 40,
  borderRadius: 16,
  textAlign: "center",
  color: "#64748b",
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
};

const btn: React.CSSProperties = {
  border: "1px solid #000",
  padding: "6px 12px",
  borderRadius: 8,
  textDecoration: "none",
  color: "#000",
  fontSize: 13,
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  backgroundColor: "#000",
  color: "#fff",
};