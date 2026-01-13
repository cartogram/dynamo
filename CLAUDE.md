# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application that demonstrates MCP (Model Context Protocol) server integration with Thesys C1 Chat. The app is a translation assistant powered by C1 and DeepL MCP server, showcasing streaming chat capabilities with custom UI components.

## Key Technologies

- **Next.js 15** with App Router and Turbopack
- **Thesys C1**: AI chat capabilities via `@thesysai/genui-sdk`
- **MCP SDK**: Tool integration via `@modelcontextprotocol/sdk`
- **DeepL MCP Server**: Translation services via `deepl-mcp-server`
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **OpenAI SDK**: Used with Thesys API endpoint

## Environment Variables

Required environment variables:
- `THESYS_API_KEY`: Get from https://chat.thesys.dev/console/keys
- `DEEPL_API_KEY`: Required for DeepL MCP server integration

## Common Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack

# Build & Production
pnpm build           # Create production build
pnpm start           # Run production server

# Code Quality
pnpm lint            # Run ESLint
```

## Architecture

### MCP Integration Pattern

The application follows a three-layer MCP integration pattern:

1. **MCP Client Layer** (`src/app/api/chat/mcp/client.ts`):
   - `MCPClient` class manages connection lifecycle and tool execution
   - Connects to MCP servers via stdio transport
   - Converts MCP tools to OpenAI-compatible function calling format
   - Handles tool execution with error handling

2. **MCP Configuration** (`src/app/api/chat/mcp/config.ts`):
   - `createDeepLMCPConfig()` returns `MCPClientConfig` for server setup
   - Defines server command, args, and environment variables
   - Currently configured for DeepL MCP server via `npx deepl-mcp-server`

3. **Chat API Route** (`src/app/api/chat/route.ts`):
   - Singleton MCP client initialized at module level
   - Ensures connection via `ensureMCPConnection()` before requests
   - Integrates MCP tools into OpenAI's `runTools()` streaming API
   - Manages conversation state via `messageStore`

### Custom Component System

The application demonstrates C1's custom component capabilities:

1. **Schema Definition** (route.ts):
   - Use Zod schemas for type safety
   - Convert to JSON Schema via `zodToJsonSchema()`
   - Pass schemas in OpenAI request metadata under `thesys.c1_custom_components`

2. **Component Registration** (page.tsx):
   - Register React components in `C1Chat`'s `customizeC1.customComponents`
   - Component names must match schema keys exactly

3. **AI Usage**:
   - System prompt instructs AI when and how to use custom components
   - AI renders components by outputting structured data matching the schema
   - Components receive props matching the Zod schema definition

### Message Store Pattern

- In-memory conversation history per thread (`messageStore.ts`)
- Key methods:
  - `addMessage()`: Append to conversation
  - `getOpenAICompatibleMessageList()`: Strip IDs for API calls
- Thread-based isolation using `threadId` from request body

### Streaming Architecture

The app uses `@crayonai/stream`'s `transformStream()` to handle LLM streaming:
- Extract content from OpenAI chunks
- Write to `c1Response` stream (from `makeC1Response()`)
- Include "thinking states" for tool execution visibility
- Store final assistant message in message store

## File Structure

```
src/app/
├── page.tsx                     # Client component with C1Chat
├── layout.tsx                   # Root layout
├── components.tsx               # Custom UI components (TextTranslation, FlightCard, etc.)
└── api/chat/
    ├── route.ts                 # Main chat endpoint (POST handler)
    ├── messageStore.ts          # Thread-based conversation storage
    └── mcp/
        ├── client.ts            # MCPClient class
        └── config.ts            # MCP server configuration
```

## Adding New MCP Servers

To integrate a new MCP server:

1. Create config function in `mcp/config.ts`:
   ```typescript
   export function createMyMCPConfig(): MCPClientConfig {
     return {
       name: "my-mcp-client",
       version: "1.0.0",
       serverCommand: "npx",
       serverArgs: ["my-mcp-server"],
       env: { MY_API_KEY: process.env.MY_API_KEY }
     };
   }
   ```

2. Update `route.ts` to use new config:
   ```typescript
   const mcpClient = new MCPClient(createMyMCPConfig());
   ```

3. Update system prompt to explain new tools to the AI

## Creating Custom Components

1. Define Zod schema in `route.ts`:
   ```typescript
   const MyComponentSchema = z.object({
     prop1: z.string().describe("Description for AI"),
     prop2: z.number().describe("Another prop")
   }).describe("When to use this component");
   ```

2. Add to `CUSTOM_COMPONENT_SCHEMAS` object

3. Create React component in `components.tsx`:
   ```typescript
   export const MyComponent = ({ prop1, prop2 }: { ... }) => {
     // Implementation
   };
   ```

4. Register in `page.tsx`:
   ```typescript
   customComponents: { MyComponent }
   ```

## Important Implementation Details

- MCP client is a singleton at module level to persist across requests
- Connection status checked before each request via `getConnectionStatus()`
- Tool execution happens inline during OpenAI streaming via `runTools()`
- Thinking states provide UX feedback during tool execution
- System prompt must explicitly instruct AI to use custom components
- All API calls go through Thesys embed endpoint: `https://api.thesys.dev/v1/embed/`
- Model used: `c1/anthropic/claude-3.7-sonnet/v-20250617`

## Testing Translations

Example prompts to test the application:
- "Translate 'Hello World' to Spanish"
- "Translate 'Good morning' from English to French"
- The AI should automatically use the DeepL MCP tool and render results via TextTranslation component
