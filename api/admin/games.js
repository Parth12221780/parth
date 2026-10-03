import { db } from "hatchable";
export const access="admin"; export const methods=["GET"];
export default async function(req,res){const {rows}=await db.query("SELECT id,name,slug,result_time FROM games WHERE active=true ORDER BY sort_order");res.json(rows);}