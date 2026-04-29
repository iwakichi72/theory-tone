"use client";

import { ascendingNoteOctaves, withOctave } from "@/lib/music/notes";
import type { Instrument } from "@/lib/music/theoryTypes";
import { getGuitarChordNotes } from "@/lib/music/guitar";
import { voiceLeadProgression } from "@/lib/music/voicing";
import { usePlaybackStore } from "@/store/playbackStore";

type ToneModule = typeof import("tone");

let tonePromise: Promise<ToneModule> | null = null;
let synth: import("tone").PolySynth | null = null;
let bassSynth: import("tone").Synth | null = null;
let guitarSynths: import("tone").PluckSynth[] | null = null;
let started = false;

let activeProgressionTimeouts: ReturnType<typeof setTimeout>[] = [];
let activeProgressionToken = 0;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

async function getTone(): Promise<ToneModule> {
  if (!isBrowser()) {
    throw new Error("Tone.js cannot be used during SSR");
  }
  if (!tonePromise) {
    tonePromise = import("tone");
  }
  return tonePromise;
}

async function ensureStarted(): Promise<ToneModule> {
  const Tone = await getTone();
  if (!started) {
    await Tone.start();
    started = true;
  }
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.4,
        release: 0.6,
      },
    }).toDestination();
    synth.volume.value = -8;
  }
  if (!bassSynth) {
    bassSynth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.02,
        decay: 0.12,
        sustain: 0.55,
        release: 0.5,
      },
    }).toDestination();
    bassSynth.volume.value = -13;
  }
  if (!guitarSynths) {
    guitarSynths = Array.from({ length: 6 }, () => {
      const stringSynth = new Tone.PluckSynth({
        attackNoise: 0.7,
        dampening: 4200,
        resonance: 0.82,
        release: 1.2,
      }).toDestination();
      stringSynth.volume.value = -4;
      return stringSynth;
    });
  }
  return Tone;
}

function clearProgressionSchedule() {
  for (const t of activeProgressionTimeouts) clearTimeout(t);
  activeProgressionTimeouts = [];
  activeProgressionToken += 1;
}

export async function playNote(note: string): Promise<void> {
  if (!isBrowser()) return;
  await ensureStarted();
  const pitched = note.match(/\d/) ? note : withOctave(note, 4);
  synth?.triggerAttackRelease(pitched, "8n");

  const store = usePlaybackStore.getState();
  store.setActiveNotes([pitched]);
  setTimeout(() => {
    const current = usePlaybackStore.getState().activeNotes;
    if (current.length === 1 && current[0] === pitched) {
      usePlaybackStore.getState().setActiveNotes([]);
    }
  }, 400);
}

export async function playMelody(
  notes: string[],
  bpm = 100,
): Promise<void> {
  if (!isBrowser() || notes.length === 0) return;
  await ensureStarted();

  clearProgressionSchedule();
  const token = activeProgressionToken;

  const pitched = ascendingNoteOctaves(
    notes.map((n) => n.replace(/\d+$/, "")),
    4,
  );

  const stepMs = (60 / bpm) * 1000;
  const store = usePlaybackStore.getState();
  store.setIsPlaying(true);

  pitched.forEach((note, index) => {
    const timeout = setTimeout(() => {
      if (token !== activeProgressionToken) return;
      synth?.triggerAttackRelease(note, "8n");
      usePlaybackStore.getState().setActiveNotes([note]);
      usePlaybackStore.getState().setActiveStepIndex(index);
    }, index * stepMs);
    activeProgressionTimeouts.push(timeout);
  });

  const endTimeout = setTimeout(() => {
    if (token !== activeProgressionToken) return;
    usePlaybackStore.getState().resetPlayback();
  }, pitched.length * stepMs + 200);
  activeProgressionTimeouts.push(endTimeout);
}

export async function playChord(notes: string[]): Promise<void> {
  if (!isBrowser() || notes.length === 0) return;
  await ensureStarted();

  const pitched = notes.map((n) =>
    n.match(/\d/) ? n : withOctave(n, 4),
  );

  synth?.triggerAttackRelease(pitched, "2n");
  const store = usePlaybackStore.getState();
  store.setActiveNotes(pitched);
  setTimeout(() => {
    const current = usePlaybackStore.getState().activeNotes;
    if (
      current.length === pitched.length &&
      current.every((n, i) => n === pitched[i])
    ) {
      usePlaybackStore.getState().setActiveNotes([]);
    }
  }, 1000);
}

export type ProgressionStep = {
  chordName: string;
  notes: string[];
};

export async function playProgression(
  chords: ProgressionStep[],
  bpm: number,
  options?: { loop?: boolean; instrument?: Instrument },
): Promise<void> {
  if (!isBrowser() || chords.length === 0) return;
  const Tone = await ensureStarted();

  clearProgressionSchedule();
  const token = activeProgressionToken;
  const loop = options?.loop ?? false;
  const instrument =
    options?.instrument ?? usePlaybackStore.getState().selectedInstrument;
  const voicedChords = voiceLeadProgression(chords);

  const beatsPerChord = 2;
  const chordDurationMs = (60 / bpm) * 1000 * beatsPerChord;

  usePlaybackStore.getState().setIsPlaying(true);

  const scheduleCycle = (cycleStart: number) => {
    voicedChords.forEach((chord, index) => {
      const pitched = chord.notes.map((n) =>
        n.match(/\d/) ? n : withOctave(n, 4),
      );
      const guitarNotes =
        instrument === "guitar" ? getGuitarChordNotes(chord.chordName) : [];

      const timeout = setTimeout(
        () => {
          if (token !== activeProgressionToken) return;
          if (instrument === "guitar") {
            const notesToStrum = guitarNotes.length > 0 ? guitarNotes : pitched;
            const start = Tone.now();
            notesToStrum.forEach((note, noteIndex) => {
              guitarSynths?.[noteIndex % guitarSynths.length]?.triggerAttack(
                note,
                start + noteIndex * 0.028,
              );
            });
            const store = usePlaybackStore.getState();
            store.setActiveChord(chord.chordName);
            store.setActiveNotes(notesToStrum);
            store.setActiveStepIndex(index);
            return;
          }

          if (pitched.length > 0) {
            synth?.triggerAttackRelease(pitched, `${beatsPerChord}n`);
          }
          if (chord.bassNote) {
            bassSynth?.triggerAttackRelease(
              chord.bassNote,
              `${beatsPerChord}n`,
            );
          }
          const store = usePlaybackStore.getState();
          store.setActiveChord(chord.chordName);
          store.setActiveNotes(
            chord.bassNote ? [...pitched, chord.bassNote] : pitched,
          );
          store.setActiveStepIndex(index);
        },
        cycleStart + index * chordDurationMs,
      );
      activeProgressionTimeouts.push(timeout);
    });

    const endOfCycle = cycleStart + chords.length * chordDurationMs;
    if (loop) {
      const loopTimeout = setTimeout(() => {
        if (token !== activeProgressionToken) return;
        scheduleCycle(0);
      }, endOfCycle);
      activeProgressionTimeouts.push(loopTimeout);
    } else {
      const endTimeout = setTimeout(() => {
        if (token !== activeProgressionToken) return;
        usePlaybackStore.getState().resetPlayback();
      }, endOfCycle + 100);
      activeProgressionTimeouts.push(endTimeout);
    }
  };

  scheduleCycle(0);
}

export function stopPlayback(): void {
  clearProgressionSchedule();
  if (synth) {
    try {
      synth.releaseAll();
    } catch {
      // ignore
    }
  }
  if (bassSynth) {
    try {
      bassSynth.triggerRelease();
    } catch {
      // ignore
    }
  }
  if (guitarSynths) {
    for (const stringSynth of guitarSynths) {
      try {
        stringSynth.triggerRelease();
      } catch {
        // ignore
      }
    }
  }
  usePlaybackStore.getState().resetPlayback();
}
