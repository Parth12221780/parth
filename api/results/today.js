import { db } from "hatchable";
export const access="public"; export const methods=["GET"];
export default async function(req,res){
  const {rows}=await db.query("SELECT g.id,g.name,g.slug,g.result_time AS scheduled_time,y.result_value AS yesterday_result,t.result_value AS today_result,y.result_date AS yesterday_date,t.result_date AS today_date FROM games g LEFT JOIN results y ON y.game_id=g.id AND y.result_date=((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date-1) LEFT JOIN results t ON t.game_id=g.id AND t.result_date=((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date) WHERE g.active=true ORDER BY g.sort_order ASC,g.name ASC");
  res.json({games:rows});
}