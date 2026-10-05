CREATE TABLE IF NOT EXISTS site_settings (
  setting_key text PRIMARY KEY,
  setting_value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO site_settings (setting_key, setting_value)
VALUES
  ('whatsapp_number','8207373406'),
  ('telegram_link','https://t.me/+5MHFX7UjtJYwYWI1'),
  ('favicon_url',''),
  ('youtube_links','[]')
ON CONFLICT (setting_key) DO NOTHING;