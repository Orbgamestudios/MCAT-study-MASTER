const API_ORIGIN = 'https://mcat-api.solitary-sky-76c1.workers.dev';

const DROP_HEADERS = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'host',
  'transfer-encoding',
  'upgrade',
]);

export async function onRequest({ request, params }) {
  const path = Array.isArray(params.path) ? params.path.join('/') : (params.path || '');
  const source = new URL(request.url);
  const target = new URL('/' + path, API_ORIGIN);
  target.search = source.search;

  const headers = new Headers(request.headers);
  headers.delete('host');

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(target.toString(), init);
  const outHeaders = new Headers(upstream.headers);
  DROP_HEADERS.forEach((h) => outHeaders.delete(h));
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  });
}
