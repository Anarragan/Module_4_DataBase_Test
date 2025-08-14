// src/views/CitasView.js
import api from '../api.js';
import { navigate } from '../router.js';

export default function ClientesView() {
  // Render main container with buttons and empty content areas
  document.getElementById('app').innerHTML = `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center">
        <h3>Clientes</h3>
        <div>
          <button id="newCliente" class="btn btn-primary me-2">Nuevo Cliente</button>
          <button id="back" class="btn btn-secondary">Volver</button>
        </div>
      </div>
      <hr>
      <div id="clientesList"></div>
      <div id="clientFromContainer" class="mt-4"></div>
    </div>
  `;

  // Button listeners
  document.getElementById('back').addEventListener('click', () => navigate('/dashboard'));
  document.getElementById('newCliente').addEventListener('click', () => showClientForm());

  loadClientes();

  // Load clients from API
  async function loadClientes() {
    try {
      const res = await api.get('/clientes'); // Fetch all clients with full info
      const clientes = Array.isArray(res.data) ? res.data : [];

      const list = document.getElementById('clientesList');

      if (!clientes.length) {
        list.innerHTML = '<p>No hay clientes registrados</p>';
        return;
      }

      // Render table structure
      list.innerHTML = `
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID cliente</th>
              <th>Nombre</th>
              <th>Cedula</th>
              <th>Direccion</th>
              <th>Telefono</th>
              <th>Correo</th>
              <th>Plataforma</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;

      const tbody = list.querySelector('tbody');

      // Fill table rows with client data
      clientes.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.cliente_id}</td>
          <td>${c.nombre}</td>          
          <td>${c.cedula}</td>           
          <td>${c.cedula}</td>
          <td>${c.telefono}</td>
          <td>${c.correo}</td>
          <td>${c.plataforma}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" data-id="${c.cliente_id}" data-action="edit">Editar</button>
            <button class="btn btn-sm btn-danger" data-id="${c.cliente_id}" data-action="delete">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Add event listeners for edit and delete buttons
      tbody.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.dataset.id;
          const action = e.target.dataset.action;

          if (action === 'edit') {
            // Fetch single client by ID for editing
            const res = await api.put(`/clientes/${id}`);
            showClientForm(res.data);
          } else if (action === 'delete') {
            if (confirm('¿Eliminar este cliente?')) {
              await api.delete(`/clientes/${id}`);
              loadClientes(); // Reload list after delete
            }
          }
        });
      });

    } catch (err) {
      console.error(err);
      document.getElementById('clientesList').innerHTML =
        '<div class="alert alert-danger">Error cargando clientes</div>';
    }
  }

  // Show form for creating or editing an client
  function showClientForm(cliente = null) {
    const formContainer = document.getElementById('clientFromContainer');
    formContainer.innerHTML = `
      <h5>${cliente ? 'Editar cliente' : 'Nuevo cliente'}</h5>
      <form id="clienteForm">
        <div class="mb-2">
          <label>Cliente ID</label>
          <input type="text" name="cliente_id" class="form-control" value="${cliente?.cliente_id || ''}" required>
        </div>
        <div class="mb-2">
          <label>Nombre</label>
          <input type="text" name="nombre" class="form-control" value="${cliente?.nombre || ''}" required>
        </div>
        <div class="mb-2">
          <label>Cedula</label>
          <input type="text" name="cedula" class="form-control" value="${cliente?.cedula || ''}" required>
        </div>
        <div class="mb-2">
          <label>Direccion</label>
          <input type="text" name="direccion" class="form-control" value="${cliente?.direccion || ''}" required>
        </div>
        <div class="mb-2">
          <label>Telefono</label>
          <input type="text" name="telefono" class="form-control" value="${cliente?.telefono || ''}" required>
        </div>
        <div class="mb-2">
          <label>Correo</label>
          <input type="text" name="correo" class="form-control" value="${cliente?.correo || ''}" required>
        </div>

        <div class="mb-2">
          <label>Plataforma</label>
          <input type="text" name="plataforma" class="form-control" value="${cliente?.plataforma || ''}" required>
        </div>
        
        <button type="submit" class="btn btn-success">${cliente ? 'Actualizar' : 'Crear'}</button>
        <button type="button" id="cancelForm" class="btn btn-secondary ms-2">Cancelar</button>
      </form>
    `;

    // Cancel button clears the form
    document.getElementById('cancelForm').addEventListener('click', () => {
      formContainer.innerHTML = '';
    });

    // Handle form submit for create or update
    document.getElementById('clienteForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      // Collect form data
      const formData = Object.fromEntries(new FormData(e.target).entries());

      try {
        // Prepare data with correct types
        const clienteData = {
          cliente_id: formData.cliente_id,
          nombre: formData.nombre,
          cedula:formData.cedula,
          direccion:formData.direccion,
          telefono:formData.telefono,
          correo: formData.correo,
          plataforma: formData.plataforma
        };

        // Call update or create API
        if (cliente) {
          await api.put(`/clientes/${cliente.cliente_id}`, clienteData);
        } else {
          await api.post('/clientes-nuevos', clienteData);
        }

        formContainer.innerHTML = '';
        loadClientes(); // Reload clients

      } catch (error) {
        console.error("Error saving appointment:", error.response?.data || error.message);
        alert('Error guardando la cliente. Revisa que los datos sean correctos.');
      }
    });
  }
}