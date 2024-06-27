import { createResource } from "@/lib/actions/resources";
import { findSimilarContent } from "@/lib/ai/embedding";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o"),
    messages: convertToCoreMessages(messages),
    system:
      "You are a helpful assistant intended to help solve the users problems using your knowledge base. ONLY use information available in the knowledge base to answer questions. If the knowledge does not exist, respond, Sorry, I don't know. You can use the information you do have to infer an answer.",
    tools: {
      addResource: tool({
        description:
          "Use this tool to add a resource to your knowledge base. If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.",
        parameters: z.object({
          content: z
            .string()
            .describe(
              "the content or resource the user wants to add to the knowledge base",
            ),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      answerQuestion: tool({
        description:
          "Use this tool to answer a question based on your knowledge base. If the answer does not exist, do not ",
        parameters: z.object({
          question: z.string().describe("The users question"),
        }),
        execute: async ({ question }) => findSimilarContent(question),
      }),
    },
  });

  return result.toAIStreamResponse();
}
