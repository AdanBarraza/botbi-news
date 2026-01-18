import React from "react";
import { headers } from "next/headers";

async function obtenerMercados() {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/markets`, { cache: "no-store" });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Error Markets API ${res.status}: ${t.slice(0, 200)}`);
  }
  return res.json();
}

export default async function MarketsPage() {
  const data = await obtenerMercados();

  return (
    <main style={contenedor}>
      <header style={header}>
        <h1 style={titulo}>Mercados</h1>
        <p style={subtitulo}>Top 10 Acciones y Top 10 Criptomonedas</p>
        <p style={meta}>Actualizado: {new Date(data.updatedAt).toLocaleString()}</p>
      </header>

      <section style={grid2}>
        <div style={panel}>
          <h2 style={h2}>Top 10 Acciones</h2>
          <table style={tabla}>
            <thead>
              <tr>
                <th style={th}>Símbolo</th>
                <th style={th}>Nombre</th>
                <th style={th}>Precio</th>
                <th style={th}>Cambio</th>
              </tr>
            </thead>
            <tbody>
              {data.topAcciones.map((s: any) => (
                <tr key={s.symbol}>
                  <td style={tdMono}>{s.symbol}</td>
                  <td style={td}>{s.name}</td>
                  <td style={td}>{s.price ? `$${Number(s.price).toFixed(2)}` : "-"}</td>
                  <td style={td}>{s.changePct ? `${Number(s.changePct).toFixed(2)}%` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={panel}>
          <h2 style={h2}>Top 10 Criptomonedas</h2>
          <table style={tabla}>
            <thead>
              <tr>
                <th style={th}>Símbolo</th>
                <th style={th}>Nombre</th>
                <th style={th}>Precio (USD)</th>
                <th style={th}>24h</th>
              </tr>
            </thead>
            <tbody>
              {data.topCripto.map((c: any) => (
                <tr key={c.symbol}>
                  <td style={tdMono}>{c.symbol}</td>
                  <td style={td}>{c.name}</td>
                  <td style={td}>{`$${Number(c.priceUsd).toFixed(2)}`}</td>
                  <td style={td}>{`${Number(c.changePct24h).toFixed(2)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

/* estilos */
const contenedor: React.CSSProperties = {
  width: "100%",
  padding: 24,
  fontFamily: "system-ui",
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
};

const header: React.CSSProperties = { marginBottom: 22 };
const titulo: React.CSSProperties = { fontSize: 36, margin: 0, color: "#0f172a" };
const subtitulo: React.CSSProperties = { marginTop: 8, color: "#64748b" };
const meta: React.CSSProperties = { marginTop: 6, color: "#94a3b8", fontSize: 12 };

const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  gap: 18,
};

const panel: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  overflowX: "auto",
};

const h2: React.CSSProperties = { marginTop: 0, color: "#0f172a" };

const tabla: React.CSSProperties = { width: "100%", borderCollapse: "collapse" };
const th: React.CSSProperties = {
  textAlign: "left",
  padding: 10,
  borderBottom: "1px solid #e5e7eb",
  color: "#334155",
  fontSize: 13,
};
const td: React.CSSProperties = {
  padding: 10,
  borderBottom: "1px solid #f1f5f9",
  color: "#334155",
  fontSize: 13,
};
const tdMono: React.CSSProperties = { ...td, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" };