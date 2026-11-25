CREATE TABLE IF NOT EXISTS site_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS game_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_slug TEXT NOT NULL,
  event_name TEXT NOT NULL,
  age_band TEXT,
  device_type TEXT,
  country_code TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_game_events_slug_time ON game_events(game_slug, created_at);
CREATE INDEX IF NOT EXISTS idx_game_events_event_time ON game_events(event_name, created_at);
