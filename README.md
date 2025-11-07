# Portal Institucional - Proyecto Final Integrador

Sistema completo de gestión académica con integración de IA Generativa.

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
- Demo práctica: Generador de código

## 🔧 Desarrollo

### Modo Watch (auto-reload):
```bash
npm run dev
```

### Verificar base de datos:
```bash
sqlite3 database.db
.tables
SELECT * FROM alumnos;
```

## 🎨 Diseño

El proyecto utiliza Tailwind CSS para un diseño moderno y responsivo:
- Paleta de colores profesional
- Componentes reutilizables
- Animaciones suaves
- Totalmente responsive

## 📝 Validaciones

### Formulario de Alumno:
- Nombre y Apellido: Requeridos
- DNI: 7-8 dígitos, único en BD
- Email: Formato válido
- Curso: Selección obligatoria
- Fecha de ingreso: Requerida

## 🚨 Manejo de Errores

- Notificaciones visuales para todas las operaciones
- Validación en frontend y backend
- Mensajes descriptivos de error
- Confirmaciones antes de eliminar

## 🌐 Navegación

Menú lateral con 5 secciones:
1. 🏠 Inicio
2. ➕ Cargar Alumno
3. 👥 Listado de Alumnos
4. 📖 Nuestra Historia
5. 🤖 IA Generativa

## 📊 Base de Datos

### Tabla: alumnos

```sql
CREATE TABLE alumnos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  dni TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  curso TEXT NOT NULL,
  fecha_ingreso DATE NOT NULL,
  direccion TEXT,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🤝 Contribuciones

Proyecto educativo desarrollado como Proyecto Final Integrador.

## 📄 Licencia

MIT License

## ✨ Créditos

- Imágenes: Unsplash (uso libre)
- Iconos: Font Awesome
- CSS Framework: Tailwind CSS
- Backend: Express.js + SQLite

---

**Desarrollado con ❤️ para el curso de Desarrollo Web**
