import type { Config } from "@netlify/functions";
import { sql } from "../../lib/db.mts";

export default async (req: Request) => {
  const q = new URL(req.url).searchParams;
  const y = Number(q.get("year") || ""), m = Number(q.get("month") || "");
  const year = Number.isInteger(y) && y >= 2000 && y <= 2100 ? y : null;
  const month = Number.isInteger(m) && m >= 1 && m <= 12 ? m : null;
  const game = q.get("game") || null;
  const rows = await sql`SELECT r.result_date::text AS result_date, r.result_time, r.result_value, g.name, g.slug
    FROM results r JOIN games g ON g.id = r.game_id
    WHERE (${year}::int IS NULL OR EXTRACT(YEAR FROM r.result_date) = ${year}::int)
      AND (${month}::int IS NULL OR EXTRACT(MONTH FROM r.result_date) = ${month}::int)
      AND (${game}::text IS NULL OR g.slug = ${game}::text)
    ORDER BY r.result_date DESC, g.sort_order ASC, g.name ASC`;
  return Response.json({ results: rows });
};

export const config: Config = { path: "/api/results/history", method: "GET" };
