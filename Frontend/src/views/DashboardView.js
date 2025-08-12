// src/views/DashboardView.js
import api from '../api.js';
import { logout } from '../auth.js';
import { navigate } from '../router.js';

export default function DashboardView() {
  // Render the main dashboard HTML
  document.getElementById('app').innerHTML = `
    <div class="container mt-4">

      <!-- Header with navigation buttons -->

      <div class="d-flex justify-content-between align-items-center">
        <h3>Dashboard - Admin</h3>
        <div>
          <button id="goClientes" class="btn btn-outline-secondary me-2">Gestionar Clientes</button>
          <button id="logoutBtn" class="btn btn-danger">Logout</button>
        </div>
      </div>
      <hr>

      <!-- Section with cards for Clientes, Facturaciones and Transacciones -->
      
      <div class="row g-3">
        <div class="col-md-6">
          <div class="card p-3">
            <h5>Clientes</h5>
            <button id="loadClientes" class="btn btn-primary mt-2">Cargar Clientes</button>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card p-3">
            <h5>Facturaciones</h5>
            <button id="loadFacturaciones" class="btn btn-primary mt-2">Cargar Facturaciones</button>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card p-3">
            <h5>Transacciones</h5>
            <button id="loadTransacciones" class="btn btn-primary mt-2">Cargar Citas</button>
          </div>
        </div>
      </div>

    </div>
  `;

  // Navigation event listeners
  document.getElementById('goClientes').addEventListener('click', () => navigate('/clientes'));
  document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
    navigate('/login');
  });

  /**
   * Generic function to trigger POST requests to server endpoints
   * @param {string} endpoint API endpoint to post
   */
  async function triggerServerInsert(endpoint) {
    try {
      const res = await api.post(endpoint);
      document.getElementById('result').innerHTML =
        `<div class="alert alert-success">${res.data.message || 'Datos insertados con éxito'}</div>`;
    } catch (err) {
      console.error(err);
      document.getElementById('result').innerHTML =
        `<div class="alert alert-danger">${err.response?.data?.message || 'Error en la inserción'}</div>`;
    }
  }

  // Button click event handlers for loading data
  document.getElementById('loadClientes')
    .addEventListener('click', () => triggerServerInsert('/upload/clientes'));

  document.getElementById('loadFacturaciones')
    .addEventListener('click', () => triggerServerInsert('/upload/facturaciones'));

  document.getElementById('loadTransacciones')
    .addEventListener('click', () => triggerServerInsert('/upload/transacciones'));

  // Filter citas by medico and month/year on button click
  document.getElementById('filtrarCitasBtn').addEventListener('click', async () => {
    const medicoId = document.getElementById('medicoIdFilter').value.trim();
    const mes = document.getElementById('mesFilter').value.trim();
    const anio = document.getElementById('anioFilter').value.trim();
    const lista = document.getElementById('citasFiltradasList');

    // Clear previous results
    lista.innerHTML = '';

    // Validate input fields
    if (!medicoId || !mes || !anio) {
      lista.innerHTML = '<li class="list-group-item text-danger">Por favor llena todos los campos.</li>';
      return;
    }

    try {
      // Call API to filter citas by doctor and date
      const res = await api.get('/citas/filtrar', {
        params: { medico_id: medicoId, mes, anio }
      });

      if (res.data.length === 0) {
        lista.innerHTML = '<li class="list-group-item">No se encontraron citas.</li>';
        return;
      }

      // Display filtered citas
      res.data.forEach(cita => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `fecha: ${cita.fecha} - hora: ${cita.hora} - Paciente: ${cita.paciente} - Médico: ${cita.medico} (${cita.especialidad}) - Estatus: ${cita.estatus}`;
        lista.appendChild(li);
      });
    } catch (error) {
      console.error(error);
      lista.innerHTML = '<li class="list-group-item text-danger">Error al obtener las citas.</li>';
    }
  });

  /**
   * Load and display the general list of all citas on dashboard load
   */
  async function cargarCitasGenerales() {
    const lista = document.getElementById('listaCitasGenerales');
    lista.innerHTML = '<li class="list-group-item">Cargando citas...</li>';

    try {
      const res = await api.get('/citas-detalladas');
      lista.innerHTML = '';

      if (res.data.length === 0) {
        lista.innerHTML = '<li class="list-group-item">No hay citas disponibles.</li>';
        return;
      }

      res.data.forEach(cita => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${cita.fecha} ${cita.hora} - Paciente: ${cita.paciente} - Médico: ${cita.medico} (${cita.especialidad}) - Estatus: ${cita.estatus}`;
        lista.appendChild(li);
      });
    } catch (error) {
      console.error(error);
      lista.innerHTML = '<li class="list-group-item text-danger">Error al cargar las citas.</li>';
    }
  }
  // Initial load of all citas
  cargarCitasGenerales();
}