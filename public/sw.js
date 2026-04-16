// Killswitch service worker.
//
// The site used to ship a Workbox-generated service worker via
// vite-plugin-pwa. After the migration to Next.js we stopped generating
// one, but returning visitors still have the old SW registered in their
// browsers. That stale SW was intercepting fetches and serving cached
// Vite bundles, which hydrated the new Next.js HTML with the old SPA
// and wiped the updated content from the DOM.
//
// This file sits at /sw.js so the browser's periodic update check can
// pick it up and replace the old SW. On activate we unregister
// ourselves and delete every cache, so the site stops being controlled
// by any service worker. There's no fetch handler — we never intercept
// a network request.

self.addEventListener('install', () => {
  // Skip the usual "wait until all old clients close" step so the
  // killswitch activates on this page load instead of some future one.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Take control of any pages that the old SW was controlling, so our
    // reload call below actually triggers a fresh network fetch instead
    // of going through the old cache.
    try { await self.clients.claim(); } catch (e) {}

    // Nuke every Cache Storage entry (Workbox precache, runtime caches).
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    } catch (e) {}

    // Unregister ourselves. Subsequent navigations will be regular
    // un-intercepted fetches handled by Next.js on Vercel.
    try { await self.registration.unregister(); } catch (e) {}

    // Reload any open tabs so the visitor sees the real Next.js page
    // right away rather than a stale Vite-bundle-served render.
    try {
      const windowClients = await self.clients.matchAll({ type: 'window' });
      for (const c of windowClients) {
        try { c.navigate(c.url); } catch (e) {}
      }
    } catch (e) {}
  })());
});
