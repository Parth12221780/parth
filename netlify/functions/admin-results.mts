import type { Config } from "@netlify/functions";
import { sql } from "../../lib/db.mts";
import { requireAdmin } from "../../lib/auth.mts";

export default async (req: Request) => {
  const denied = await requireAdmin(); if (denied) return denied;
  if (req.method === "GET") {
    const rows = await sql`SELECT r.id, r.game_id, r.result_date::text AS result_date, r.result_time, r.result_value, r.updated_at, g.name, g.slug
      FROM results r JOIN games g ON g.id = r.game_id ORDER BY r.result_date DESC, g.sort_order ASC LIMIT 200`;
    return Response.json({ results: rows });
  }
  const body = await req.json().catch(() => ({}));
  const value = String(body.result_value || "").trim();
  if (!body.game_id || !body.result_date || !value) return Response.json({ error: "game_id, result_date and result_value are required" }, { status: 400 });
  const rows = await sql`INSERT INTO results (game_id, result_date, result_time, result_value, updated_at)
    VALUES (${String(body.game_id)}::uuid, ${String(body.result_date)}::date, ${String(body.result_time || "")}, ${value}, now())
    ON CONFLICT (game_id, result_date) DO UPDATE SET result_time = EXCLUDED.result_time, result_value = EXCLUDED.result_value, updated_at = now()
    RETURNING id, game_id, result_date::text AS result_date, result_time, result_value, updated_at`;
  return Response.json({ result: rows[0] });
};

export const config: Config = { path: "/api/admin/results", method: ["GET", "POST", "PUT"] };
