import { db } from "hatchable";
export const access = "public";
export const methods = ["GET"];
export default async function(req,res){
 const year=Number(req.query.year)||new Date().getFullYear();
 const month=Math.min(12,Math.max(1,Number(req.query.month)||new Date().getMonth()+1));
 const {rows}=await db.query("SELECT r.result_date,g.name,g.slug,r.result_value FROM results r JOIN games g ON g.id=r.game_id WHERE EXTRACT(YEAR FROM r.result_date)=$1 AND EXTRACT(MONTH FROM r.result_date)=$2 ORDER BY r.result_date DESC,g.sort_order",[year,month]);
 res.json({year,month,results:rows});
}