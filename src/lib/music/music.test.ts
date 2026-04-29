import { describe, it, expect } from "vitest";
import { getMajorScale, getNaturalMinorScale } from "./scales";
import { getTriad, getDiatonicTriads } from "./chords";
import { getGuitarChordNotes, getGuitarChordShape } from "./guitar";
import { resolveRomanProgression } from "./progressions";
import { voiceLeadProgression } from "./voicing";

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

  it("spells flat major keys correctly", () => {
    expect(getMajorScale("F")).toEqual(["F", "G", "A", "Bb", "C", "D", "E"]);
    expect(getMajorScale("Bb")).toEqual([
      "Bb",
      "C",
      "D",
      "Eb",
      "F",
      "G",
      "A",
    ]);
    expect(getMajorScale("Eb")).toEqual([
      "Eb",
      "F",
      "G",
      "Ab",
      "Bb",
      "C",
      "D",
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

  it("Bb major triad", () => {
    expect(getTriad("Bb", "major")).toEqual(["Bb", "D", "F"]);
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

  it("F major diatonic triads use Bb instead of A#", () => {
    const triads = getDiatonicTriads("F", "major");
    expect(triads.map((t) => t.chordName)).toEqual([
      "F",
      "Gm",
      "Am",
      "Bb",
      "C",
      "Dm",
      "Edim",
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

  it("resolves I-V-vi-IV in Bb with flat spelling", () => {
    const result = resolveRomanProgression("Bb", ["I", "V", "vi", "IV"]);
    expect(result.map((r) => r.chordName)).toEqual(["Bb", "F", "Gm", "Eb"]);
    expect(result[0].notes).toEqual(["Bb", "D", "F"]);
    expect(result[3].notes).toEqual(["Eb", "G", "Bb"]);
  });
});

describe("voiceLeadProgression", () => {
  it("keeps I-V-vi-IV close and adds bass roots", () => {
    const resolved = resolveRomanProgression("C", ["I", "V", "vi", "IV"]);
    const voiced = voiceLeadProgression(resolved);

    expect(voiced.map((chord) => chord.notes)).toEqual([
      ["C4", "E4", "G4"],
      ["B3", "D4", "G4"],
      ["C4", "E4", "A4"],
      ["C4", "F4", "A4"],
    ]);
    expect(voiced.map((chord) => chord.bassNote)).toEqual([
      "C2",
      "G2",
      "A2",
      "F2",
    ]);
  });
});

describe("guitar chords", () => {
  it("maps open C shape to guitar string notes", () => {
    expect(getGuitarChordShape("C")?.frets).toEqual([-1, 3, 2, 0, 1, 0]);
    expect(getGuitarChordNotes("C")).toEqual([
      "C3",
      "E3",
      "G3",
      "C4",
      "E4",
    ]);
  });

  it("covers flat-key progression chords", () => {
    expect(getGuitarChordShape("Bb")?.frets).toEqual([-1, 1, 3, 3, 3, 1]);
    expect(getGuitarChordShape("Eb")?.frets).toEqual([-1, 6, 5, 3, 4, 3]);
    expect(getGuitarChordShape("Ab")?.frets).toEqual([4, 6, 6, 5, 4, 4]);
  });
});
