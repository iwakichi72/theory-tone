"use client";

import { ascendingNoteOctaves, withOctave } from "@/lib/music/notes";
import { usePlaybackStore } from "@/store/playbackStore";

type ToneModule = typeof import("tone");

let tonePromise: Promise<ToneModule> | null = null;
let synth: import("tone").PolySynth | null = null;
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
  options?: { loop?: boolean },
): Promise<void> {
  if (!isBrowser() || chords.length === 0) return;
  await ensureStarted();

  clearProgressionSchedule();
  const token = activeProgressionToken;
  const loop = options?.loop ?? false;

  const beatsPerChord = 2;
  const chordDurationMs = (60 / bpm) * 1000 * beatsPerChord;

  usePlaybackStore.getState().setIsPlaying(true);

  const scheduleCycle = (cycleStart: number) => {
    chords.forEach((chord, index) => {
      const pitched = chord.notes.map((n) =>
        n.match(/\d/) ? n : withOctave(n, 4),
      );

      const timeout = setTimeout(
        () => {
          if (token !== activeProgressionToken) return;
          synth?.triggerAttackRelease(pitched, `${beatsPerChord}n`);
          const store = usePlaybackStore.getState();
          store.setActiveChord(chord.chordName);
          store.setActiveNotes(pitched);
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
  usePlaybackStore.getState().resetPlayback();
}
