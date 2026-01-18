import { headers } from "next/headers";
import Link from "next/link";

async function obtenerNoticia(id: string) {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/noticias/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function DetalleNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noticia = await obtenerNoticia(id);

  if (!noticia) {
    return (
      <main style={contenedor}>
        <h1 style={titulo}>Noticia no encontrada</h1>
        <p style={texto}>Revisa que el ID exista o vuelve a cargar.</p>
        <Link href="/" style={btn}>
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main style={contenedor}>
      <article style={card}>
        <h1 style={titulo}>{noticia.titulo}</h1>

        <div style={meta}>
          <span>
            {new Date(noticia.fechaPublicacion).toLocaleDateString("es-MX")}
          </span>
          <span>• {noticia.nombreFuente}</span>
        </div>

        <p style={contenido}>{noticia.contenidoIA}</p>

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <a
            href={noticia.urlFuente}
            target="_blank"
            rel="noreferrer"
            style={btnPrimary}
          >
            Ver fuente original
          </a>

          <Link href="/" style={btn}>
            Volver
          </Link>
        </div>
      </article>
    </main>
  );
}

/* ESTILOS */

const contenedor: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
  padding: 24,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  fontFamily: "system-ui",
};

const card: React.CSSProperties = {
  maxWidth: 800,
  width: "100%",
  backgroundColor: "#ffffff",
  borderRadius: 16,
  padding: 28,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
};

const titulo: React.CSSProperties = {
  fontSize: 28,
  marginBottom: 12,
  color: "#000000", // TEXTO NEGRO
};

const meta: React.CSSProperties = {
  fontSize: 13,
  color: "#333333",
  marginBottom: 20,
};

const contenido: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.7,
  color: "#000000", // TEXTO NEGRO
  whiteSpace: "pre-line",
};

const texto: React.CSSProperties = {
  color: "#000000",
};

const btn: React.CSSProperties = {
  border: "1px solid #000",
  padding: "8px 14px",
  borderRadius: 8,
  textDecoration: "none",
  color: "#000",
  fontSize: 14,
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  backgroundColor: "#000",
  color: "#fff",
};