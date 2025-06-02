// /utils/fillPrompts.ts

export interface PromptsBlock {
  id: number;
  name: string;
  prompt: string;
}

export interface PromptsJson {
  blocks: PromptsBlock[];
}

// Whatever shape your backend returns:
// for example, { businessName: "Acme Co", industry: "Fashion", ... }
export type VariablesObject = Record<string, string | string[] | boolean | { [k: string]: boolean }>;

/**
 * Given a single prompt string (e.g. containing "{businessName}" / "{industry}" / etc.),
 * replaces _all_ occurrences of "{key}" with `variables[key]`.
 */
export function fillTemplate(
  template: string,
  variables: VariablesObject
): string {
  // This regex matches {someKey}, capturing "someKey" in group 1.
  // It will replace every occurrence in the template.
  return template.replace(/\{([^}]+)\}/g, (_, key) => {
    const value = variables[key];
    if (value === undefined || value === null) {
      // If no value is provided, leave the token unchanged or return empty string:
      // return `{${key}}`; 
      return "";
    }

    // If the variable is an array, join by commas; if boolean or object, coerce to JSON/string.
    if (Array.isArray(value)) {
      return value.join(", ");
    } else if (typeof value === "object") {
      return JSON.stringify(value);
    } else {
      return String(value);
    }
  });
}

/**
 * Takes your entire promptsJson (with blocks[]), plus a variables object,
 * and returns a brand-new array of blocks where each block.prompt is “filled in.”
 */
export function fillAllPrompts(
  promptsJson: PromptsJson,
  variables: VariablesObject
): PromptsJson {
  return {
    blocks: promptsJson.blocks.map((block) => ({
      ...block,
      prompt: fillTemplate(block.prompt, variables),
    })),
  };
}
