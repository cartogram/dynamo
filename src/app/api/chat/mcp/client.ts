import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type OpenAI from "openai";

export interface MCPToolResult {
  tool_call_id: string;
  role: "tool";
  content: string;
}

export interface MCPClientConfig {
  name: string;
  version: string;
  serverCommand: string;
  serverArgs: string[];
  env?: Record<string, string>;
}

export class MCPClient {
  private mcp: Client;
  private transport: StdioClientTransport | null = null;
  private _tools: OpenAI.ChatCompletionTool[] = [];
  private isConnected = false;
  private config: MCPClientConfig;

  constructor(config: MCPClientConfig) {
    this.config = config;
    this.mcp = new Client({
      name: config.name,
      version: config.version,
    });
  }

  get tools(): OpenAI.ChatCompletionTool[] {
    return this._tools;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.warn("MCP client already connected");
      return;
    }

    try {
      console.log(`Connecting to MCP server: ${this.config.serverCommand}...`);

      this.transport = new StdioClientTransport({
        command: this.config.serverCommand,
        args: this.config.serverArgs,
        env: {
          ...(process.env as Record<string, string>),
          ...this.config.env,
        },
      });

      await this.mcp.connect(this.transport);

      const toolsResult = await this.mcp.listTools();
      const mcpTools = toolsResult.tools.map((tool) => ({
        type: "function" as const,
        function: {
          name: tool.name,
          description: tool.description || "",
          parameters: tool.inputSchema,
        },
      }));

      this._tools = [...mcpTools];

      this.isConnected = true;

      console.log(
        `✓ Connected with ${this._tools.length} tools:`,
        this._tools.map((t) => t.function.name).join(", ")
      );
    } catch (error) {
      this.isConnected = false;
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to connect to MCP server:", errorMsg);
      throw new Error(`MCP connection failed: ${errorMsg}`);
    }
  }

  async runTool({
    tool_call_id,
    name,
    args,
  }: {
    tool_call_id: string;
    name: string;
    args: Record<string, unknown>;
  }): Promise<MCPToolResult> {
    if (!this.isConnected) {
      throw new Error("MCP client not connected. Call connect() first.");
    }

    console.log(`Calling tool ${name} with args:`, JSON.stringify(args));

    try {
      const result = await this.mcp.callTool({
        name,
        arguments: args,
      });

      console.log(`✓ Tool ${name} succeeded`);

      return {
        tool_call_id,
        role: "tool",
        content: JSON.stringify(result.content),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`✗ Tool ${name} failed:`, errorMessage);

      return {
        tool_call_id,
        role: "tool",
        content: JSON.stringify({
          error: `Tool call failed: ${errorMessage}`,
        }),
      };
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      if (this.transport) {
        await this.transport.close();
      }
      this.isConnected = false;
      this._tools = [];
      console.log("MCP client disconnected");
    } catch (error) {
      console.error("Error disconnecting MCP client:", error);
      throw error;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
