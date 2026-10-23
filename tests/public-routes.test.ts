import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import path from "node:path";

/** Opt in after a production build: CRM_PUBLIC_SMOKE=true bun test tests/public-routes.test.ts */
test("all existing public routes serve production HTML", { skip: process.env.CRM_PUBLIC_SMOKE !== "true", timeout: 120_000 }, async () => {
  const socket = createServer(); socket.listen(0, "127.0.0.1"); await once(socket, "listening");
  const address = socket.address();
  assert.ok(address && typeof address === "object");
  const port = address.port; socket.close(); await once(socket, "close");
  const server = spawn(process.execPath, ["--bun", path.resolve("node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)], { windowsHide: true, stdio: "ignore", env: { ...process.env, NODE_ENV: "production" } });
  let startupError: Error | undefined;
  server.on("error", (error) => { startupError = error; });
  const base = `http://127.0.0.1:${port}`;
  const routes = ["/", "/about", "/programs", "/learning-approach", "/activities", "/facilities", "/gallery", "/events", "/admissions", "/contact", "/faq", "/blog", "/preschool-in-tiruppur", "/privacy-policy", "/login"];
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (startupError) throw startupError;
      if (server.exitCode !== null) throw new Error("Production server exited before startup");
      try { if ((await fetch(`${base}/icon.svg`, { signal: AbortSignal.timeout(1000) })).ok) { ready = true; break; } } catch { /* wait for listener */ }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.ok(ready, "Production server must start");
    // Batch requests without treating a CMS fallback as a verified live integration.
    const results = await Promise.allSettled(routes.map(async (route) => {
      const response = await fetch(`${base}${route}`, { signal: AbortSignal.timeout(60_000) });
      assert.equal(response.status, 200, route);
      assert.ok(response.headers.get("content-type")?.includes("text/html"), route);
      const html = await response.text();
      assert.ok(html.includes("<html") && html.includes("<main"), `${route} must render a document`);
      assert.ok(!html.includes('id="__next_error__"'), `${route} must not render the Next.js error document`);
    }));
    for (const result of results) if (result.status === "rejected") throw result.reason;
  } finally {
    if (server.pid && server.exitCode === null) { server.kill(); await once(server, "exit"); }
  }
});
