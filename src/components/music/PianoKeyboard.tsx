"use client";

import { useMemo } from "react";
import { usePlaybackStore } from "@/store/playbackStore";
import { playNote } from "@/lib/audio/toneEngine";

const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const BLACK_KEYS: { note: string; afterWhite: string }[] = [
  { note: "C#", afterWhite: "C" },
  { note: "D#", afterWhite: "D" },
  { note: "F#", afterWhite: "F" },
  { note: "G#", afterWhite: "G" },
  { note: "A#", afterWhite: "A" },
];

type Props = {
  startOctave?: number;
  octaveCount?: number;
};

function pitchClass(note: string): string {
  return note.replace(/\d+$/, "");
}

function noteWithOctave(note: string, octave: number): string {
  return `${note}${octave}`;
}

export function PianoKeyboard({ startOctave = 4, octaveCount = 2 }: Props) {
  const activeNotes = usePlaybackStore((s) => s.activeNotes);

  const activeSet = useMemo(() => {
    const set = new Set<string>();
    for (const n of activeNotes) {
      set.add(n);
      set.add(pitchClass(n));
    }
    return set;
  }, [activeNotes]);

  const octaves = useMemo(
    () => Array.from({ length: octaveCount }, (_, i) => startOctave + i),
    [startOctave, octaveCount],
  );

  const handlePlay = (note: string) => {
    void playNote(note);
  };

  const totalWhiteKeys = octaves.length * WHITE_KEYS.length;

  return (
    <div className="rounded-2xl border border-edge bg-bg-surface p-4">
      <div className="relative mx-auto select-none" style={{ height: 180 }}>
        <div
          className="grid h-full overflow-hidden rounded-lg"
          style={{ gridTemplateColumns: `repeat(${totalWhiteKeys}, minmax(0, 1fr))` }}
        >
          {octaves.flatMap((octave) =>
            WHITE_KEYS.map((note) => {
              const full = noteWithOctave(note, octave);
              const isActive = activeSet.has(full) || activeSet.has(note);
              return (
                <button
                  key={full}
                  type="button"
                  onClick={() => handlePlay(full)}
                  className={`relative flex flex-col-reverse items-center justify-end border-r border-edge/60 pb-2 text-[10px] font-medium transition last:border-r-0 ${
                    isActive
                      ? "bg-gradient-to-b from-accent/80 to-accent text-white shadow-[inset_0_-12px_24px_rgba(124,92,255,0.4)]"
                      : "bg-white/95 text-black/50 hover:bg-white"
                  }`}
                >
                  <span className={isActive ? "text-white" : ""}>{note}</span>
                </button>
              );
            }),
          )}
        </div>

        <div className="pointer-events-none absolute inset-0">
          {octaves.flatMap((octave, octaveIdx) =>
            BLACK_KEYS.map(({ note, afterWhite }) => {
              const whiteIdx = WHITE_KEYS.indexOf(
                afterWhite as (typeof WHITE_KEYS)[number],
              );
              const positionIndex = octaveIdx * WHITE_KEYS.length + whiteIdx;
              const leftPct = ((positionIndex + 1) / totalWhiteKeys) * 100;
              const widthPct = (1 / totalWhiteKeys) * 100 * 0.6;
              const full = noteWithOctave(note, octave);
              const isActive = activeSet.has(full) || activeSet.has(note);

              return (
                <button
                  key={full}
                  type="button"
                  onClick={() => handlePlay(full)}
                  className={`pointer-events-auto absolute top-0 flex h-[62%] -translate-x-1/2 flex-col-reverse items-center rounded-b-md border border-black/40 pb-1 text-[9px] font-medium shadow-md transition ${
                    isActive
                      ? "bg-gradient-to-b from-accent-hot to-accent text-white shadow-[0_0_18px_rgba(255,92,138,0.6)]"
                      : "bg-bg-base text-white/40 hover:bg-bg-elevated"
                  }`}
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                  }}
                >
                  <span className={isActive ? "text-white" : ""}>{note}</span>
                </button>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
