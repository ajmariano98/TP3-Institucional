import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configurar SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
  } else {
    console.log('Base de datos conectada correctamente');
    initDatabase();
  }
});

// Inicializar base de datos
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS alumnos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      dni TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      telefono TEXT,
      carrera TEXT NOT NULL,
      curso TEXT NOT NULL,
      fecha_ingreso DATE NOT NULL,
      direccion TEXT,
      fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear tabla:', err);
    } else {
      console.log('Tabla alumnos lista');
      // Agregar columna carrera si no existe (para migración)
      db.run(`ALTER TABLE alumnos ADD COLUMN carrera TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error al agregar columna carrera:', err);
        }
      });
    }
  });
}

// RUTAS API

// Obtener todos los alumnos o filtrar por curso
app.get('/api/alumnos', (req, res) => {
  const { curso, carrera } = req.query;
  let query = 'SELECT * FROM alumnos';
  let params = [];
  const conditions = [];

  if (curso) {
    conditions.push('curso = ?');
    params.push(curso);
  }

  if (carrera) {
    conditions.push('carrera = ?');
    params.push(carrera);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY apellido, nombre';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ alumnos: rows });
    }
  });
});

// Obtener un alumno por ID
app.get('/api/alumnos/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM alumnos WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Alumno no encontrado' });
    } else {
      res.json({ alumno: row });
    }
  });
});

// Crear nuevo alumno
app.post('/api/alumnos', (req, res) => {
  const { nombre, apellido, dni, email, telefono, carrera, curso, fecha_ingreso, direccion } = req.body;

  // Validaciones básicas
  if (!nombre || !apellido || !dni || !email || !carrera || !curso || !fecha_ingreso) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const query = `
    INSERT INTO alumnos (nombre, apellido, dni, email, telefono, carrera, curso, fecha_ingreso, direccion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [nombre, apellido, dni, email, telefono, carrera, curso, fecha_ingreso, direccion], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'El DNI ya está registrado' });
      } else {
        res.status(500).json({ error: err.message });
      }
    } else {
      res.status(201).json({ 
        message: 'Alumno creado exitosamente',
        id: this.lastID 
      });
    }
  });
});

// Actualizar alumno
app.put('/api/alumnos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, dni, email, telefono, carrera, curso, fecha_ingreso, direccion } = req.body;

  const query = `
    UPDATE alumnos 
    SET nombre = ?, apellido = ?, dni = ?, email = ?, telefono = ?, 
        carrera = ?, curso = ?, fecha_ingreso = ?, direccion = ?
    WHERE id = ?
  `;

  db.run(query, [nombre, apellido, dni, email, telefono, carrera, curso, fecha_ingreso, direccion, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Alumno no encontrado' });
    } else {
      res.json({ message: 'Alumno actualizado exitosamente' });
    }
  });
});

// Eliminar alumno
app.delete('/api/alumnos/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM alumnos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Alumno no encontrado' });
    } else {
      res.json({ message: 'Alumno eliminado exitosamente' });
    }
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`📁 Archivos estáticos servidos desde /public`);
  console.log(`🗄️  Base de datos SQLite inicializada`);
});

// Exportar para compatibilidad
export default app;
