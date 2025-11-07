# Portal Institucional - Proyecto Final Integrador

TP3 Integrador Unidad 6

## 🚀 Características

- **Home**: Widget de clima actual y buscador de ciudades
- **Gestión de Alumnos**: CRUD completo con formulario validado
- **Listado por Curso**: Filtros dinámicos por año
- **Historia Institucional**: Contenido multimedia
- **Unidad 6 - IA Generativa**: Investigación completa sobre IA en desarrollo web

## 🛠️ Tecnologías Utilizadas

### Frontend
- HTML5
- Tailwind CSS (CDN)
- JavaScript Vanilla
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- SQLite3
- Body-parser & CORS

## 📦 Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- npm o yarn

### Pasos de Instalación

1. Clonar o descargar el proyecto

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor:
```bash
npm start
```

4. Abrir navegador en:
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
portal-institucional/
├── public/
│   ├── index.html      # Página principal
│   └── app.js          # Lógica del frontend
├── server.js           # Servidor Express + API REST
├── render.yaml         # Configuración de Render
├── database.db         # Base de datos SQLite (se crea automáticamente)
├── package.json        # Dependencias
└── README.md          # Esta documentación
```

## 🔌 API Endpoints

### Alumnos

- `GET /api/alumnos` - Obtener todos los alumnos
- `GET /api/alumnos?curso=1er%20Año` - Filtrar por curso
- `GET /api/alumnos/:id` - Obtener alumno por ID
- `POST /api/alumnos` - Crear nuevo alumno
- `PUT /api/alumnos/:id` - Actualizar alumno
- `DELETE /api/alumnos/:id` - Eliminar alumno

### Ejemplo de Petición POST:

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "dni": "12345678",
  "email": "juan@example.com",
  "telefono": "1234567890",
  "curso": "1er Año",
  "fecha_ingreso": "2025-03-01",
  "direccion": "Calle Falsa 123"
}
```

## 🎯 Funcionalidades Principales

### 1. Widget de Clima
- Muestra clima actual de ubicación predeterminada
- Buscador de clima por ciudad
- Datos simulados (expandible con API real de OpenWeatherMap)

### 2. Gestión de Alumnos
- Formulario con validación completa
- Guardado en base SQLite
- Edición y eliminación con confirmación
- Filtros por curso

### 3. Sección IA Generativa
- Explicación completa de IA generativa
- Herramientas: ChatGPT, Copilot, DALL-E, Midjourney
- Ejemplos prácticos de prompts
- Análisis de aplicación real (Grammarly)
- Debate: ¿IA reemplaza o potencia al desarrollador?
