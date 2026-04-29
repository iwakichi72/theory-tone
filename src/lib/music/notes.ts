export const CHROMATIC_NOTES_SHARP = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type ChromaticNote = (typeof CHROMATIC_NOTES_SHARP)[number];

const NOTE_LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
type NoteLetter = (typeof NOTE_LETTERS)[number];

const NATURAL_NOTE_INDEX: Record<NoteLetter, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export function normalizeNote(note: string): ChromaticNote {
  const trimmed = note.trim();
  const match = trimmed.match(/^([A-Ga-g])([#b]{0,2})$/);
  if (!match) {
    throw new Error(`Unknown note name: ${note}`);
  }

  const letter = match[1].toUpperCase() as NoteLetter;
  const accidental = match[2] ?? "";
  const offset = [...accidental].reduce((sum, char) => {
    if (char === "#") return sum + 1;
    if (char === "b") return sum - 1;
    return sum;
  }, 0);
  const index = ((NATURAL_NOTE_INDEX[letter] + offset) % 12 + 12) % 12;
  return CHROMATIC_NOTES_SHARP[index];
}

export function noteLetter(note: string): NoteLetter {
  const match = note.trim().match(/^([A-Ga-g])/);
  if (!match) {
    throw new Error(`Unknown note name: ${note}`);
  }
  return match[1].toUpperCase() as NoteLetter;
}

export function noteIndex(note: string): number {
  const normalized = normalizeNote(note);
  return CHROMATIC_NOTES_SHARP.indexOf(normalized);
}

export function transpose(note: string, semitones: number): ChromaticNote {
  const idx = noteIndex(note);
  const next = ((idx + semitones) % 12 + 12) % 12;
  return CHROMATIC_NOTES_SHARP[next];
}

export function shiftNoteLetter(letter: string, steps: number): NoteLetter {
  const start = NOTE_LETTERS.indexOf(noteLetter(letter));
  const next = ((start + steps) % NOTE_LETTERS.length + NOTE_LETTERS.length) %
    NOTE_LETTERS.length;
  return NOTE_LETTERS[next];
}

export function spellPitchForLetter(
  pitchClassIndex: number,
  letter: string,
): string {
  const noteBase = noteLetter(letter);
  const naturalIndex = NATURAL_NOTE_INDEX[noteBase];
  const normalizedIndex = ((pitchClassIndex % 12) + 12) % 12;
  const sharpDistance = (normalizedIndex - naturalIndex + 12) % 12;

  if (sharpDistance === 0) return noteBase;
  if (sharpDistance === 1) return `${noteBase}#`;
  if (sharpDistance === 2) return `${noteBase}##`;
  if (sharpDistance === 11) return `${noteBase}b`;
  if (sharpDistance === 10) return `${noteBase}bb`;

  return CHROMATIC_NOTES_SHARP[normalizedIndex];
}

export function withOctave(note: string, baseOctave = 4): string {
  const normalized = normalizeNote(note);
  return `${normalized}${baseOctave}`;
}

export function ascendingNoteOctaves(
  notes: string[],
  baseOctave = 4,
): string[] {
  let prevOrder = -1;
  let octave = baseOctave;
  return notes.map((note) => {
    const normalized = normalizeNote(note);
    const order = noteIndex(normalized);
    if (order <= prevOrder) {
      octave += 1;
    }
    prevOrder = order;
    return `${normalized}${octave}`;
  });
}
