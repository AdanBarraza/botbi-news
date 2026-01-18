export function crearHTMLNewsletter(noticias: any[]) {
  return `
  <div style="font-family: system-ui; background:#f5f5f5; padding:20px;">
    <div style="max-width:700px; margin:auto; background:white; border-radius:16px; border:1px solid #000;">
      <div style="padding:20px; border-bottom:1px solid #000;">
        <h1>Botbi News</h1>
        <p>Top 10 noticias del día</p>
      </div>
      <div style="padding:20px;">
        ${noticias
          .map(
            (n, i) => `
          <div style="border:1px solid #000; border-radius:12px; padding:12px; margin-bottom:12px;">
            <strong>${i + 1}. ${n.titulo}</strong>
            <p>${(n.contenidoIA || "").slice(0, 300)}...</p>
            <a href="${n.urlFuente}">Leer fuente</a>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  </div>
  `;
}