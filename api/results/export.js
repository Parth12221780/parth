import { db } from "hatchable";
export const access = "public";
export const methods = ["GET"];

function csvCell(v) {
  const s = v == null ? "" : String(v);
  return '"' + s.replace(/"/g, '""') + '"';
}

export default async function(req, res) {
  const { rows } = await db.query(
    "SELECT g.slug AS game_slug, r.result_date, r.result_value, r.result_time " +
    "FROM results r JOIN games g ON g.id=r.game_id " +
    "ORDER BY r.result_date ASC, g.sort_order ASC, g.name ASC"
  );
  const lines = ["game_slug,date,result_value,result_time"];
  for (const r of rows) {
    lines.push([r.game_slug, r.result_date, r.result_value, r.result_time || ""].map(csvCell).join(","));
  }
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="number-results-historical.csv"');
  res.send(lines.join("\n"));
}