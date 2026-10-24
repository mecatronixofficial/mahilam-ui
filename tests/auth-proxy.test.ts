import { test } from 'node:test';
import assert from 'node:assert/strict';
import config from '../next.config';
import { api, API_URL } from '../src/lib/api';

test('browser login, refresh and retry keep credentials on the frontend origin', async () => {
  const originalFetch = globalThis.fetch;
  const calls: { url: string; credentials?: RequestCredentials }[] = [];
  let sessionChecks = 0;
  globalThis.fetch = (async (url, init) => {
    const path = String(url);
    calls.push({ url: path, credentials: init?.credentials });
    const unauthorized = path.endsWith('/auth/me') && sessionChecks++ === 0;
    return Response.json({ success: !unauthorized, data: unauthorized ? null : { role: 'ADMIN' } }, { status: unauthorized ? 401 : 200 });
  }) as typeof fetch;
  try {
    assert.equal(API_URL, '/api/v1');
    await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: 'fixture@example.test', password: 'Fixture-only-123' }) });
    await api('/auth/me');
    assert.deepEqual(calls.map(call => call.url), ['/api/v1/auth/login', '/api/v1/auth/me', '/api/v1/auth/refresh', '/api/v1/auth/me']);
    assert.ok(calls.every(call => call.credentials === 'include'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('API rewrites use the internal upstream or the existing public backend configuration', async () => {
  const originalInternal = process.env.API_URL_INTERNAL;
  const originalPublic = process.env.NEXT_PUBLIC_API_URL;
  try {
    process.env.API_URL_INTERNAL = 'https://backend.example.test/api/v1/';
    process.env.NEXT_PUBLIC_API_URL = 'https://legacy.example.test/api/v1';
    assert.deepEqual(await config.rewrites!(), [{ source: '/api/v1/:path*', destination: 'https://backend.example.test/api/v1/:path*' }]);
    delete process.env.API_URL_INTERNAL;
    assert.deepEqual(await config.rewrites!(), [{ source: '/api/v1/:path*', destination: 'https://legacy.example.test/api/v1/:path*' }]);
    delete process.env.NEXT_PUBLIC_API_URL;
    assert.deepEqual(await config.rewrites!(), [{ source: '/api/v1/:path*', destination: 'http://localhost:4000/api/v1/:path*' }]);
  } finally {
    if (originalInternal === undefined) delete process.env.API_URL_INTERNAL; else process.env.API_URL_INTERNAL = originalInternal;
    if (originalPublic === undefined) delete process.env.NEXT_PUBLIC_API_URL; else process.env.NEXT_PUBLIC_API_URL = originalPublic;
  }
});
