import type { Config } from "@netlify/functions";
import { sql } from "../../lib/db.mts";
import { requireAdmin } from "../../lib/auth.mts";

export default async () => {
  const denied = await requireAdmin(); if (denied) return denied;
  const rows = await sql`SELECT (SELECT COUNT(*) FROM games WHERE active = true)::int AS games,
    (SELECT COUNT(*) FROM results)::int AS total_results, (SELECT MAX(updated_at) FROM results) AS last_update`;
  return Response.json({ stats: rows[0] || { games: 0, total_results: 0, last_update: null } });
};

export const config: Config = { path: "/api/admin/stats", method: "GET" };
