"use client";

import { create } from "zustand";
import type { Instrument } from "@/lib/music/theoryTypes";

type PlaybackStore = {
  isPlaying: boolean;
  activeNotes: string[];
  activeChord?: string;
  activeStepIndex?: number;
  bpm: number;
  selectedKey: string;
  selectedInstrument: Instrument;
  loop: boolean;

  setIsPlaying: (value: boolean) => void;
  setActiveNotes: (notes: string[]) => void;
  setActiveChord: (chord?: string) => void;
  setActiveStepIndex: (index?: number) => void;
  setBpm: (bpm: number) => void;
  setSelectedKey: (key: string) => void;
  setSelectedInstrument: (instrument: Instrument) => void;
  setLoop: (value: boolean) => void;
  resetPlayback: () => void;
};

export const usePlaybackStore = create<PlaybackStore>((set) => ({
  isPlaying: false,
  activeNotes: [],
  activeChord: undefined,
  activeStepIndex: undefined,
  bpm: 100,
  selectedKey: "C",
  selectedInstrument: "synth",
  loop: false,

  setIsPlaying: (value) => set({ isPlaying: value }),
  setActiveNotes: (notes) => set({ activeNotes: notes }),
  setActiveChord: (chord) => set({ activeChord: chord }),
  setActiveStepIndex: (index) => set({ activeStepIndex: index }),
  setBpm: (bpm) => set({ bpm }),
  setSelectedKey: (key) => set({ selectedKey: key }),
  setSelectedInstrument: (instrument) => set({ selectedInstrument: instrument }),
  setLoop: (value) => set({ loop: value }),
  resetPlayback: () =>
    set({
      isPlaying: false,
      activeNotes: [],
      activeChord: undefined,
      activeStepIndex: undefined,
    }),
}));
