export const access = "public";
import { db } from "hatchable";
export default async function handler() {
  const rows=await db.query(`SELECT r.result_value,r.result_date,r.result_time,r.updated_at,g.id AS game_id,g.name,g.slug FROM results r JOIN games g ON g.id=r.game_id ORDER BY r.updated_at DESC LIMIT 1`);
  return new Response(JSON.stringify({latest:rows[0]||null}),{status:200,headers:{"content-type":"application/json"}});
}