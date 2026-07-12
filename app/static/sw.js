self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Let the browser handle standard fetch operations directly
  return;
});
