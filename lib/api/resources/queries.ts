import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type ResourceId, resourceIdSchema, resources } from "@/lib/db/schema/resources";

export const getResources = async () => {
  const rows = await db.select().from(resources);
  const r = rows
  return { resources: r };
};

export const getResourceById = async (id: ResourceId) => {
  const { id: resourceId } = resourceIdSchema.parse({ id });
  const [row] = await db.select().from(resources).where(eq(resources.id, resourceId));
  if (row === undefined) return {};
  const r = row;
  return { resource: r };
};


