export const access = "public";
import { db } from "hatchable";
export default async function handler(req) {
  const rows = await db.query(`
    SELECT g.id, g.name, g.slug, g.result_time AS scheduled_time,
           r.result_value, r.result_date, r.result_time, r.updated_at
    FROM games g
    LEFT JOIN LATERAL (
      SELECT result_value, result_date, result_time, updated_at
      FROM results WHERE game_id = g.id
      ORDER BY result_date DESC, updated_at DESC LIMIT 1
    ) r ON true
    WHERE g.active = true
    ORDER BY g.sort_order ASC, g.name ASC
  `);
  return Response.json({ games: rows });
}