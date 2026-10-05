import type { Config } from "@netlify/functions";
import { sql } from "../../lib/db.mts";

export default async () => {
  const rows = await sql`SELECT g.id, g.name, g.slug, g.result_time AS scheduled_time,
      y.result_value AS yesterday_result, t.result_value AS today_result,
      y.result_date::text AS yesterday_date, t.result_date::text AS today_date
    FROM games g
    LEFT JOIN results y ON y.game_id = g.id AND y.result_date = ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date - 1)
    LEFT JOIN results t ON t.game_id = g.id AND t.result_date = ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date)
    WHERE g.active = true ORDER BY g.sort_order ASC, g.name ASC`;
  return Response.json({ games: rows });
};

export const config: Config = { path: "/api/results/today", method: "GET" };
