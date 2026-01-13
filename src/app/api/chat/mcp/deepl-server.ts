#!/usr/bin/env node

/**
 * Standalone DeepL MCP Server
 * Run this as a child process to provide translation capabilities
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as deepl from "deepl-node";

/*--------------------------------------------------------------------
 *  Configuration & Setup
 *-------------------------------------------------------------------*/

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

if (!DEEPL_API_KEY) {
  console.error("Error: DEEPL_API_KEY environment variable is required");
  process.exit(1);
}

console.log("hello");
const deeplClient = new deepl.DeepLClient(DEEPL_API_KEY, {
  appInfo: {
    appName: "DeepL-MCP",
    appVersion: "0.2.0",
  },
});

console.log("hello2");

// Constants
const languageCodeDescription =
  "language code, in standard ISO-639-1 format (e.g. 'en-US', 'de', 'fr')";
const glossaryEntriesGuidance =
  "This does not fetch any glossary entries. Use the get-glossary-dictionary-entries tool to fetch entries.";

const writingStyles = Object.values(deepl.WritingStyle) as [
  string,
  ...string[]
];
const writingTones = Object.values(deepl.WritingTone) as [string, ...string[]];
const formalityTypes = [
  "less",
  "more",
  "default",
  "prefer_less",
  "prefer_more",
] as const;

/*--------------------------------------------------------------------
 *  Language List Management
 *-------------------------------------------------------------------*/

class LanguagesList {
  static countryDefaults: Record<string, string> = {
    en: "en-US",
    pt: "pt-BR",
    zh: "zh-Hans",
  };

  private list: Array<{ name: string; code: string }>;
  private codesList: string;
  private direction: "source" | "target";

  constructor(
    list: Array<{ name: string; code: string }>,
    direction: "source" | "target"
  ) {
    this.list = list;
    this.codesList = list.map((lang) => lang.code).join(", ");
    this.direction = direction;
  }

  static async create(direction: "source" | "target"): Promise<LanguagesList> {
    const method =
      direction === "source" ? "getSourceLanguages" : "getTargetLanguages";
    const langs = await deeplClient[method]();
    const lowerCaseLangs = langs.map(({ name, code }) => ({
      name,
      code: code.toLowerCase(),
    }));
    return new LanguagesList(lowerCaseLangs, direction);
  }

  normalize<T extends deepl.SourceLanguageCode | deepl.TargetLanguageCode>(
    code: T
  ): T {
    // For target languages, apply country defaults if needed
    if (this.direction === "target") {
      const countryDefault = LanguagesList.countryDefaults[code.toLowerCase()];
      if (countryDefault) {
        return countryDefault as T;
      }
    }

    // Validate the code exists in our list
    if (!this.list.some((lang) => lang.code === code.toLowerCase())) {
      throw new Error(
        `Invalid language code: ${code.toLowerCase()}. Available codes: ${
          this.codesList
        }`
      );
    }

    return code;
  }

  getList() {
    return this.list;
  }
}

/*--------------------------------------------------------------------
 *  Initialize Server
 *-------------------------------------------------------------------*/

const server = new McpServer({
  name: "deepl",
  version: "1.0.0",
});

let sourceLanguages: LanguagesList;
let targetLanguages: LanguagesList;

/*--------------------------------------------------------------------
 *  Helper Functions
 *-------------------------------------------------------------------*/

function mcpContentifyText(param: string | string[]) {
  const strings = typeof param === "string" ? [param] : param;
  return {
    content: strings.map((str) => ({
      type: "text" as const,
      text: str,
    })),
  };
}

/*--------------------------------------------------------------------
 *  Tool Implementations
 *-------------------------------------------------------------------*/

async function getSourceLanguages() {
  try {
    return mcpContentifyText(
      sourceLanguages.getList().map((lang) => JSON.stringify(lang))
    );
  } catch (error) {
    throw new Error(
      `Failed to get source languages: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async function getTargetLanguages() {
  try {
    return mcpContentifyText(
      targetLanguages.getList().map((lang) => JSON.stringify(lang))
    );
  } catch (error) {
    throw new Error(
      `Failed to get target languages: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async function translateText({
  text,
  sourceLangCode,
  targetLangCode,
  formality,
  glossaryId,
}: {
  text: string;
  sourceLangCode?: deepl.SourceLanguageCode;
  targetLangCode: deepl.TargetLanguageCode;
  formality?: string;
  glossaryId?: string;
}) {
  if (sourceLangCode) {
    sourceLanguages.normalize(sourceLangCode);
  }

  targetLangCode = targetLanguages.normalize(targetLangCode);

  try {
    const options: Record<string, unknown> = {};
    if (formality) options.formality = formality;
    if (glossaryId) options.glossary = glossaryId;

    const result = await deeplClient.translateText(
      text,
      sourceLangCode ? sourceLangCode : null,
      targetLangCode,
      options
    );

    const translation = result as deepl.TextResult;

    return mcpContentifyText([
      translation.text,
      `Detected source language: ${translation.detectedSourceLang}`,
      `Target language used: ${targetLangCode}`,
    ]);
  } catch (error) {
    throw new Error(
      `Translation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async function rephraseText({
  text,
  style,
  tone,
}: {
  text: string;
  style?: string;
  tone?: string;
}) {
  try {
    const result = await deeplClient.rephraseText(
      text,
      null,
      style as deepl.WritingStyle,
      tone as deepl.WritingTone
    );
    const rephrased = result as deepl.WriteResult;
    return mcpContentifyText(rephrased.text);
  } catch (error) {
    throw new Error(
      `Rephrasing failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async function getWritingStyles() {
  return mcpContentifyText(writingStyles);
}

async function getWritingTones() {
  return mcpContentifyText(writingTones);
}

async function listGlossaries() {
  try {
    const glossaries = await deeplClient.listMultilingualGlossaries();

    if (glossaries.length === 0) {
      return mcpContentifyText("No glossaries found");
    }

    const results = glossaries.map((glossary) =>
      JSON.stringify(
        {
          id: glossary.glossaryId,
          name: glossary.name,
          dictionaries: glossary.dictionaries,
          creationTime: glossary.creationTime,
        },
        null,
        2
      )
    );

    return mcpContentifyText(results);
  } catch (error) {
    throw new Error(
      `Failed to list glossaries: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async function getGlossary({ glossaryId }: { glossaryId: string }) {
  try {
    const glossary = await deeplClient.getMultilingualGlossary(glossaryId);

    const result = {
      id: glossary.glossaryId,
      name: glossary.name,
      dictionaries: glossary.dictionaries,
      creationTime: glossary.creationTime,
    };

    return mcpContentifyText(JSON.stringify(result, null, 2));
  } catch (error) {
    throw new Error(
      `Failed to get glossary: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async function getGlossaryDictionaryEntries({
  glossaryId,
  sourceLangCode,
  targetLangCode,
}: {
  glossaryId: string;
  sourceLangCode: string;
  targetLangCode: string;
}) {
  try {
    if (!sourceLangCode || !targetLangCode) {
      throw new Error(
        "To access a glossary dictionary, you must specify its source and target languages"
      );
    }

    const glossary = await deeplClient.getMultilingualGlossary(glossaryId);
    const entriesResult =
      await deeplClient.getMultilingualGlossaryDictionaryEntries(
        glossaryId,
        sourceLangCode as deepl.LanguageCode,
        targetLangCode as deepl.LanguageCode
      );

    const results = [
      `Glossary: ${glossary.name}`,
      `Language pair: ${sourceLangCode} → ${targetLangCode}`,
      "",
      "Entries:",
      JSON.stringify(entriesResult.entries, null, 2),
    ];

    return mcpContentifyText(results);
  } catch (error) {
    throw new Error(
      `Failed to get glossary dictionary entries: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/*--------------------------------------------------------------------
 *  Register Tools
 *-------------------------------------------------------------------*/

server.tool(
  "get-source-languages",
  "Get list of available source languages for translation",
  getSourceLanguages
);

server.tool(
  "get-target-languages",
  "Get list of available target languages for translation",
  getTargetLanguages
);

server.tool(
  "translate-text",
  "Translate text to a target language using DeepL API. When the translation includes a glossary, you must specify the source language as well as the target language.",
  {
    text: z.string().describe("Text to translate"),
    sourceLangCode: z
      .string()
      .optional()
      .transform((val) =>
        sourceLanguages.normalize(val as deepl.SourceLanguageCode)
      )
      .describe(
        `source ${languageCodeDescription}, or leave empty for auto-detection`
      ),
    targetLangCode: z
      .string()
      .describe("target " + languageCodeDescription)
      .transform((val) =>
        targetLanguages.normalize(val as deepl.TargetLanguageCode)
      ),
    formality: z
      .enum(formalityTypes)
      .optional()
      .describe(
        "Controls whether translations should lean toward informal or formal language"
      ),
    glossaryId: z
      .string()
      .optional()
      .describe("ID of glossary to use for translation"),
  },
  translateText
);

server.tool(
  "get-writing-styles",
  "Get list of writing styles the DeepL API can use while rephrasing text",
  getWritingStyles
);

server.tool(
  "get-writing-tones",
  "Get list of writing tones the DeepL API can use while rephrasing text",
  getWritingTones
);

server.tool(
  "rephrase-text",
  "Rephrase text in the same language using DeepL API",
  {
    text: z.string().describe("Text to rephrase"),
    style: z
      .enum(writingStyles)
      .optional()
      .describe("Writing style for rephrasing"),
    tone: z
      .enum(writingTones)
      .optional()
      .describe("Writing tone for rephrasing"),
  },
  rephraseText
);

server.tool(
  "list-glossaries",
  "Get a list of all glossaries with metadata for each - name, dictionaries available, and creation time. " +
    glossaryEntriesGuidance,
  listGlossaries
);

server.tool(
  "get-glossary-info",
  "Given an id, get metadata about the glossary with that id - its name, available dictionaries, and creation time. " +
    glossaryEntriesGuidance,
  {
    glossaryId: z.string().describe("The unique identifier of the glossary"),
  },
  getGlossary
);

server.tool(
  "get-glossary-dictionary-entries",
  "Retrieve all the entries from a given glossary dictionary. A glossary consists of one or more dictionaries, each containing entries for a specific language pair.",
  {
    glossaryId: z.string().describe("The unique identifier of the glossary"),
    sourceLangCode: z.string().describe(`source ${languageCodeDescription}`),
    targetLangCode: z.string().describe(`target ${languageCodeDescription}`),
  },
  getGlossaryDictionaryEntries
);

/*--------------------------------------------------------------------
 *  Start Server
 *-------------------------------------------------------------------*/

async function main() {
  try {
    // Initialize language lists
    sourceLanguages = await LanguagesList.create("source");
    targetLanguages = await LanguagesList.create("target");

    // Connect server to stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("DeepL MCP Server running on stdio");
  } catch (error) {
    console.error("Failed to start DeepL MCP server:", error);
    process.exit(1);
  }
}

main();
