import { db } from "hatchable";
export const access="public"; export const methods=["GET"];
export default async function(req,res){
  const year=Number(req.query?.year||""); const month=Number(req.query?.month||""); const game=String(req.query?.game||""); const conditions=[];
  if(Number.isInteger(year)&&year>=2000&&year<=2100) conditions.push("EXTRACT(YEAR FROM r.result_date)="+year);
  if(Number.isInteger(month)&&month>=1&&month<=12) conditions.push("EXTRACT(MONTH FROM r.result_date)="+month);
  if(game) conditions.push("g.slug='"+game.replace(/'/g,"''")+"'");
  const {rows}=await db.query("SELECT r.result_date,r.result_time,r.result_value,g.name,g.slug FROM results r JOIN games g ON g.id=r.game_id "+(conditions.length?"WHERE "+conditions.join(" AND "):"")+" ORDER BY r.result_date DESC,g.sort_order ASC,g.name ASC");
  res.json({results:rows});
}