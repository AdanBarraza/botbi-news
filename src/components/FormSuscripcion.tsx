"use client";

import { useState } from "react";

export default function FormSuscripcion() {
  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);

  async function suscribir(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);
    setOk(null);

    try {
      const res = await fetch("/api/suscribir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setOk(false);
        setMensaje(data?.error || "No se pudo completar la suscripción.");
        return;
      }

      setOk(true);
      setMensaje("Listo. Te suscribiste al newsletter.");
      setCorreo("");
    } catch {
      setOk(false);
      setMensaje("Error de red. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

return (
  <section
    style={{
      width: "100%",
      borderRadius: 16,
      border: "1px solid #000",
      backgroundColor: "#ffffff",
      padding: 20,
    }}
  >
    <h2 style={{ fontSize: 20, fontWeight: 600, color: "#000000" }}>
      Newsletter
    </h2>

    <p style={{ fontSize: 14, color: "#333333", marginTop: 4 }}>
      Recibe el Top 10 de noticias del día en tu correo.
    </p>

    <form
      onSubmit={suscribir}
      style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}
    >
      <input
        type="email"
        required
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        placeholder="tu_correo@ejemplo.com"
        style={{
          flex: 1,
          minWidth: 220,
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #000",
          fontSize: 14,
          color: "#000000",
          outline: "none",
        }}
      />

      <button
        type="submit"
        disabled={cargando}
        style={{
          padding: "10px 18px",
          borderRadius: 10,
          border: "1px solid #000",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontWeight: 500,
          cursor: "pointer",
          opacity: cargando ? 0.6 : 1,
        }}
      >
        {cargando ? "Suscribiendo..." : "Suscribirme"}
      </button>
    </form>

    {mensaje && (
      <p
        style={{
          marginTop: 12,
          fontSize: 14,
          color: ok ? "#0a7f2e" : "#b00020",
        }}
      >
        {mensaje}
      </p>
    )}
  </section>
);
}