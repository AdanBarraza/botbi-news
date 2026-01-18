import React from "react";
import FormSuscripcion from "@/components/FormSuscripcion";

export default function Home() {
  return (
    <main
      style={{
        width: "100%",
        padding: 24,
        fontFamily: "system-ui",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 34, color: "#000000" }}>
            Botbi News
          </h1>
          <p style={{ marginTop: 8, color: "#000000" }}>
            Noticias con IA + Newsletter automatizado
          </p>
        </div>

        <nav style={{ display: "flex", gap: 12, color: "#000000" }}>
          <a href="/tech" style={link}>
            Tecnologia
          </a>
          <a href="/business" style={link}>
            Negocios
          </a>
          <a href="/markets" style={link}>
            Mercados
          </a>
          <a href="/newsletter" style={link}>
            Newsletter
          </a>
        </nav>
      </header>

      {/* NUEVO: Newsletter */}
      <section style={{ marginTop: 24 }}>
        <FormSuscripcion />
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginTop: 28,
        }}
      >
        <a href="/tech" style={card}>
          <h2 style={{ margin: 0, color: "#000000" }}>Tecnologia</h2>
          <p style={texto}>Articulo reescrito por IA.</p>
        </a>

        <a href="/business" style={card}>
          <h2 style={{ margin: 0, color: "#000000" }}>Negocios</h2>
          <p style={texto}>Noticias de Negocios en formato original.</p>
        </a>

        <a href="/markets" style={card}>
          <h2 style={{ margin: 0, color: "#000000" }}>Mercados</h2>
          <p style={texto}>Top 10 acciones y Top 10 Criptomonedas.</p>
        </a>
      </section>
    </main>
  );
}

const card: React.CSSProperties = {
  border: "1px solid #000000",
  borderRadius: 14,
  padding: 18,
  textDecoration: "none",
  color: "inherit",
  backgroundColor: "white",
};

const texto: React.CSSProperties = {
  marginTop: 8,
  color: "#000000",
};

const link: React.CSSProperties = {
  color: "#000000",
  textDecoration: "none",
  padding: "6px 10px",
  borderRadius: 10,
  border: "1px solid #000000",
};