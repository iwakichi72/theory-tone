import { describe, it, expect } from "vitest";
import { getMajorScale, getNaturalMinorScale } from "./scales";
import { getTriad, getDiatonicTriads } from "./chords";
import { resolveRomanProgression } from "./progressions";

describe("scales", () => {
  it("builds C major scale", () => {
    expect(getMajorScale("C")).toEqual(["C", "D", "E", "F", "G", "A", "B"]);
  });

  it("builds A natural minor scale", () => {
    expect(getNaturalMinorScale("A")).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
    ]);
  });

  it("builds G major scale", () => {
    expect(getMajorScale("G")).toEqual([
      "G",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F#",
    ]);
  });
});

describe("triads", () => {
  it("C major triad", () => {
    expect(getTriad("C", "major")).toEqual(["C", "E", "G"]);
  });

  it("A minor triad", () => {
    expect(getTriad("A", "minor")).toEqual(["A", "C", "E"]);
  });

  it("B diminished triad", () => {
    expect(getTriad("B", "dim")).toEqual(["B", "D", "F"]);
  });

  it("C augmented triad", () => {
    expect(getTriad("C", "aug")).toEqual(["C", "E", "G#"]);
  });
});

describe("diatonic triads", () => {
  it("C major diatonic triads", () => {
    const triads = getDiatonicTriads("C", "major");
    expect(triads.map((t) => t.chordName)).toEqual([
      "C",
      "Dm",
      "Em",
      "F",
      "G",
      "Am",
      "Bdim",
    ]);
    expect(triads.map((t) => t.romanNumeral)).toEqual([
      "I",
      "ii",
      "iii",
      "IV",
      "V",
      "vi",
      "vii°",
    ]);
  });
});

describe("resolveRomanProgression", () => {
  it("resolves I-V-vi-IV in C", () => {
    const result = resolveRomanProgression("C", ["I", "V", "vi", "IV"]);
    expect(result.map((r) => r.chordName)).toEqual(["C", "G", "Am", "F"]);
  });

  it("resolves I-V-vi-IV in G", () => {
    const result = resolveRomanProgression("G", ["I", "V", "vi", "IV"]);
    expect(result.map((r) => r.chordName)).toEqual(["G", "D", "Em", "C"]);
  });

  it("resolves ii-V-I in C", () => {
    const result = resolveRomanProgression("C", ["ii", "V", "I"]);
    expect(result.map((r) => r.chordName)).toEqual(["Dm", "G", "C"]);
  });
});
