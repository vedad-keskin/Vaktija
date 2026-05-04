/**
 * Same-origin proxy for api.vaktija.ba (production on Vercel).
 * Avoids browser CORS when upstream returns 503 without ACAO (e.g. Render cold start).
 * Retries transient errors; sets Cache-Control for edge caching.
 */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  let segments = req.query.path;
  if (segments == null) {
    res.status(400).send('Bad Request');
    return;
  }
  if (!Array.isArray(segments)) {
    segments = [segments];
  }
  if (segments.length === 0) {
    res.status(400).send('Bad Request');
    return;
  }

  const { path: _path, ...queryRest } = req.query;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(queryRest)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v != null) qs.append(key, String(v));
      }
    } else {
      qs.set(key, String(value));
    }
  }
  const search = qs.toString() ? `?${qs}` : '';

  const target = `https://api.vaktija.ba/${segments.join('/')}${search}`;
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const upstream = await fetch(target, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Vaktija-BH-Proxy/1.0',
        },
      });

      if (upstream.ok) {
        const body = await upstream.text();
        const ct = upstream.headers.get('content-type') || 'application/json';
        res.setHeader('Content-Type', ct);
        res.setHeader(
          'Cache-Control',
          'public, s-maxage=1800, stale-while-revalidate=86400',
        );
        res.status(upstream.status).send(body);
        return;
      }

      const retryable = [502, 503, 429, 408].includes(upstream.status);
      if (!retryable || attempt === maxAttempts) {
        const errBody = await upstream.text();
        const ct = upstream.headers.get('content-type') || 'text/plain';
        res.setHeader('Content-Type', ct);
        res.status(upstream.status).send(errBody);
        return;
      }
    } catch {
      if (attempt === maxAttempts) {
        res.status(502).json({ error: 'Upstream unreachable' });
        return;
      }
    }

    const delay = Math.min(2000 * 2 ** (attempt - 1), 10000);
    await sleep(delay);
  }
};
