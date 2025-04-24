# SnappyFriends - Red Social

![Next.js](https://img.shields.io/badge/Next.js-v14.0.0-black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

SnappyFriends es una red social moderna desarrollada con **Next.js 14**, **React**, **TypeScript** y **TailwindCSS**, que permite a los usuarios conectarse, compartir contenido y comunicarse de manera intuitiva. Diseñada para brindar una experiencia fluida, dinámica y segura.

---

## 🌐 Deploy

🔗 [Acceder a la aplicación](https://snappyfriends.vercel.app)

---

## 📺 Demo en YouTube

📹 [Ver Demo de SnappyFriends](https://www.youtube.com/watch?v=TU_LINK_DEMO)

---

## 🧠 Backend

🔧 Repositorio Backend: [CarlosDanielOK/snappy-back](https://github.com/CarlosDanielOK/snappy-back)

---

## 🖼️ Vista Previa

![Vista Previa de SnappyFriends](https://raw.githubusercontent.com/CarlosDanielOK/snappy-front/main/public/preview-snappyfriends.png)

---

## 📱 Descripción General

Esta plataforma combina un diseño minimalista con funcionalidades completas: autenticación, publicaciones, mensajería en tiempo real, sistema de seguidores, suscripciones y configuración personalizada.

---

## 🎯 Funcionalidades Principales

### 🔐 Sistema de Autenticación y Perfiles
- Registro e inicio de sesión
- Perfiles personalizables con foto
- Edición de datos personales
- Verificación de cuentas

### 📝 Publicaciones y Feed
- Crear, editar y eliminar publicaciones
- Feed social personalizado según usuarios seguidos
- Likes, comentarios y sistema de compartir
- Historias efímeras (Stories)
- Etiquetas y menciones

### 💬 Mensajería en Tiempo Real
- Chats privados uno a uno
- Chats grupales con administración
- Notificaciones en tiempo real
- Historial y multimedia en conversaciones

### 👥 Interacción Social
- Seguidores / Seguidos
- Feed de actividad personalizado
- Notificaciones de interacciones
- Intereses y geolocalización

### 💳 Sistema de Pagos
- Pasarela de pagos integrada
- Suscripciones premium
- Historial y gestión de transacciones

### ⚙️ Dashboard y Configuración
- Panel de control personalizado
- Ajustes de privacidad, notificaciones y preferencias

---

## 💻 Tecnologías Utilizadas

### Frontend
- **Next.js 14**: Renderizado híbrido (SSR + SSG)
- **React** + **TypeScript**: Tipado estático y componentes robustos
- **TailwindCSS**: Estilos modernos, responsivos y personalizables
- **Context API**: Manejo de estado global
- **CSS Modules**: Estilos encapsulados

### Herramientas de Desarrollo
- **ESLint**: Calidad y estilo de código
- **PostCSS**: Procesamiento avanzado de CSS
- **Git**: Control de versiones

---

## 🔒 Seguridad

- Autenticación JWT y protección de rutas
- Validación de formularios y datos
- Protección contra XSS y CSRF
- Manejo seguro de sesiones y tokens

---

## 📂 Instalación y Ejecución

```bash
# Clona el repositorio
git clone https://github.com/CarlosDanielOK/snappy-front.git
cd snappy-front

# Instala dependencias
npm install

# Crea un archivo .env.local con tus variables de entorno (basado en .env.example)

# Ejecuta el servidor de desarrollo
npm run dev
