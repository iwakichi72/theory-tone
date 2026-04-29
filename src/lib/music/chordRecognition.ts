import { getTriad } from "./chords";
import { CHROMATIC_NOTES_SHARP, noteIndex } from "./notes";
import type { ChordQuality } from "./theoryTypes";

export type DetectedChord = {
  chordName: string;
  root: string;
  quality: "major" | "minor";
  confidence: number;
};

export type DetectedChordSegment = DetectedChord & {
  start: number;
  end: number;
  chroma: number[];
};

export type ProgressionSummary = {
  chordName: string;
  romanNumeral: string;
  start: number;
  end: number;
  confidence: number;
};

export type KeyEstimate = {
  key: string;
  confidence: number;
};

type ChordTemplate = {
  rootIndex: number;
  root: string;
  quality: "major" | "minor";
  chordName: string;
  notes: number[];
};

const MAJOR_SCALE_OFFSETS = [0, 2, 4, 5, 7, 9, 11] as const;
const MAJOR_QUALITIES: ("major" | "minor" | "minor" | "major" | "major" | "minor" | "dim")[] = [
  "major",
  "minor",
  "minor",
  "major",
  "major",
  "minor",
  "dim",
];
const MAJOR_ROMANS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"] as const;

const CHORD_TEMPLATES: ChordTemplate[] = CHROMATIC_NOTES_SHARP.flatMap(
  (root, rootIndex) => [
    {
      rootIndex,
      root,
      quality: "major" as const,
      chordName: root,
      notes: [rootIndex, (rootIndex + 4) % 12, (rootIndex + 7) % 12],
    },
    {
      rootIndex,
      root,
      quality: "minor" as const,
      chordName: `${root}m`,
      notes: [rootIndex, (rootIndex + 3) % 12, (rootIndex + 7) % 12],
    },
  ],
);

function normalizeChroma(chroma: number[]): number[] {
  const max = Math.max(...chroma, 0);
  if (max <= 0) return Array.from({ length: 12 }, () => 0);
  return chroma.map((value) => value / max);
}

function scoreTemplate(chroma: number[], template: ChordTemplate): number {
  const chordToneScore = template.notes.reduce(
    (sum, index) => sum + chroma[index],
    0,
  );
  const nonChordScore = chroma.reduce((sum, value, index) => {
    return sum + (template.notes.includes(index) ? 0 : value);
  }, 0);

  return chordToneScore - nonChordScore * 0.18 + chroma[template.rootIndex] * 0.25;
}

export function detectChordFromChroma(chroma: number[]): DetectedChord {
  const normalized = normalizeChroma(chroma);
  const ranked = CHORD_TEMPLATES.map((template) => ({
    template,
    score: scoreTemplate(normalized, template),
  })).sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const runnerUp = ranked[1];
  const margin = best.score - (runnerUp?.score ?? 0);
  const confidence = Math.max(0, Math.min(1, 0.45 + margin / 3));

  return {
    chordName: best.template.chordName,
    root: best.template.root,
    quality: best.template.quality,
    confidence,
  };
}

function parseChordName(chordName: string): {
  root: string;
  quality: "major" | "minor";
} {
  const match = chordName.match(/^([A-G](?:#|b)?)(m?)$/);
  if (!match) {
    return { root: "C", quality: "major" };
  }

  return {
    root: match[1],
    quality: match[2] === "m" ? "minor" : "major",
  };
}

export function chordNameToNotes(chordName: string): string[] {
  const parsed = parseChordName(chordName);
  const quality: ChordQuality = parsed.quality === "minor" ? "minor" : "major";
  return getTriad(parsed.root, quality);
}

export function estimateMajorKey(segments: DetectedChordSegment[]): KeyEstimate {
  const usable = segments.filter((segment) => segment.confidence >= 0.48);
  if (usable.length === 0) {
    return { key: "C", confidence: 0 };
  }

  const ranked = CHROMATIC_NOTES_SHARP.map((key, keyIndex) => {
    const score = usable.reduce((sum, segment) => {
      const parsed = parseChordName(segment.chordName);
      const rootIndex = noteIndex(parsed.root);
      const scaleDegree = MAJOR_SCALE_OFFSETS.findIndex(
        (offset) => (keyIndex + offset) % 12 === rootIndex,
      );
      if (scaleDegree < 0) return sum - 0.12;
      const expected = MAJOR_QUALITIES[scaleDegree];
      const qualityScore = expected === parsed.quality ? 1 : 0.35;
      return sum + qualityScore * segment.confidence;
    }, 0);

    return { key, score };
  }).sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const second = ranked[1];
  const confidence = Math.max(
    0,
    Math.min(1, (best.score - (second?.score ?? 0)) / Math.max(usable.length, 1) + 0.35),
  );

  return { key: best.key, confidence };
}

export function chordToRoman(chordName: string, key: string): string {
  const parsed = parseChordName(chordName);
  const keyIndex = noteIndex(key);
  const rootIndex = noteIndex(parsed.root);
  const scaleDegree = MAJOR_SCALE_OFFSETS.findIndex(
    (offset) => (keyIndex + offset) % 12 === rootIndex,
  );

  if (scaleDegree < 0) return "?";
  return MAJOR_ROMANS[scaleDegree];
}

export function summarizeChordSegments(
  segments: DetectedChordSegment[],
  key: string,
): ProgressionSummary[] {
  const usable = segments.filter((segment) => segment.confidence >= 0.42);
  const summary: ProgressionSummary[] = [];

  for (const segment of usable) {
    const previous = summary[summary.length - 1];
    if (previous?.chordName === segment.chordName) {
      const previousDuration = previous.end - previous.start;
      const segmentDuration = segment.end - segment.start;
      previous.end = segment.end;
      previous.confidence =
        (previous.confidence * previousDuration +
          segment.confidence * segmentDuration) /
        (previousDuration + segmentDuration);
      continue;
    }

    summary.push({
      chordName: segment.chordName,
      romanNumeral: chordToRoman(segment.chordName, key),
      start: segment.start,
      end: segment.end,
      confidence: segment.confidence,
    });
  }

  return summary;
}
