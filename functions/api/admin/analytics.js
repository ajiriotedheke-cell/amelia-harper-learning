export async function onRequestGet({ request, env }) {
  const email = request.headers.get('Cf-Access-Authenticated-User-Email') || '';
  if (!env.ADMIN_EMAIL || email.toLowerCase() !== env.ADMIN_EMAIL.toLowerCase()) return Response.json({ error: 'Administrator access required.' }, { status: 403 });
  if (!env.DB) return Response.json({ error: 'Database is not configured.' }, { status: 503 });
  const [totals, games, countries] = await Promise.all([
    env.DB.prepare(`SELECT COUNT(*) AS events, SUM(CASE WHEN event_name='game_start' THEN 1 ELSE 0 END) AS starts, SUM(CASE WHEN event_name='game_complete' THEN 1 ELSE 0 END) AS completions, SUM(CASE WHEN event_name='game_error' THEN 1 ELSE 0 END) AS errors FROM game_events WHERE created_at >= datetime('now','-30 days')`).first(),
    env.DB.prepare(`SELECT game_slug, SUM(CASE WHEN event_name='game_start' THEN 1 ELSE 0 END) AS starts, SUM(CASE WHEN event_name='game_complete' THEN 1 ELSE 0 END) AS completions, SUM(CASE WHEN event_name='game_error' THEN 1 ELSE 0 END) AS errors FROM game_events WHERE created_at >= datetime('now','-30 days') GROUP BY game_slug ORDER BY starts DESC LIMIT 50`).all(),
    env.DB.prepare(`SELECT country_code, COUNT(*) AS events FROM game_events WHERE created_at >= datetime('now','-30 days') AND country_code IS NOT NULL GROUP BY country_code ORDER BY events DESC LIMIT 20`).all()
  ]);
  return Response.json({ period: 'last_30_days', totals, games: games.results || [], countries: countries.results || [] }, { headers: { 'Cache-Control': 'no-store' } });
}
