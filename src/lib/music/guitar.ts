import { CHROMATIC_NOTES_SHARP } from "./notes";

export type GuitarChordShape = {
  chordName: string;
  frets: [number, number, number, number, number, number];
};

export type GuitarString = {
  label: string;
  openMidi: number;
};

export const GUITAR_STRINGS: GuitarString[] = [
  { label: "E", openMidi: 40 },
  { label: "A", openMidi: 45 },
  { label: "D", openMidi: 50 },
  { label: "G", openMidi: 55 },
  { label: "B", openMidi: 59 },
  { label: "E", openMidi: 64 },
];

const GUITAR_CHORD_SHAPES: Record<string, GuitarChordShape> = {
  C: { chordName: "C", frets: [-1, 3, 2, 0, 1, 0] },
  D: { chordName: "D", frets: [-1, -1, 0, 2, 3, 2] },
  E: { chordName: "E", frets: [0, 2, 2, 1, 0, 0] },
  F: { chordName: "F", frets: [1, 3, 3, 2, 1, 1] },
  G: { chordName: "G", frets: [3, 2, 0, 0, 0, 3] },
  A: { chordName: "A", frets: [-1, 0, 2, 2, 2, 0] },
  Bb: { chordName: "Bb", frets: [-1, 1, 3, 3, 3, 1] },
  Eb: { chordName: "Eb", frets: [-1, 6, 5, 3, 4, 3] },
  Ab: { chordName: "Ab", frets: [4, 6, 6, 5, 4, 4] },
  Am: { chordName: "Am", frets: [-1, 0, 2, 2, 1, 0] },
  Bm: { chordName: "Bm", frets: [-1, 2, 4, 4, 3, 2] },
  Cm: { chordName: "Cm", frets: [-1, 3, 5, 5, 4, 3] },
  Dm: { chordName: "Dm", frets: [-1, -1, 0, 2, 3, 1] },
  Em: { chordName: "Em", frets: [0, 2, 2, 0, 0, 0] },
  Fm: { chordName: "Fm", frets: [1, 3, 3, 1, 1, 1] },
  "F#m": { chordName: "F#m", frets: [2, 4, 4, 2, 2, 2] },
  Gm: { chordName: "Gm", frets: [3, 5, 5, 3, 3, 3] },
};

function midiToNote(midi: number): string {
  const index = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${CHROMATIC_NOTES_SHARP[index]}${octave}`;
}

export function getGuitarChordShape(
  chordName: string,
): GuitarChordShape | undefined {
  return GUITAR_CHORD_SHAPES[chordName];
}

export function getGuitarChordNotes(chordName: string): string[] {
  const shape = getGuitarChordShape(chordName);
  if (!shape) return [];

  return shape.frets.flatMap((fret, stringIndex) => {
    if (fret < 0) return [];
    return midiToNote(GUITAR_STRINGS[stringIndex].openMidi + fret);
  });
}

export function getGuitarShapeBaseFret(shape: GuitarChordShape): number {
  const fretted = shape.frets.filter((fret) => fret > 0);
  if (fretted.length === 0) return 1;
  const minFret = Math.min(...fretted);
  return minFret > 1 ? minFret : 1;
}
