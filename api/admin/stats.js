export const access = "admin";
import { db } from "hatchable";
export default async function handler() {
  const rows = await db.query(`
    SELECT (SELECT COUNT(*) FROM games WHERE active=true) AS games,
           (SELECT COUNT(*) FROM results) AS total_results,
           (SELECT MAX(updated_at) FROM results) AS last_update
  `);
  return Response.json({stats:rows[0] || {games:0,total_results:0,last_update:null}});
}