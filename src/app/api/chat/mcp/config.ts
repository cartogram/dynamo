import { MCPClientConfig } from "./client";
import { join } from "path";

export function createDeepLMCPConfig(): MCPClientConfig {
  const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

  if (!DEEPL_API_KEY) {
    throw new Error("DEEPL_API_KEY environment variable is required");
  }

  // Use the bin entry from node_modules/.bin which has proper module resolution
  const serverPath = join(process.cwd(), "node_modules", ".bin", "deepl-mcp-server");

  return {
    name: "c1-chat-deepl-client",
    version: "1.0.0",
    serverCommand: serverPath,
    serverArgs: [],
    env: {
      DEEPL_API_KEY,
    },
  };
}
