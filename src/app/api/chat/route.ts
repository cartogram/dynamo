import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { DBMessage, getMessageStore } from "./messageStore";
import { MCPClient } from "./mcp/client";
import { createDeepLMCPConfig } from "./mcp/config";
import { makeC1Response } from "@thesysai/genui-sdk/server";
import { JSONSchema } from "openai/lib/jsonschema.mjs";
import { transformStream } from "@crayonai/stream";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

// Force Node.js runtime (required for MCP stdio transport)
export const runtime = "nodejs";

// Initialize DeepL MCP client
const mcpClient = new MCPClient(createDeepLMCPConfig());

interface RequestBody {
  prompt: DBMessage;
  threadId: string;
  responseId: string;
}

// Zod-based custom component schemas
const TextTranslationSchema = z
  .object({
    originalText: z.string().describe("The original text to display"),
    translatedText: z.string().describe("The translated text to display"),
    sourceLanguage: z
      .string()
      .describe("The source language name (e.g., 'English', 'Spanish')"),
    targetLanguage: z
      .string()
      .describe("The target language name (e.g., 'French', 'German')"),
  })
  .describe(
    "A custom UI component that displays translated text in a formatted card. Use this component to present translation results after calling the translate-text MCP tool. This provides a better user experience than displaying plain text."
  );

const CUSTOM_COMPONENT_SCHEMAS = {
  TextTranslation: zodToJsonSchema(TextTranslationSchema),
};
/**
 * Ensure MCP client is connected before processing requests
 */
async function ensureMCPConnection(): Promise<void> {
  if (!mcpClient.getConnectionStatus()) {
    await mcpClient.connect();
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const { prompt, threadId, responseId } = (await req.json()) as RequestBody;

    const messageStore = getMessageStore(threadId);
    if (messageStore.getOpenAICompatibleMessageList().length === 0) {
      messageStore.addMessage({
        role: "system",
        content: `You are a translation assistant powered by Thesys C1 and DeepL MCP server.

IMPORTANT INSTRUCTIONS:
1. When the user asks for a translation, use the DeepL MCP tools (translate-text) to perform the translation
2. After getting the translation result, ALWAYS render it using the TextTranslation custom component
3. The TextTranslation component requires these exact props:
   - originalText: the original text (string)
   - translatedText: the translated text (string)
   - sourceLanguage: the source language name (string, e.g., "English", "Spanish")
   - targetLanguage: the target language name (string, e.g., "French", "German")
4. Do NOT just display the translation as plain text - you MUST use the TextTranslation component

Example workflow:
- User: "Translate 'Hello' to Spanish"
- You call translate-text tool
- You render the result using TextTranslation component with proper props`,
      });
    }
    // store the user prompt in the message store
    messageStore.addMessage(prompt as DBMessage);

    // Initialize dependencies
    const client = new OpenAI({
      baseURL: "https://api.thesys.dev/v1/embed/",
      apiKey: process.env.THESYS_API_KEY,
    });

    // Add user message to conversation

    // Ensure MCP connection is established
    await ensureMCPConnection();

    // Get conversation history
    const messages = messageStore.getOpenAICompatibleMessageList();
    const c1Response = makeC1Response();
    c1Response.writeThinkItem({
      title: "Processing your request...",
      description:
        "Analyzing your message with DeepL translation capabilities.",
    });

    const llmStream = await client.beta.chat.completions.runTools({
      model: "c1/anthropic/claude-3.7-sonnet/v-20250617", // available models: https://docs.thesys.dev/guides/models-pricing#model-table
      messages: messages,
      tools: mcpClient.tools.map((tool) => ({
        type: "function",
        function: {
          name: tool.function.name,
          description: tool.function.description!,
          parameters: tool.function.parameters as unknown as JSONSchema,
          parse: JSON.parse,
          function: async (args: unknown) => {
            c1Response.writeThinkItem({
              title: `Using DeepL tool: ${tool.function.name}`,
              description: "Executing translation or rephrasing operation.",
            });
            const results = await mcpClient.runTool({
              tool_call_id: tool.function.name + Date.now().toString(),
              name: tool.function.name,
              args: args as Record<string, unknown>,
            });
            return results.content;
          },
        },
      })),
      stream: true,
      metadata: {
        thesys: JSON.stringify({
          c1_custom_components: CUSTOM_COMPONENT_SCHEMAS,
        }),
      },
    });

    transformStream(
      llmStream,
      (chunk) => {
        return chunk.choices[0].delta.content;
      },
      {
        onTransformedChunk: (chunk) => {
          if (chunk) {
            c1Response.writeContent(chunk);
          }
        },
        onError: (error) => {
          console.error("Error in chat route:", error);
          c1Response.writeContent(
            "Sorry, I encountered an error processing your request."
          );
        },
        onEnd: ({ accumulated }) => {
          const message = accumulated.filter((message) => message).join("");
          messageStore.addMessage({
            role: "assistant",
            content: message,
            id: responseId,
          });
          c1Response.end();
        },
      }
    );

    return new NextResponse(c1Response.responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Cleanup on process exit
if (typeof process !== "undefined") {
  process.on("SIGTERM", async () => {
    await mcpClient.disconnect();
  });
}
