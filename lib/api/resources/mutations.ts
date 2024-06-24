import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  ResourceId, 
  NewResourceParams,
  UpdateResourceParams, 
  updateResourceSchema,
  insertResourceSchema, 
  resources,
  resourceIdSchema 
} from "@/lib/db/schema/resources";

export const createResource = async (resource: NewResourceParams) => {
  const newResource = insertResourceSchema.parse(resource);
  try {
    const [r] =  await db.insert(resources).values(newResource).returning();
    return { resource: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateResource = async (id: ResourceId, resource: UpdateResourceParams) => {
  const { id: resourceId } = resourceIdSchema.parse({ id });
  const newResource = updateResourceSchema.parse(resource);
  try {
    const [r] =  await db
     .update(resources)
     .set({...newResource, updatedAt: new Date() })
     .where(eq(resources.id, resourceId!))
     .returning();
    return { resource: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteResource = async (id: ResourceId) => {
  const { id: resourceId } = resourceIdSchema.parse({ id });
  try {
    const [r] =  await db.delete(resources).where(eq(resources.id, resourceId!))
    .returning();
    return { resource: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

