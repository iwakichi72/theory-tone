import { CHROMATIC_NOTES_SHARP, noteIndex, withOctave } from "./notes";

type ChordForVoicing = {
  chordName: string;
  notes: string[];
  romanNumeral?: string;
};

export type VoicedChord<T extends ChordForVoicing = ChordForVoicing> = T & {
  bassNote?: string;
};

const CHORD_OCTAVE = 4;
const BASS_OCTAVE = 2;
const LOWEST_CHORD_OCTAVE = 3;
const HIGHEST_CHORD_OCTAVE = 5;

function midiFor(note: string, octave: number): number {
  return (octave + 1) * 12 + noteIndex(note);
}

function midiToNote(midi: number): string {
  const index = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${CHROMATIC_NOTES_SHARP[index]}${octave}`;
}

function ascendingClosedVoicing(notes: string[]): number[] {
  let previous = -Infinity;
  return notes.map((note) => {
    let midi = midiFor(note, CHORD_OCTAVE);
    while (midi <= previous) midi += 12;
    previous = midi;
    return midi;
  });
}

function candidatesFor(note: string): number[] {
  const candidates: number[] = [];
  for (let octave = LOWEST_CHORD_OCTAVE; octave <= HIGHEST_CHORD_OCTAVE; octave += 1) {
    candidates.push(midiFor(note, octave));
  }
  return candidates;
}

function closestMidi(note: string, target: number): number {
  return candidatesFor(note).reduce((best, candidate) => {
    const bestDistance = Math.abs(best - target);
    const candidateDistance = Math.abs(candidate - target);
    if (candidateDistance === bestDistance) {
      return candidate < best ? candidate : best;
    }
    return candidateDistance < bestDistance ? candidate : best;
  });
}

function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];

  return items.flatMap((item, index) => {
    const rest = [...items.slice(0, index), ...items.slice(index + 1)];
    return permutations(rest).map((p) => [item, ...p]);
  });
}

function crossingPenalty(voicing: number[]): number {
  return voicing.some((note, index) => index > 0 && note <= voicing[index - 1])
    ? 1000
    : 0;
}

function rangePenalty(voicing: number[]): number {
  const range = Math.max(...voicing) - Math.min(...voicing);
  return Math.max(0, range - 14) * 5;
}

function voiceChord(notes: string[], previous?: number[]): number[] {
  if (!previous) return ascendingClosedVoicing(notes);

  let bestVoicing: number[] | undefined;
  let bestScore = Infinity;

  for (const order of permutations(notes)) {
    const voicing = order.map((note, index) => closestMidi(note, previous[index]));
    const movement = voicing.reduce(
      (sum, midi, index) => sum + Math.abs(midi - previous[index]),
      0,
    );
    const score = movement + crossingPenalty(voicing) + rangePenalty(voicing);

    if (score < bestScore) {
      bestScore = score;
      bestVoicing = voicing;
    }
  }

  return bestVoicing ?? ascendingClosedVoicing(notes);
}

export function voiceLeadProgression<T extends ChordForVoicing>(
  chords: T[],
): VoicedChord<T>[] {
  let previous: number[] | undefined;

  return chords.map((chord) => {
    if (chord.notes.length === 0) {
      return {
        ...chord,
        notes: [],
      };
    }

    const voicing = voiceChord(chord.notes, previous);
    previous = voicing;

    return {
      ...chord,
      notes: voicing.map(midiToNote),
      bassNote: withOctave(chord.notes[0], BASS_OCTAVE),
    };
  });
}
