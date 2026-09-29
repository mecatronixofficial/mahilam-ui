/*
 * Little Mahilam service worker.
 * Only job: when a page navigation fails because there is no internet, show a
 * friendly offline page instead of the browser's error. Nothing else is cached,
 * so the site can never serve stale content.
 */
const OFFLINE_HTML = `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>You're offline | Little Mahilam Preschool</title><meta name="robots" content="noindex"><style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#173c2f;background:radial-gradient(30rem 22rem at 12% 20%,rgba(247,200,91,.42),transparent 65%),radial-gradient(28rem 22rem at 88% 18%,rgba(239,158,138,.38),transparent 65%),linear-gradient(135deg,#fff8e7,#eef7f2 55%,#fff1ec)}
.card{max-width:460px;width:100%;text-align:center;padding:48px 28px;border-radius:32px;background:rgba(255,255,255,.62);border:1px solid rgba(255,255,255,.8);box-shadow:0 24px 50px -26px rgba(23,60,47,.4);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
.icon{width:80px;height:80px;margin:0 auto;border-radius:26px;display:grid;place-items:center;background:linear-gradient(135deg,#f7c85b,#ef9e8a);font-size:38px}
h1{margin:22px 0 8px;font-size:28px}p{margin:0;color:#52675e;line-height:1.7;font-size:17px}
button{margin-top:26px;border:0;border-radius:999px;padding:13px 22px;font-weight:800;font-size:15px;color:#fff;background:linear-gradient(135deg,#2f6a54,#285744);cursor:pointer}
</style></head><body><main class="card"><div class="icon" aria-hidden="true">📡</div><h1>You're offline</h1><p>We can't reach Little Mahilam right now. Please check your Wi-Fi or mobile data and try again.</p><button onclick="location.reload()">Try again</button></main>
<script>addEventListener('online',function(){location.reload()})</script></body></html>`;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.mode !== "navigate" || request.method !== "GET") return;
  event.respondWith(
    fetch(request).catch(() => new Response(OFFLINE_HTML, { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } })),
  );
});
