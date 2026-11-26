const ALLOWED = new Set(['facebookUrl','youtubeUrl','tiktokUrl','gumroadStoreUrl','bedtimeTitle','bedtimeCollectionUrl','bedtimeButtonText','bedtimeDescription','bedtimePublished','youtubeVideos']);
const URL_KEYS = new Set(['facebookUrl','youtubeUrl','tiktokUrl','gumroadStoreUrl','bedtimeCollectionUrl']);

export async function onRequestPut({ request, env }) {
  const email = request.headers.get('Cf-Access-Authenticated-User-Email') || '';
  if (!env.ADMIN_EMAIL || email.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) return Response.json({ error: 'Administrator access required.' }, { status: 403 });
  if (!env.DB) return Response.json({ error: 'Database is not configured.' }, { status: 503 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const entries = Object.entries(body).filter(([key]) => ALLOWED.has(key));
  for (const [key, value] of entries) {
    if (URL_KEYS.has(key) && value && (!/^https:\/\//i.test(value) || value.length > 500)) return Response.json({ error: `Please enter a valid HTTPS URL for ${key}.` }, { status: 400 });
    if (key === 'youtubeVideos') {
      if (!Array.isArray(value) || value.length > 30) return Response.json({ error: 'You can add up to 30 YouTube videos.' }, { status: 400 });
      for (const video of value) {
        if (!video || typeof video.title !== 'string' || video.title.trim().length < 1 || video.title.length > 120 || !/^[A-Za-z0-9_-]{11}$/.test(video.videoId || '')) {
          return Response.json({ error: 'Each video needs a title (1–120 characters) and a valid YouTube video ID.' }, { status: 400 });
        }
      }
    }
    if (typeof value === 'string' && value.length > 2000) return Response.json({ error: `${key} is too long.` }, { status: 400 });
  }
  const stmt = env.DB.prepare('INSERT INTO site_settings (setting_key, setting_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value, updated_at=CURRENT_TIMESTAMP');
  await env.DB.batch(entries.map(([key, value]) => stmt.bind(key, JSON.stringify(value))));
  return Response.json({ ok: true, saved: entries.length });
}
