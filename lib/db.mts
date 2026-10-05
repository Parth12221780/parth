import { getDatabase } from "@netlify/database";

export const sql = getDatabase().sql;

export const SETTING_KEYS = ["whatsapp_number", "telegram_link", "favicon_url", "background_data", "youtube_links", "seo_pages", "integration_config"];

function parseJson(value: string, fallback: unknown) {
  try { return JSON.parse(value || ""); } catch { return fallback; }
}

export async function readSettings() {
  const rows = await sql`SELECT setting_key, setting_value FROM site_settings`;
  const out: Record<string, unknown> = { whatsapp_number: "", telegram_link: "", favicon_url: "", background_data: "", youtube_links: [], seo_pages: {}, integration_config: {} };
  for (const r of rows as { setting_key: string; setting_value: string }[]) {
    if (!SETTING_KEYS.includes(r.setting_key)) continue;
    if (r.setting_key === "youtube_links") out.youtube_links = parseJson(r.setting_value, []);
    else if (r.setting_key === "seo_pages") out.seo_pages = parseJson(r.setting_value, {});
    else if (r.setting_key === "integration_config") out.integration_config = parseJson(r.setting_value, {});
    else out[r.setting_key] = r.setting_value || "";
  }
  return out;
}
