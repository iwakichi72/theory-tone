"use client";

import { useState } from "react";
import type { MusicExample } from "@/lib/music/theoryTypes";
import {
  playNote,
  playMelody,
  playChord,
  playProgression,
  stopPlayback,
} from "@/lib/audio/toneEngine";
import { resolveRomanProgression } from "@/lib/music/progressions";
import { PlayButton } from "./PlayButton";
import { usePlaybackStore } from "@/store/playbackStore";

type Props = {
  example: MusicExample;
};

export function MusicExampleCard({ example }: Props) {
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const activeChord = usePlaybackStore((s) => s.activeChord);
  const activeStepIndex = usePlaybackStore((s) => s.activeStepIndex);
  const [thisCardPlaying, setThisCardPlaying] = useState(false);

  const handlePlay = async () => {
    if (thisCardPlaying) {
      stopPlayback();
      setThisCardPlaying(false);
      return;
    }

    setThisCardPlaying(true);

    try {
      switch (example.type) {
        case "note": {
          if (example.notes && example.notes.length > 0) {
            if (example.notes.length === 1) {
              await playNote(example.notes[0]);
            } else {
              await playMelody(example.notes, example.bpm ?? 120);
            }
          }
          break;
        }
        case "scale": {
          if (example.notes) {
            await playMelody(example.notes, example.bpm ?? 110);
          }
          break;
        }
        case "chord": {
          if (example.notes) {
            await playChord(example.notes);
          }
          break;
        }
        case "progression": {
          const key = example.key ?? "C";
          const resolved = example.romanNumerals
            ? resolveRomanProgression(key, [...example.romanNumerals])
            : (example.chords ?? []).map((c) => ({
                chordName: c,
                notes: [],
              }));
          await playProgression(resolved, example.bpm ?? 100, { loop: false });
          break;
        }
      }
    } finally {
      setTimeout(() => setThisCardPlaying(false), 200);
    }
  };

  const displayItems = (() => {
    if (example.type === "progression") {
      const labels = example.chords ?? example.romanNumerals ?? [];
      return labels;
    }
    return example.notes ?? [];
  })();

  return (
    <div className="rounded-xl border border-edge bg-bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-white/40">
            {labelForType(example.type)}
          </div>
          <h4 className="mt-0.5 truncate font-medium">{example.label}</h4>
          {example.description && (
            <p className="mt-1 text-sm text-white/60">{example.description}</p>
          )}
        </div>
        <PlayButton
          onClick={handlePlay}
          isPlaying={thisCardPlaying && isPlaying}
          size="sm"
        />
      </div>

      {displayItems.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {displayItems.map((item, i) => {
            const isActive =
              example.type === "progression"
                ? thisCardPlaying &&
                  (activeStepIndex === i ||
                    (activeChord && activeChord === item))
                : false;
            return (
              <span
                key={`${item}-${i}`}
                className={`rounded-md border px-2 py-0.5 font-mono text-xs transition ${
                  isActive
                    ? "border-accent bg-accent/20 text-white"
                    : "border-edge bg-bg-elevated text-white/70"
                }`}
              >
                {item}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function labelForType(type: MusicExample["type"]): string {
  switch (type) {
    case "note":
      return "Note";
    case "scale":
      return "Scale";
    case "chord":
      return "Chord";
    case "progression":
      return "Progression";
  }
}
