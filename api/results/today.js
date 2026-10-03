import { db } from "hatchable";
export const access = "public";
export const methods = ["GET"];
export default async function(req,res){
 const {rows}=await db.query("SELECT g.id,g.name,g.slug,g.result_time,r.result_value,r.result_date FROM games g LEFT JOIN results r ON r.game_id=g.id AND r.result_date=CURRENT_DATE WHERE g.active=true ORDER BY g.sort_order");
 res.json({date:new Date().toISOString().slice(0,10),results:rows});
}