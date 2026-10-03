import { db } from "hatchable";
export const access="admin"; export const methods=["GET"];
export default async function(req,res){
  const {rows}=await db.query("SELECT (SELECT COUNT(*) FROM games WHERE active=true) AS games,(SELECT COUNT(*) FROM results) AS total_results,(SELECT MAX(updated_at) FROM results) AS last_update");
  res.json({stats:rows[0]||{games:0,total_results:0,last_update:null}});
}