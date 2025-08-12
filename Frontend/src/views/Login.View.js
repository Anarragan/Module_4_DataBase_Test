// src/views/LoginView.js
import { login } from '../auth.js';
import { navigate } from '../router.js';

export default function LoginView() {
  document.getElementById('app').innerHTML = `
    <div class="container mt-5" style="max-width:420px;">
      <h2 class="mb-4">Admin - Login</h2>
      <form id="loginForm">
        <div class="mb-3"><label>Email</label><input type="email" id="email" class="form-control" required></div>
        <div class="mb-3"><label>Contraseña</label><input type="password" id="password" class="form-control" required></div>
        <button class="btn btn-primary w-100">Entrar</button>
      </form>
      <div id="msg" class="mt-3 text-danger"></div>
    </div>
  `;
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      document.getElementById('msg').textContent = err.response?.data?.message || 'Error en login';
    }
  });
}
