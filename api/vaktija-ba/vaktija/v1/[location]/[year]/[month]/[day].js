const ORIGIN = 'https://api.vaktija.ba';

async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const q = req.query;
  const location = Array.isArray(q.location) ? q.location[0] : q.location;
  const year = Array.isArray(q.year) ? q.year[0] : q.year;
  const month = Array.isArray(q.month) ? q.month[0] : q.month;
  const day = Array.isArray(q.day) ? q.day[0] : q.day;

  if (
    location === undefined ||
    year === undefined ||
    month === undefined ||
    day === undefined
  ) {
    res.status(400).json({ error: 'Missing path parameters' });
    return;
  }

  let search = '';
  if (typeof req.url === 'string') {
    const qi = req.url.indexOf('?');
    if (qi !== -1) search = req.url.slice(qi);
  }

  const path = `/vaktija/v1/${encodeURIComponent(location)}/${encodeURIComponent(year)}/${encodeURIComponent(month)}/${encodeURIComponent(day)}`;
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

    res
      .status(upstream.status)
      .setHeader('Content-Type', ct)
      .setHeader('Cache-Control', 'private, no-store');
    res.send(body);
  } catch {
    res.status(502).json({ error: 'Upstream fetch failed' });
  }
}

module.exports = handler;
