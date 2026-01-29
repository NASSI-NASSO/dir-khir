import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { needs } from "./needs";

export const participations = pgTable("participations", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    needId: uuid("needId")
        .notNull()
        .references(() => needs.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joinedAt").defaultNow(),
}, (t) => ({
    uniqueUserNeed: unique("participations_user_need_unique").on(t.userId, t.needId),
}));
