"use server";

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from "@/lib/db/schema/resources";
import { generateManyEmbeddings } from "../ai/embedding";
import { db } from "../db";
import { embeddings } from "../db/schema/embeddings";

export const createResource = async (input: NewResourceParams) => {
  try {
    const payload = insertResourceSchema.parse(input);

    const contentWithoutLineBreaks = payload.content.replace("\n", " ");
    const [resource] = await db
      .insert(resources)
      .values({ content: contentWithoutLineBreaks })
      .returning();

    const e = await generateManyEmbeddings(contentWithoutLineBreaks);
    await db
      .insert(embeddings)
      .values(e.map((embed) => ({ resourceId: resource.id, ...embed })));
    return "Resource successfully created and embedded.";
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : "Error, please try again.";
  }
};
