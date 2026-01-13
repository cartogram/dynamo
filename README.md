# DeepL Translation Chat with C1

This is a [C1 by Thesys](https://thesys.dev) project that demonstrates MCP (Model Context Protocol) server integration with streaming chat capabilities for translation services.

[![Built with Thesys](https://thesys.dev/built-with-thesys-badge.svg)](https://thesys.dev)

## Features

- **C1 Chat Integration**: Powered by Thesys C1 for intelligent conversations
- **DeepL MCP Server**: Professional translation via DeepL API through MCP
- **Tool Integration**: Automatically calls DeepL translation tools from MCP server
- **Streaming Responses**: Real-time streaming of AI responses
- **Thinking States**: Visual indicators showing what the AI is doing
- **Custom UI Components**: Beautiful custom components for displaying translations

## Getting Started

### Prerequisites

You'll need:
- **Thesys API Key**: Get your key from [Thesys Console](https://chat.thesys.dev/console/keys)
- **DeepL API Key**: Get your key from [DeepL API](https://www.deepl.com/pro-api)
- **Node.js/pnpm**: For running the development server

### Environment Variables

Copy the example environment file and fill in your API keys:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your API keys:
- `DEEPL_API_KEY`: Get from [DeepL API](https://www.deepl.com/pro-api)
- `THESYS_API_KEY`: Get from [Thesys Console](https://chat.thesys.dev/console/keys)

### Installation

Install dependencies using pnpm:

```bash
pnpm install
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## What You Can Do - Examples

Once the app is running, you can ask the AI to translate text between languages. Here are some examples:

### 🌍 **Basic Translations**
```
"Translate 'Hello World' to Spanish"
"Translate 'Good morning' to French"
"Convert 'Thank you' to German"
"How do you say 'Welcome' in Italian?"
```

### 📝 **Longer Text Translations**
```
"Translate this paragraph to Japanese: [your text]"
"Convert this email to Spanish: [your email text]"
"Translate this product description to German: [description]"
```

### 🔄 **Multiple Translations**
```
"Translate 'Hello' to Spanish, French, and German"
"Show me 'Good morning' in 5 different languages"
```

### 💬 **Conversational Translations**
```
"I need to write a greeting in Spanish"
"Help me translate this message for my French colleague"
"What's the best way to say this in German?"
```

## MCP Integration

This project demonstrates how to integrate MCP servers with C1 chat:

1. **MCP Client**: The `MCPClient` class (`src/app/api/chat/mcp/client.ts`) handles:
   - Connecting to DeepL MCP server
   - Listing available translation tools via `mcp.listTools()`
   - Running tool calls via `runTools()`

2. **Chat Route**: The API route (`src/app/api/chat/route.ts`) integrates MCP tools:
   - Connects to DeepL MCP server on startup
   - Passes MCP tools to the OpenAI completion request
   - Handles tool calls seamlessly with thinking states

3. **Tool Execution**: When the AI needs to translate, the system:
   - Receives translation requests from the AI model
   - Executes them via the DeepL MCP server
   - Returns results back to the conversation
   - Shows thinking states during execution
   - Renders results in a custom UI component

## MCP Server Configuration

Currently configured for:
- **DeepL MCP Server**: Professional translation services via DeepL API

The server is launched via `npx deepl-mcp-server` with your DeepL API key.

### Available Tools

The DeepL MCP server provides translation tools including:
- `translate-text` - Translate text between languages

## Custom Components

The application includes a custom `TextTranslation` component that provides a polished UI for displaying translation results. The AI automatically uses this component when showing translation results.

## Thinking States

The system includes visual thinking states that show users:
- 💭 "Processing your request..." - Initial analysis
- 💭 "Using DeepL tool: translate-text" - When translating
- 💭 "Processing results..." - Preparing the response

## Tips for Best Results

1. **Be Specific**: Specify both the text and target language clearly
2. **Natural Language**: Ask naturally - "Translate X to Y" or "How do you say X in Y?"
3. **Multiple Languages**: You can ask for translations to multiple languages at once
4. **Context**: Provide context for better translations when needed

## Learn More

- [C1 Documentation](https://docs.thesys.dev) - Learn about Thesys C1
- [Thinking States Guide](https://docs.thesys.dev/guides/thinking-states) - Visual progress indicators
- [MCP Specification](https://spec.modelcontextprotocol.io/) - Model Context Protocol details
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) - TypeScript SDK for MCP
- [DeepL API](https://www.deepl.com/docs-api) - DeepL API documentation
