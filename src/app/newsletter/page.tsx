"use client";

import React, { useEffect, useState } from "react";

type Item = {
  id: string;
  categoria: "TECNOLOGIA" | "NEGOCIOS";
  titulo: string;
  fechaPublicacion: string;
  contenidoIA: string;
  urlFuente: string;
  nombreFuente: string;
};

function recortar(texto: string, max = 280) {
  const t = (texto || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max).trim() + "..." : t;
}

export default function NewsletterPage() {
  const [top10, setTop10] = useState<Item[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [msgEnvio, setMsgEnvio] = useState<string | null>(null);

  const hoy = new Date().toLocaleDateString("es-MX", {
    timeZone: "America/Monterrey",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    (async () => {
      try {
        setCargando(true);
        setError(null);

        const res = await fetch("/api/newsletter/top10");
        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || "Error al cargar newsletter.");
          setTop10([]);
          return;
        }

        setTop10(data?.top10 || []);
      } catch {
        setError("Error de red al cargar newsletter.");
        setTop10([]);
      } finally {
        setCargando(false);
      }
    })();
  }, []);
  async function enviarNewsletterAhora() {
  try {
    setEnviando(true);
    setMsgEnvio(null);

    const res = await fetch("/api/newsletter/enviar", { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      setMsgEnvio(data?.error || "Error al enviar newsletter.");
      return;
    }

    setMsgEnvio(`Enviado ✅ (enviados: ${data?.enviados ?? "?"}, fallas: ${data?.fallas ?? 0})`);
  } catch {
    setMsgEnvio("Error de red al enviar newsletter.");
  } finally {
    setEnviando(false);
  }
}

  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh", padding: 24 }}>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: "#ffffff",
          border: "1px solid #000",
          borderRadius: 16,
          overflow: "hidden",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ padding: 20, borderBottom: "1px solid #000" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#000" }}>
            Botbi News — Newsletter
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
  <button
    onClick={enviarNewsletterAhora}
    disabled={enviando}
    style={{
      border: "1px solid #000",
      borderRadius: 10,
      padding: "10px 12px",
      background: "#000",
      color: "#fff",
      cursor: enviando ? "not-allowed" : "pointer",
      fontSize: 14,
      fontWeight: 700,
    }}
  >
    {enviando ? "Enviando..." : "Enviar newsletter ahora"}
  </button>

  {msgEnvio && (
    <span style={{ fontSize: 13, color: msgEnvio.startsWith("Enviado") ? "#0a7a2f" : "#b00020" }}>
      {msgEnvio}
    </span>
  )}
</div>
          <div style={{ marginTop: 6, fontSize: 14, color: "#333" }}>
            Top 10 del día • {hoy}
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {cargando ? (
            <p style={{ margin: 0, color: "#333" }}>Cargando newsletter...</p>
          ) : error ? (
            <p style={{ margin: 0, color: "#b00020" }}>{error}</p>
          ) : top10.length === 0 ? (
            <p style={{ margin: 0, color: "#333" }}>
              Aún no hay noticias para el newsletter de hoy.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {top10.map((n, idx) => (
                <div
                  key={n.id}
                  style={{
                    border: "1px solid #000",
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontSize: 12, color: "#333" }}>
                      <strong style={{ color: "#000" }}>
                        {idx + 1}. {n.categoria}
                      </strong>{" "}
                      • {new Date(n.fechaPublicacion).toLocaleString("es-MX")}
                    </div>
                    <div style={{ fontSize: 12, color: "#333" }}>
                      Fuente: <strong style={{ color: "#000" }}>{n.nombreFuente}</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: 8, fontSize: 16, fontWeight: 700, color: "#000" }}>
                    {n.titulo}
                  </div>

                  <div style={{ marginTop: 8, fontSize: 14, color: "#222", lineHeight: 1.5 }}>
                    {recortar(n.contenidoIA, 320)}
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <a
                      href={n.urlFuente}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: 13, color: "#000", textDecoration: "underline" }}
                    >
                      Leer fuente
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 18, borderTop: "1px solid #000", paddingTop: 14 }}>
            <div style={{ fontSize: 12, color: "#333" }}>
              Estás recibiendo este newsletter porque te suscribiste en Botbi News.
            </div>
            <div style={{ fontSize: 12, color: "#333", marginTop: 6 }}>
              (Preview web para demostración del reto)
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}