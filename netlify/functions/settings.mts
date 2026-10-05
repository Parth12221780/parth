import type { Config } from "@netlify/functions";
import { readSettings } from "../../lib/db.mts";

export default async () => Response.json(await readSettings());

export const config: Config = { path: "/api/settings", method: "GET" };
