// src/main.js
import { registerRoute, renderRoute } from './router.js';
import LoginView from './views/Login.View.js';
import DashboardView from './views/DashboardView.js';
import ClientesView from './views/ClientesView.js';

registerRoute('/', () => {
  // si autenticado -> dashboard, si no -> login
  const token = localStorage.getItem('token');
  if (token) DashboardView();
  else LoginView();
});
registerRoute('/dashboard', DashboardView);
registerRoute('/clientes', ClientesView);
registerRoute('/login', LoginView);
registerRoute('/404', () => { document.getElementById('app').innerHTML = '<h3>404</h3>'; });

renderRoute();