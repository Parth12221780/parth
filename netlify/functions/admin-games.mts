import type { Config } from "@netlify/functions";
import { sql } from "../../lib/db.mts";
import { requireAdmin } from "../../lib/auth.mts";

export default async () => {
  const denied = await requireAdmin(); if (denied) return denied;
  const rows = await sql`SELECT id, name, slug, result_time FROM games WHERE active = true ORDER BY sort_order`;
  return Response.json(rows);
};

export const config: Config = { path: "/api/admin/games", method: "GET" };
