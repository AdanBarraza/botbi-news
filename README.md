Botbi News — Noticias con IA + Newsletter Automatizado

Botbi News es una aplicación web que recopila noticias de tecnología y negocios, las procesa con Inteligencia Artificial y muestra un Top 10 diario, además de permitir el envío de newsletters por correo.

El proyecto fue desarrollado como parte de un reto académico, enfocándose en:
	•	Consumo de APIs
	•	Automatización
	•	Uso de IA
	•	Base de datos
	•	Frontend moderno

⸻

 Funcionalidades principales
	•	Noticias de Tecnología reescritas con IA
	•	Noticias de Negocios en formato original
	•	Sección de Mercados con Top 10 acciones y criptomonedas
	•	Vista detallada de cada noticia
	•	Sistema de suscripción por correo
	•	Envío de Newsletter con Top 10 del día
	•	Preview web del newsletter
	•	Base de datos con Prisma + MySQL

⸻

Importante sobre el envío de correos

Por limitaciones de la plataforma de envío (Resend – plan gratuito):
	• Solo se pueden enviar correos al correo institucional del desarrollador:
    alu.21130897@correo.itlalaguna.edu.mx

Tecnologías utilizadas
	•	Frontend: Next.js (App Router) + React
	•	Backend: API Routes (Node.js)
	•	Base de datos: MySQL
	•	ORM: Prisma
	•	IA: Gemini API
	•	Correos: Resend
	•	Estilos: CSS + Tailwind
	•	Entorno: Node.js

Requisitos para ejecutar el proyecto

Antes de comenzar, asegúrate de tener instalado:
	•	Node.js 18+
	•	MySQL
	•	Git


Instalación y ejecución

1. Clonar el repositorio
git clone https://github.com/AdanBarraza/botbi-news.git
cd botbi-news
2. Instalar Dependecias
npm install
3. Configurar variables de entorno
Crea un archivo .env con:
DATABASE_URL="mysql://usuario:password@localhost:3306/newsdb"
RESEND_API_KEY=tu_api_key
GEMINI_API_KEY=tu_api_key
4. Migrar la base de datos
npx prisma migrate dev
5. Ejecutar el proyecto
npm run dev

Luego abre en el navegador:
http://localhost:3000