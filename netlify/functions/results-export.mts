import type { Config } from "@netlify/functions";
import { sql } from "../../lib/db.mts";

function csvCell(v: unknown) {
  const s = v == null ? "" : String(v);
  return '"' + s.replace(/"/g, '""') + '"';
}

export default async () => {
  const rows = await sql`SELECT g.slug AS game_slug, r.result_date::text AS result_date, r.result_value, r.result_time
    FROM results r JOIN games g ON g.id = r.game_id
    ORDER BY r.result_date ASC, g.sort_order ASC, g.name ASC`;
  const lines = ["game_slug,date,result_value,result_time"];
  for (const r of rows as Record<string, unknown>[]) {
    lines.push([r.game_slug, r.result_date, r.result_value, r.result_time || ""].map(csvCell).join(","));
  }
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="number-results-historical.csv"' },
  });
};

export const config: Config = { path: "/api/results/export", method: "GET" };
