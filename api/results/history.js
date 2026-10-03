export const access = "public";
import { db } from "hatchable";
export default async function handler(req) {
  const url = new URL(req.url);
  const year = Number(url.searchParams.get("year"));
  const month = Number(url.searchParams.get("month"));
  const game = url.searchParams.get("game") || "";
  const conditions = [];
  if (Number.isInteger(year) && year >= 2000 && year <= 2100) conditions.push("EXTRACT(YEAR FROM r.result_date) = " + year);
  if (Number.isInteger(month) && month >= 1 && month <= 12) conditions.push("EXTRACT(MONTH FROM r.result_date) = " + month);
  if (game) conditions.push("g.slug = '" + game.replace(/'/g, "''") + "'");
  const rows = await db.query(`
    SELECT r.result_date, r.result_time, r.result_value, g.name, g.slug
    FROM results r JOIN games g ON g.id = r.game_id
    ${conditions.length ? "WHERE " + conditions.join(" AND ") : ""}
    ORDER BY r.result_date DESC, g.sort_order ASC, g.name ASC
  `);
  return Response.json({ results: rows });
}