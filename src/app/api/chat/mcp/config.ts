import { MCPClientConfig } from "./client";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

export function createDeepLMCPConfig(): MCPClientConfig {
  const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

  if (!DEEPL_API_KEY) {
    throw new Error("DEEPL_API_KEY environment variable is required");
  }

  // Use local MCP server to avoid production deployment issues
  const serverPath = join(process.cwd(), "src", "app", "api", "chat", "mcp", "server.mjs");

  return {
    name: "c1-chat-deepl-client",
    version: "1.0.0",
    serverCommand: "node",
    serverArgs: [serverPath],
    env: {
      DEEPL_API_KEY,
    },
  };
}
