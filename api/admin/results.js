export const access = "admin";
import { db } from "hatchable";
export default async function handler(req) {
  if (req.method === "GET") {
    const rows = await db.query(`
      SELECT r.id, r.game_id, r.result_date, r.result_time, r.result_value, r.updated_at, g.name, g.slug
      FROM results r JOIN games g ON g.id = r.game_id
      ORDER BY r.result_date DESC, g.sort_order ASC LIMIT 200
    `);
    return Response.json({ results: rows });
  }
  if (req.method !== "POST" && req.method !== "PUT") return Response.json({ error:"Method not allowed" },{status:405});
  const body = await req.json();
  if (!body.game_id || !body.result_date || !String(body.result_value || "").trim()) return Response.json({error:"game_id, result_date and result_value are required"},{status:400});
  const gameId = String(body.game_id).replace(/'/g,"''");
  const date = String(body.result_date).replace(/'/g,"''");
  const time = String(body.result_time || "").replace(/'/g,"''");
  const value = String(body.result_value).trim().replace(/'/g,"''");
  const rows = await db.query(`
    INSERT INTO results (game_id,result_date,result_time,result_value,updated_at)
    VALUES ('${gameId}','${date}','${time}','${value}',now())
    ON CONFLICT (game_id,result_date)
    DO UPDATE SET result_time=EXCLUDED.result_time,result_value=EXCLUDED.result_value,updated_at=now()
    RETURNING id,game_id,result_date,result_time,result_value,updated_at
  `);
  return Response.json({result:rows[0]});
}