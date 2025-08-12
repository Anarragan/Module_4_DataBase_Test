// src/auth.js
import api from './api.js';

export async function login(email, password) {
  // backend: POST /auth/login -> { token, user }
  const res = await api.post('/login', { email, password });
  const { token, user } = res.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // optionally call backend logout endpoint
}
export function isAuthenticated() {
  return !!localStorage.getItem('token');
}
