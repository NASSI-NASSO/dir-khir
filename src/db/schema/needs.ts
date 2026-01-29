import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const needs = pgTable("needs", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    city: text("city").notNull(),
    category: text("category").notNull(),
    whatsapp: text("whatsapp").notNull(),
    maxVolunteers: integer("maxVolunteers").notNull().default(5),
    status: text("status", { enum: ["open", "resolved"] })
        .notNull()
        .default("open"),
    createdAt: timestamp("createdAt").defaultNow(),
});
