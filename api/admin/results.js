import { db } from "hatchable";
export const access="admin"; export const methods=["GET","POST","PUT"];
export default async function(req,res){
  if(req.method==="GET"){const {rows}=await db.query("SELECT r.id,r.game_id,r.result_date,r.result_time,r.result_value,r.updated_at,g.name,g.slug FROM results r JOIN games g ON g.id=r.game_id ORDER BY r.result_date DESC,g.sort_order ASC LIMIT 200");return res.json({results:rows});}
  const body=req.body||{}; if(!body.game_id||!body.result_date||!String(body.result_value||"").trim()) return res.status(400).json({error:"game_id, result_date and result_value are required"});
  const gameId=String(body.game_id).replace(/'/g,"''"),date=String(body.result_date).replace(/'/g,"''"),time=String(body.result_time||"").replace(/'/g,"''"),value=String(body.result_value).trim().replace(/'/g,"''");
  const {rows}=await db.query("INSERT INTO results(game_id,result_date,result_time,result_value,updated_at) VALUES ('"+gameId+"','"+date+"','"+time+"','"+value+"',now()) ON CONFLICT(game_id,result_date) DO UPDATE SET result_time=EXCLUDED.result_time,result_value=EXCLUDED.result_value,updated_at=now() RETURNING id,game_id,result_date,result_time,result_value,updated_at");
  res.json({result:rows[0]});
}