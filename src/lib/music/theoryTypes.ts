export type ChordQuality = "major" | "minor" | "dim" | "aug";

export type ScaleMode = "major" | "minor";

export type DiatonicTriad = {
  degree: number;
  romanNumeral: string;
  chordName: string;
  notes: string[];
};

export type ResolvedChord = {
  romanNumeral: string;
  chordName: string;
  notes: string[];
};

export type LessonCategory =
  | "basics"
  | "scales"
  | "intervals"
  | "chords"
  | "progressions"
  | "composition";

export type LessonLevel = "beginner" | "intermediate";

export type MusicExample = {
  id: string;
  type: "note" | "scale" | "chord" | "progression";
  label: string;
  key?: string;
  notes?: string[];
  chords?: string[];
  romanNumerals?: string[];
  bpm?: number;
  description?: string;
};

export type LessonSection = {
  id: string;
  heading: string;
  body: string;
  examples: MusicExample[];
};

export type Lesson = {
  id: string;
  title: string;
  category: LessonCategory;
  level: LessonLevel;
  summary: string;
  sections: LessonSection[];
};

export type Instrument = "synth" | "piano" | "pad";

export type PlaybackState = {
  isPlaying: boolean;
  activeNotes: string[];
  activeChord?: string;
  activeStepIndex?: number;
  bpm: number;
  selectedKey: string;
  selectedInstrument: Instrument;
  loop: boolean;
};
