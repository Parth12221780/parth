import type { Config } from "@netlify/functions";
import { sql, readSettings } from "../../lib/db.mts";
import { requireAdmin } from "../../lib/auth.mts";

const IMAGE_DATA = /^data:image\/(png|x-icon|vnd.microsoft.icon|svg\+xml|jpeg|webp);base64,/i;
const INTEGRATION_KEYS = ["google_verification", "ga4_measurement_id", "gtm_container_id", "google_ads_id", "google_ads_label", "adsense_publisher_id", "meta_pixel_id", "meta_domain_verification"];
const isObject = (v: unknown) => !!v && typeof v === "object" && !Array.isArray(v);

export default async (req: Request) => {
  const denied = await requireAdmin(); if (denied) return denied;
  if (req.method === "GET") return Response.json(await readSettings());

  const b = await req.json().catch(() => ({}));
  const wa = String(b.whatsapp_number || "").trim(), tg = String(b.telegram_link || "").trim();
  const fav = String(b.favicon_data || b.favicon_url || "").trim(), bg = String(b.background_data || "").trim();
  if (fav && !IMAGE_DATA.test(fav) && !/^https?:\/\//i.test(fav)) return Response.json({ error: "Invalid favicon image." }, { status: 400 });
  if (fav.length > 700000) return Response.json({ error: "Favicon file is too large. Keep it under about 500 KB." }, { status: 400 });
  if (bg && !IMAGE_DATA.test(bg) && !/^https?:\/\//i.test(bg)) return Response.json({ error: "Invalid background image." }, { status: 400 });
  if (bg.length > 3000000) return Response.json({ error: "Background image is too large. Keep it under about 2 MB." }, { status: 400 });
  const yt = Array.isArray(b.youtube_links) ? b.youtube_links.map((x: unknown) => String(x || "").trim()).filter(Boolean).slice(0, 100) : [];
  const seo = isObject(b.seo_pages) ? b.seo_pages : null;
  let integration: Record<string, string> | null = null;
  if (isObject(b.integration_config)) {
    integration = {};
    for (const k of INTEGRATION_KEYS) integration[k] = String(b.integration_config[k] || "").trim().slice(0, 300);
  }

  const pairs: [string, string][] = [["whatsapp_number", wa], ["telegram_link", tg], ["favicon_url", fav], ["background_data", bg], ["youtube_links", JSON.stringify(yt)]];
  if (seo !== null) pairs.push(["seo_pages", JSON.stringify(seo)]);
  if (integration !== null) pairs.push(["integration_config", JSON.stringify(integration)]);
  for (const [k, v] of pairs) {
    await sql`INSERT INTO site_settings (setting_key, setting_value, updated_at) VALUES (${k}, ${v}, now())
      ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = now()`;
  }
  return Response.json({ ok: true, whatsapp_number: wa, telegram_link: tg, favicon_url: fav, background_data: bg, youtube_links: yt, seo_pages: seo });
};

export const config: Config = { path: "/api/admin/settings", method: ["GET", "POST"] };
