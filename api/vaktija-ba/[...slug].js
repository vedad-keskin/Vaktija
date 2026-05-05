const ORIGIN = 'https://api.vaktija.ba';

async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const slug = req.query.slug;
  const pathTail = Array.isArray(slug) ? slug.join('/') : String(slug ?? '');
  const path = pathTail.startsWith('/') ? pathTail : `/${pathTail}`;
  let search = '';
  if (typeof req.url === 'string') {
    const q = req.url.indexOf('?');
    if (q !== -1) search = req.url.slice(q);
  }

  const targetUrl = `${ORIGIN}${path}${search}`;

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: {
        Accept: req.headers.accept || 'application/json',
      },
    });

    const body = await upstream.text();
    const ct = upstream.headers.get('content-type') || 'application/json';

    res.status(upstream.status).setHeader('Content-Type', ct);
    res.send(body);
  } catch {
    res.status(502).json({ error: 'Upstream fetch failed' });
  }
}

module.exports = handler;
