import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { BrandLogo } from "../src/components/public/BrandLogo";
import { DEFAULT_LOGO, MAX_LOGO_BYTES, safeLogoUrl, validateLogo } from "../src/lib/branding";

test("logo URLs reject insecure protocols and credentials", () => {
  for (const url of ["javascript:alert(1)", "http://cdn.example.com/logo.png", "https://user:secret@cdn.example.com/logo.png", "//cdn.example.com/logo.png", null]) assert.equal(safeLogoUrl(url), null);
  assert.equal(safeLogoUrl("https://cdn.example.com/logo.webp"), "https://cdn.example.com/logo.webp");
});
test("default and custom logo render with fixed dimensions and aspect containment", () => {
  const fallback = renderToStaticMarkup(<BrandLogo />);
  assert.ok(fallback.includes(encodeURIComponent(DEFAULT_LOGO))); assert.ok(fallback.includes('width="694"')); assert.ok(fallback.includes("object-contain"));
  const custom = renderToStaticMarkup(<BrandLogo branding={{ logoUrl: "https://cdn.example.com/logo.webp", width: 160, height: 80 }} />);
  assert.ok(custom.includes('src="https://cdn.example.com/logo.webp"')); assert.ok(custom.includes('width="160"')); assert.ok(custom.includes('height="80"'));
});
test("client validation rejects SVG, oversized files and mismatched signatures", async () => {
  for (const file of [new File(["<svg/>"], "logo.svg", { type: "image/svg+xml" }), new File([new Uint8Array(MAX_LOGO_BYTES + 1)], "logo.png", { type: "image/png" }), new File(["broken"], "logo.png", { type: "image/png" })]) await assert.rejects(() => validateLogo(file));
});
test("client validates decoded dimensions and closes bitmap", async () => {
  const original = globalThis.createImageBitmap;
  const file = new File([new Uint8Array([137,80,78,71,13,10,26,10])], "logo.png", { type: "image/png" });
  let closed = false;
  try {
    globalThis.createImageBitmap = (async () => ({ width: 160, height: 80, close: () => { closed = true; } })) as typeof createImageBitmap;
    assert.deepEqual(await validateLogo(file), { width: 160, height: 80 }); assert.equal(closed, true);
    globalThis.createImageBitmap = (async () => ({ width: 5000, height: 80, close() {} })) as typeof createImageBitmap;
    await assert.rejects(() => validateLogo(file));
    globalThis.createImageBitmap = (async () => { throw new Error("decode failed"); }) as typeof createImageBitmap;
    await assert.rejects(() => validateLogo(file), /corrupted/);
  } finally { globalThis.createImageBitmap = original; }
});
