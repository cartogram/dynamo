import { MCPClientConfig } from "./client";
import { join } from "path";

export function createDeepLMCPConfig(): MCPClientConfig {
  const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

  if (!DEEPL_API_KEY) {
    throw new Error("DEEPL_API_KEY environment variable is required");
  }

  // Use the installed package directly instead of npx to avoid runtime downloads
  const serverPath = join(
    process.cwd(),
    "node_modules",
    "deepl-mcp-server",
    "src",
    "index.mjs"
  );

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
