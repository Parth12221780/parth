import type { Config } from "@netlify/functions";
import { sql } from "../../lib/db.mts";

export default async () => {
  const rows = await sql`SELECT r.result_value, r.result_date::text AS result_date, r.result_time, r.updated_at, g.id AS game_id, g.name, g.slug
    FROM results r JOIN games g ON g.id = r.game_id ORDER BY r.updated_at DESC LIMIT 1`;
  return Response.json({ latest: rows[0] || null });
};

export const config: Config = { path: "/api/results/latest", method: "GET" };
