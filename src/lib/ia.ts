type Categoria = "TECNOLOGIA" | "NEGOCIOS";

export async function reescribirNoticiaIA(params: {
  titulo: string;
  contenido: string;
  categoria: Categoria;
}): Promise<{ tituloES: string; contenidoES: string }> {
  const textoBase = `${params.titulo}\n\n${params.contenido}`.slice(0, 8000);

  if (!process.env.GEMINI_API_KEY) {
    return { tituloES: params.titulo, contenidoES: params.contenido };
  }

  const modelo = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const prompt = `
Devuelve SOLO JSON válido con estas llaves: tituloES, contenidoES.
- Todo en español.
- tituloES: título traducido y mejorado (no inventes hechos).
- contenidoES: 2 a 3 párrafos, reescrito y traducido; sin copiar frases; sin mencionar la fuente.

TITULO_ORIGINAL:
${params.titulo}

TEXTO:
${params.contenido}
`.trim();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6 },
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini error ${res.status}: ${t.slice(0, 400)}`);
  }

  const data: any = await res.json();
  const txt =
    data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("")?.trim() || "";

  // extrae JSON aunque venga con texto alrededor
  const start = txt.indexOf("{");
  const end = txt.lastIndexOf("}");
  if (start === -1 || end === -1) {
    return { tituloES: params.titulo, contenidoES: params.contenido };
  }

  const obj = JSON.parse(txt.slice(start, end + 1));
  return {
    tituloES: (obj.tituloES || params.titulo).toString().trim(),
    contenidoES: (obj.contenidoES || params.contenido).toString().trim(),
  };
}