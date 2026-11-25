export async function onRequestGet({ env }) {
  if (!env.DB) return Response.json({ error: 'Database is not configured.' }, { status: 503 });
  const rows = await env.DB.prepare('SELECT setting_key, setting_value FROM site_settings').all();
  const data = Object.fromEntries((rows.results || []).map(r => [r.setting_key, JSON.parse(r.setting_value)]));
  return Response.json(data, { headers: { 'Cache-Control': 'public, max-age=60' } });
}
