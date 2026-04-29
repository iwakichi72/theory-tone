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

const FLAT_TO_SHARP: Record<string, ChromaticNote> = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

export function normalizeNote(note: string): ChromaticNote {
  const trimmed = note.trim();
  if ((CHROMATIC_NOTES_SHARP as readonly string[]).includes(trimmed)) {
    return trimmed as ChromaticNote;
  }
  if (trimmed in FLAT_TO_SHARP) {
    return FLAT_TO_SHARP[trimmed];
  }
  throw new Error(`Unknown note name: ${note}`);
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

const NATURAL_OCTAVE_REFERENCES: Record<string, number> = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
};

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
    const order = NATURAL_OCTAVE_REFERENCES[normalized];
    if (order <= prevOrder) {
      octave += 1;
    }
    prevOrder = order;
    return `${normalized}${octave}`;
  });
}
