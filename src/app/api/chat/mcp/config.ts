import { MCPClientConfig } from "./client";

export function createDeepLMCPConfig(): MCPClientConfig {
  const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

  if (!DEEPL_API_KEY) {
    throw new Error("DEEPL_API_KEY environment variable is required");
  }

  return {
    name: "c1-chat-deepl-client",
    version: "1.0.0",
    serverCommand: "npx",
    serverArgs: ["deepl-mcp-server"],
    env: {
      DEEPL_API_KEY,
    },
  };
}
