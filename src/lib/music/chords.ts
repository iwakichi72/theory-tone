import { transpose } from "./notes";
import type { ChordQuality, DiatonicTriad } from "./theoryTypes";
import { getMajorScale, getNaturalMinorScale } from "./scales";

const QUALITY_INTERVALS: Record<ChordQuality, [number, number, number]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
};

export function getTriad(root: string, quality: ChordQuality): string[] {
  const intervals = QUALITY_INTERVALS[quality];
  return intervals.map((semi) => transpose(root, semi));
}

const MAJOR_DIATONIC_QUALITIES: ChordQuality[] = [
  "major",
  "minor",
  "minor",
  "major",
  "major",
  "minor",
  "dim",
];

const MINOR_DIATONIC_QUALITIES: ChordQuality[] = [
  "minor",
  "dim",
  "major",
  "minor",
  "minor",
  "major",
  "major",
];

const MAJOR_ROMAN: string[] = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const MINOR_ROMAN: string[] = ["i", "ii°", "III", "iv", "v", "VI", "VII"];

function chordSuffix(quality: ChordQuality): string {
  switch (quality) {
    case "major":
      return "";
    case "minor":
      return "m";
    case "dim":
      return "dim";
    case "aug":
      return "aug";
  }
}

export function chordName(root: string, quality: ChordQuality): string {
  return `${root}${chordSuffix(quality)}`;
}

export function getDiatonicTriads(
  key: string,
  mode: "major" | "minor",
): DiatonicTriad[] {
  const scale =
    mode === "major" ? getMajorScale(key) : getNaturalMinorScale(key);
  const qualities =
    mode === "major" ? MAJOR_DIATONIC_QUALITIES : MINOR_DIATONIC_QUALITIES;
  const romans = mode === "major" ? MAJOR_ROMAN : MINOR_ROMAN;

  return scale.map((noteName, i) => {
    const quality = qualities[i];
    return {
      degree: i + 1,
      romanNumeral: romans[i],
      chordName: chordName(noteName, quality),
      notes: getTriad(noteName, quality),
    };
  });
}
