// Bump CACHE_NAME any time we change the SW or want to force-invalidate
// existing clients. The activate handler deletes every cache that
// doesn't match the current name, which forces a clean state.
const CACHE_NAME = "vedic-transform-v2";
const OFFLINE_URL = "/";

const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Don't let a single missing asset abort the whole install. addAll
      // is atomic; if any fetch fails, none of the others are stored,
      // so we use individual put()s with catch().
      return Promise.all(
        PRECACHE_ASSETS.map((url) =>
          fetch(url)
            .then((res) => {
              if (res && res.ok) return cache.put(url, res);
            })
            .catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ── Web Push handlers (P0-1) ─────────────────────────────────────────────
// The backend sends a JSON payload via web-push; we render it as a system
// notification and, on click, focus an existing tab or open one to the
// notification's target URL.

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "Vedic Transform", body: event.data?.text() || "" };
  }

  const title = data.title || "Vedic Transform";
  const options = {
    body: data.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { url: data.url || "/dashboard" },
    tag: data.tag || undefined,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || "/dashboard";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsArr) => {
        // Reuse an existing tab if one is already on a Vedic Transform page.
        for (const client of clientsArr) {
          if (client.url && "focus" in client) {
            client.focus();
            try { client.postMessage({ type: "push-click", url: targetUrl }); } catch {}
            return client.navigate ? client.navigate(targetUrl) : undefined;
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET, cross-origin, and non-http(s) schemes (chrome-extension,
  // data:, etc.). Touching those is what generated the flood of
  // "Failed to execute 'put' on 'Cache'" errors users were seeing.
  if (event.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (!url.protocol.startsWith("http")) return;

  // Skip API + auth routes — those need to hit the network every time
  // (auth tokens, push subscriptions, dosha results, etc.). Caching
  // them silently breaks login and check-in flows.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/data/")
  ) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(OFFLINE_URL).then((res) => res || Response.error())
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Stale-while-revalidate: serve cached immediately, refresh in bg.
        fetch(event.request)
          .then((response) => {
            if (response && response.status === 200 && response.type === "basic") {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response.clone()).catch(() => {});
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone).catch(() => {});
            });
          }
          return response;
        })
        .catch(() => Response.error());
    })
  );
});
