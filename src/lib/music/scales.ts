import { transpose } from "./notes";

const MAJOR_INTERVALS = [2, 2, 1, 2, 2, 2, 1] as const;
const NATURAL_MINOR_INTERVALS = [2, 1, 2, 2, 1, 2, 2] as const;

function buildScale(root: string, intervals: readonly number[]): string[] {
  const notes: string[] = [root.trim()];
  let current = root;
  for (let i = 0; i < intervals.length - 1; i++) {
    current = transpose(current, intervals[i]);
    notes.push(current);
  }
  // Normalize root to canonical sharp form
  notes[0] = transpose(root, 0);
  return notes;
}

export function getMajorScale(root: string): string[] {
  return buildScale(root, MAJOR_INTERVALS);
}

export function getNaturalMinorScale(root: string): string[] {
  return buildScale(root, NATURAL_MINOR_INTERVALS);
}
