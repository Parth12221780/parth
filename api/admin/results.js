import { db } from "hatchable";
export const access="admin"; export const methods=["POST","PUT"];
export default async function(req,res){
 const {game_id,result_date,result_value}=req.body||{};
 if(!game_id||!result_date||!String(result_value||"").trim()) return res.status(400).json({error:"game_id, result_date and result_value are required"});
 const {rows}=await db.query("INSERT INTO results (game_id,result_date,result_value,updated_at) VALUES ($1,$2,$3,now()) ON CONFLICT (game_id,result_date) DO UPDATE SET result_value=EXCLUDED.result_value,updated_at=now() RETURNING id,game_id,result_date,result_value",[game_id,result_date,String(result_value).trim()]);
 res.json(rows[0]);
}