/**
 * be aware of s[s.length] --> undefined
 * */

const isBetween = (l, m, r) => l <= m && m <= r;
export type CharChecker = (c: string) => boolean;
export const isDigit: CharChecker = (c) => isBetween("0", c, "9");
export const isLowerCase: CharChecker = (c) => isBetween("a", c, "z");
export const isUpperCase: CharChecker = (c) => isBetween("A", c, "Z");
export const isAlphabet: CharChecker = (c) => isLowerCase(c) || isUpperCase(c);
export const isWhiteSpace: CharChecker = (c) => c === " " || c === "\t";
export const isLineBreak: CharChecker = (c) => c === "\n" || c === "\r";
