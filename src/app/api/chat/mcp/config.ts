import { MCPClientConfig } from "./client";
import path from "path";

export function createDeepLMCPConfig(): MCPClientConfig {
  const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

  if (!DEEPL_API_KEY) {
    throw new Error("DEEPL_API_KEY environment variable is required");
  }

  // Path to the DeepL server TypeScript source
  // const serverPath = path.join(
  //   process.cwd(),
  //   "src/app/api/chat/mcp/deepl-server-mcp.mjs"
  // );

  return {
    name: "c1-chat-deepl-client",
    version: "1.0.0",
    // serverCommand: "node",
    // serverArgs: [serverPath],
    serverCommand: "npx",
    serverArgs: ["deepl-mcp-server"],
    env: {
      DEEPL_API_KEY,
    },
  };
}
