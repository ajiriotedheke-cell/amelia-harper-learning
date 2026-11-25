const ALLOWED_EVENTS = new Set(['game_start','game_complete','level_complete','replay','game_error']);
const AGE_BANDS = new Set(['2-4','5-7','8-10','11-12','unknown']);
export async function onRequestPost({ request, env }) {
  if (!env.DB) return Response.json({ error: 'Analytics database is not configured.' }, { status: 503 });
  let d; try { d = await request.json(); } catch { return Response.json({ error: 'Invalid event.' }, { status: 400 }); }
  const slug = String(d.gameSlug || '').replace(/[^a-z0-9-]/gi,'').slice(0,80);
  const event = String(d.eventName || '');
  const age = AGE_BANDS.has(d.ageBand) ? d.ageBand : 'unknown';
  const device = ['mobile','tablet','desktop','unknown'].includes(d.deviceType) ? d.deviceType : 'unknown';
  const country = /^[A-Z]{2}$/.test(request.headers.get('CF-IPCountry') || '') ? request.headers.get('CF-IPCountry') : null;
  if (!slug || !ALLOWED_EVENTS.has(event)) return Response.json({ error: 'Unsupported event.' }, { status: 400 });
  // No child names, email addresses, precise location, advertising IDs or persistent player IDs are collected.
  await env.DB.prepare('INSERT INTO game_events (game_slug,event_name,age_band,device_type,country_code) VALUES (?,?,?,?,?)').bind(slug,event,age,device,country).run();
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
