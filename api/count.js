// api/count.js
// Vercel Serverless Function: GET returns current count, POST increments.
// Uses Upstash Redis REST API (env vars required in Vercel project settings:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
// If env vars are missing, returns {count: null, fallback: true} gracefully.
//
// Keys:
//   bts:visitors        — landing page views
//   bts:assessment_done — completed assessments (the "honest" number)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const key = (req.query.key === 'visitors') ? 'bts:visitors' : 'bts:assessment_done';

  // Graceful fallback when Redis isn't configured yet.
  if (!url || !token) {
    return res.status(200).json({ count: null, fallback: true, note: 'Upstash env vars not set' });
  }

  try {
    const path = req.method === 'POST' ? `incr/${key}` : `get/${key}`;
    const r = await fetch(`${url}/${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await r.json();
    const count = typeof data.result === 'number' ? data.result : Number(data.result) || 0;
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ count });
  } catch (err) {
    return res.status(500).json({ error: 'counter_failed', message: String(err) });
  }
}
