import { pgTable, uuid, text, integer, boolean, timestamp, date, uniqueIndex, index } from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull().unique(),
  slug: text().notNull().unique(),
  resultTime: text("result_time"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean().notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const results = pgTable(
  "results",
  {
    id: uuid().primaryKey().defaultRandom(),
    gameId: uuid("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
    resultDate: date("result_date").notNull(),
    resultValue: text("result_value").notNull(),
    resultTime: text("result_time"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("results_game_date_uq").on(t.gameId, t.resultDate),
    index("results_date_idx").on(t.resultDate),
  ],
);

export const siteSettings = pgTable("site_settings", {
  settingKey: text("setting_key").primaryKey(),
  settingValue: text("setting_value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
