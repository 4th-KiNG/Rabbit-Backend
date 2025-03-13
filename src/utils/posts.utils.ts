import { promisify } from "util";

export const prepositionsAndConjunctions: string[] = [
  "а",
  "без",
  "в",
  "для",
  "до",
  "за",
  "из",
  "к",
  "на",
  "над",
  "о",
  "об",
  "от",
  "по",
  "под",
  "при",
  "про",
  "с",
  "у",
  "через",
];

export function parseSearchString(search_string: string): string[] {
  const regexPrepositions = new RegExp(
    `\\b(${this.prepositionsAndConjunctions.join("|")})\\b`,
    "gi",
  );

  const cleanedString = search_string.replace(regexPrepositions, "");

  return cleanedString.split(/[.,/#!$%^&*;:{}=-_`~()]+/).filter(Boolean);
}

