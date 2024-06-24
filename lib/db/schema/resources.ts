import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getResources } from "@/lib/api/resources/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const resources = pgTable("resources", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  content: text("content").notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for resources - used to validate API requests
const baseSchema = createSelectSchema(resources).omit(timestamps);

export const insertResourceSchema =
  createInsertSchema(resources).omit(timestamps);
export const insertResourceParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateResourceSchema = baseSchema;
export const updateResourceParams = baseSchema.extend({});
export const resourceIdSchema = baseSchema.pick({ id: true });

// Types for resources - used to type API request params and within Components
export type Resource = typeof resources.$inferSelect;
export type NewResource = z.infer<typeof insertResourceSchema>;
export type NewResourceParams = z.infer<typeof insertResourceParams>;
export type UpdateResourceParams = z.infer<typeof updateResourceParams>;
export type ResourceId = z.infer<typeof resourceIdSchema>["id"];

// this type infers the return from getResources() - meaning it will include any joins
export type CompleteResource = Awaited<
  ReturnType<typeof getResources>
>["resources"][number];
