if (location.protocol === 'file:') {
  const fallback = document.createElement('script');
  fallback.src = 'standalone.js';
  document.head.append(fallback);
} else {
  import('./app.js');
}
