import { getMajorScale, getNaturalMinorScale } from "./scales";
import { chordName, getTriad } from "./chords";
import type { ChordQuality, ResolvedChord } from "./theoryTypes";

const ROMAN_DEGREE: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
};

type ParsedRoman = {
  degree: number;
  quality: ChordQuality;
};

function parseRoman(raw: string): ParsedRoman {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Empty roman numeral");
  }

  const hasDim = trimmed.includes("°") || trimmed.toLowerCase().endsWith("dim");
  const hasAug = trimmed.includes("+") || trimmed.toLowerCase().endsWith("aug");

  // Strip suffixes/markers we already captured
  const lettersOnly = trimmed
    .replace(/°/g, "")
    .replace(/\+/g, "")
    .replace(/dim$/i, "")
    .replace(/aug$/i, "");

  const upper = lettersOnly.toUpperCase();
  const degree = ROMAN_DEGREE[upper];
  if (!degree) {
    throw new Error(`Unknown roman numeral: ${raw}`);
  }

  const isUpper = lettersOnly === upper;

  let quality: ChordQuality;
  if (hasDim) {
    quality = "dim";
  } else if (hasAug) {
    quality = "aug";
  } else if (isUpper) {
    quality = "major";
  } else {
    quality = "minor";
  }

  return { degree, quality };
}

export function resolveRomanProgression(
  key: string,
  romanNumerals: string[],
  mode: "major" | "minor" = "major",
): ResolvedChord[] {
  const scale =
    mode === "major" ? getMajorScale(key) : getNaturalMinorScale(key);

  return romanNumerals.map((roman) => {
    const { degree, quality } = parseRoman(roman);
    const root = scale[degree - 1];
    return {
      romanNumeral: roman,
      chordName: chordName(root, quality),
      notes: getTriad(root, quality),
    };
  });
}
