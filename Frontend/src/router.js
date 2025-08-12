// src/router.js
const routes = {};

export function registerRoute(path, renderFn) {
  routes[path] = renderFn;
}

export function navigate(path) {
  history.pushState(null, '', path);
  renderRoute();
}

export function renderRoute() {
  const path = location.pathname || '/';
  const renderFn = routes[path] || routes['/404'] || (() => {
    document.getElementById('app').innerHTML = '<h3>Not Found</h3>';
  });
  renderFn();
}

window.addEventListener('popstate', renderRoute);
