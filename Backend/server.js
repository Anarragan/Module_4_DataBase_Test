import express from 'express';
import cors from 'cors';
import pool from './dataBase_conection.js';
import bcrypt from 'bcryptjs';
import { 
  uploadClientesCSV, 
  uploadFacturacionesCSV, 
  uploadTransaccionesCSV
} from "./upload-csv.js";
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = 3001;

// Middleware configuration
app.use(express.json());
app.use(cors());

app.get('/clientes', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.cliente_id,
        c.nombre,
        c.cedula,
        c.direccion,
        c.telefono,
        c.correo,
        c.plataforma
      FROM clientes c
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Error fetching clients' });
  }
});

// Create new clients
app.post('/clientes-nuevos', async (req, res) => {
  const { cliente_id, nombre, cedula, direccion, telefono, correo, plataforma } = req.body;

  // Validate required fields
  if (
    cliente_id ||
    nombre ||
    cedula ||
    direccion ||
    telefono ||
    correo ||
    plataforma
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if client exists
    const clienteResult = await pool.query('SELECT 1 FROM clientes WHERE cliente_id = $1', [cliente_id]);
    if (clienteResult.rowCount === 0) {
      return res.status(400).json({ error: 'Cliente does not exist' });
    }


    // Insert client
    const insertResult = await pool.query(
      `INSERT INTO clientes (nombre, cedula, direccion, telefono, correo, plataforma) 
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nombre, cedula, direccion, telefono, correo, plataforma]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    console.error('Error inserting client:', err);
    res.status(500).json({ error: err.message || err.toString() });
  }
});

app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, cedula, direccion, telefono, correo, plataforma } = req.body;

  pool.query(
    `UPDATE clientes 
     SET nombre = $1, cedula = $2, direccion = $3, telefono = $4, correo = $5, plataforma = $6
     WHERE cita_id = $7
     RETURNING *`,
    [nombre, cedula, direccion, telefono, correo, plataforma],
    (err, result) => {
      if (err) {
        console.error('Error updating client:', err);
        return res.status(500).json({ error: 'Error updating client' });
      }
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'client not found' });
      }
      res.json(result.rows[0]);
    }
  );
});


// Update client by id
app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { paciente_id, medico_id, fecha, hora, motivo, descripcion, ubicacion, estatus } = req.body;

  pool.query(
    `UPDATE clientes 
     SET paciente_id = $1, medico_id = $2, fecha = $3, hora = $4, motivo = $5, descripcion = $6, ubicacion = $7, estatus = $8 
     WHERE cita_id = $9
     RETURNING *`,
    [paciente_id, medico_id, fecha, hora, motivo, descripcion, ubicacion, estatus, id],
    (err, result) => {
      if (err) {
        console.error('Error updating client:', err);
        return res.status(500).json({ error: 'Error updating client' });
      }
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'client not found' });
      }
      res.json(result.rows[0]);
    }
  );
});

// Delete client by id
app.delete('/clientes/:id', (req, res) => {
  const { id } = req.params;
  pool.query(
    'DELETE FROM clientes WHERE cita_id = $1',
    [id],
    (err) => {
      if (err) {
        console.error('Error deleting client:', err);
        return res.status(500).json({ error: 'Error deleting client' });
      }
      res.json({ message: 'client deleted successfully' });
    }
  );
});

/**
 * -------------------------
 * USER AUTHENTICATION ENDPOINTS
 * -------------------------
 */

// Register new user
app.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      `INSERT INTO usuario (nombre, email, password) VALUES ($1, $2, $3)`,
      [nombre, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login endpoint (admin only)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Search only for admin user
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1 AND rol = $2',
      [email, 'admin']
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Admin user not found' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * -------------------------
 * CSV UPLOAD ENDPOINTS
 * -------------------------
 */

// Upload clients CSV
app.post("/upload/clientes", async (req, res) => {
  try {
    const result = await uploadClientesCSV();
    res.json({
      message: "Upload completed",
      ...result
    });
  } catch (err) {
    res.status(500).json({
      message: "Upload error",
      error: err.error || err.message
    });
  }
});

// Upload facturaciones CSV
app.post("/upload/facturaciones", async (req, res) => {
  try {
    const result = await uploadFacturacionesCSV();
    res.json({
      message: "Upload completed",
      ...result
    });
  } catch (err) {
    res.status(500).json({
      message: "Upload error",
      error: err.error || err.message
    });
  }
});

// Upload transaccitions CSV
app.post("/upload/transacciones", async (req, res) => {
  try {
    const result = await uploadTransaccionesCSV();
    res.json({
      message: "Upload completed",
      ...result
    });
  } catch (err) {
    res.status(500).json({
      message: "Upload error",
      error: err.error || err.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
