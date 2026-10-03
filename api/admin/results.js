export const access = "admin";
import { db } from "hatchable";
export default async function handler(req) {
  if(req.method==="GET"){const rows=await db.query(`SELECT r.id,r.game_id,r.result_date,r.result_time,r.result_value,r.updated_at,g.name,g.slug FROM results r JOIN games g ON g.id=r.game_id ORDER BY r.result_date DESC,g.sort_order ASC LIMIT 200`);return new Response(JSON.stringify({results:rows}),{status:200,headers:{"content-type":"application/json"}});}
  if(req.method!=="POST"&&req.method!=="PUT")return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers:{"content-type":"application/json"}});
  const body=await req.json(); if(!body.game_id||!body.result_date||!String(body.result_value||"").trim())return new Response(JSON.stringify({error:"game_id, result_date and result_value are required"}),{status:400,headers:{"content-type":"application/json"}});
  const gameId=String(body.game_id).replace(/'/g,"''"),date=String(body.result_date).replace(/'/g,"''"),time=String(body.result_time||"").replace(/'/g,"''"),value=String(body.result_value).trim().replace(/'/g,"''");
  const rows=await db.query(`INSERT INTO results(game_id,result_date,result_time,result_value,updated_at) VALUES ('${gameId}','${date}','${time}','${value}',now()) ON CONFLICT(game_id,result_date) DO UPDATE SET result_time=EXCLUDED.result_time,result_value=EXCLUDED.result_value,updated_at=now() RETURNING id,game_id,result_date,result_time,result_value,updated_at`);
  return new Response(JSON.stringify({result:rows[0]}),{status:200,headers:{"content-type":"application/json"}});
}