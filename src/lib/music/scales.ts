import {
  noteIndex,
  noteLetter,
  shiftNoteLetter,
  spellPitchForLetter,
} from "./notes";

const MAJOR_INTERVALS = [2, 2, 1, 2, 2, 2, 1] as const;
const NATURAL_MINOR_INTERVALS = [2, 1, 2, 2, 1, 2, 2] as const;

function buildScale(root: string, intervals: readonly number[]): string[] {
  const rootIndex = noteIndex(root);
  const rootLetter = noteLetter(root);
  const notes: string[] = [];
  let semitoneOffset = 0;

  for (let i = 0; i < intervals.length; i++) {
    const letter = shiftNoteLetter(rootLetter, i);
    notes.push(spellPitchForLetter(rootIndex + semitoneOffset, letter));
    semitoneOffset += intervals[i];
  }

  return notes;
}

export function getMajorScale(root: string): string[] {
  return buildScale(root, MAJOR_INTERVALS);
}

export function getNaturalMinorScale(root: string): string[] {
  return buildScale(root, NATURAL_MINOR_INTERVALS);
}
