#!/usr/bin/env node
import { words_array as words } from "../src/lib/words.js";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const OUTPUT_PATH = join(dirname(__filename), "../src/lib/substrings.ts");

const substrCount = new Map();

for (const word of words) {
  const seenInWord = new Set();

  // Generate substrings of length 2-4 ONLY if shorter than word
  for (let i = 0; i < word.length; i++) {
    for (let len = 2; len <= Math.min(4, word.length - i); len++) {
      if (len === word.length) continue;

      const substr = word.slice(i, i + len);
      if (!seenInWord.has(substr)) {
        substrCount.set(substr, (substrCount.get(substr) || 0) + 1);
        seenInWord.add(substr);
      }
    }
  }
}

// Require ≥3 words
const validSubstrings = Array.from(substrCount)
  .filter(([_, count]) => count >= 3)
  .map(([substr]) => substr)
  .sort();

const output = `// Auto-generated. DO NOT EDIT.
// ${validSubstrings.length} substrings (min 3 words, never full word)
export const SUBSTRINGS = ${JSON.stringify(validSubstrings)};
`;
writeFileSync(OUTPUT_PATH, output);
console.log(`Generated ${validSubstrings.length} substrings`);
