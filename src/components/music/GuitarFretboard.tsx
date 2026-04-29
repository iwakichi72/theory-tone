"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GUITAR_STRINGS,
  getGuitarChordNotes,
  getGuitarChordShape,
  getGuitarShapeBaseFret,
} from "@/lib/music/guitar";
import type { ResolvedChord } from "@/lib/music/theoryTypes";

const VISIBLE_FRETS = 5;

type Props = {
  chords: ResolvedChord[];
  activeStepIndex?: number;
  isPlaying: boolean;
};

export function GuitarFretboard({ chords, activeStepIndex, isPlaying }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isPlaying && activeStepIndex !== undefined) {
      setSelectedIndex(activeStepIndex);
    }
  }, [activeStepIndex, isPlaying]);

  const safeIndex = Math.min(selectedIndex, Math.max(chords.length - 1, 0));
  const chord = chords[safeIndex];
  const shape = chord ? getGuitarChordShape(chord.chordName) : undefined;
  const guitarNotes = chord ? getGuitarChordNotes(chord.chordName) : [];
  const baseFret = shape ? getGuitarShapeBaseFret(shape) : 1;

  const stringLines = useMemo(
    () =>
      GUITAR_STRINGS.map((string, index) => ({
        ...string,
        left: `${(index / (GUITAR_STRINGS.length - 1)) * 100}%`,
      })),
    [],
  );

  if (!chord) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-edge bg-bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-white/40">
            Guitar
          </div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-mono text-3xl">{chord.chordName}</span>
            <span className="font-mono text-sm text-white/45">
              {chord.romanNumeral}
            </span>
          </div>
        </div>
        <div className="font-mono text-xs text-white/45">
          {guitarNotes.length > 0 ? guitarNotes.join(" · ") : chord.notes.join(" · ")}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto pb-1">
        <div className="mx-auto min-w-[340px] max-w-[560px]">
          <div className="relative h-[250px] px-10 pb-8 pt-8">
            <div className="absolute left-2 top-8 font-mono text-xs text-white/35">
              {baseFret > 1 ? `${baseFret}fr` : ""}
            </div>

            <div className="absolute inset-x-10 bottom-8 top-8">
              {Array.from({ length: VISIBLE_FRETS + 1 }, (_, fretIndex) => (
                <div
                  key={`fret-${fretIndex}`}
                  className={`absolute left-0 right-0 border-t ${
                    fretIndex === 0 && baseFret === 1
                      ? "border-t-4 border-white/75"
                      : "border-white/20"
                  }`}
                  style={{ top: `${(fretIndex / VISIBLE_FRETS) * 100}%` }}
                />
              ))}

              {stringLines.map((string) => (
                <div
                  key={`${string.label}-${string.openMidi}`}
                  className="absolute bottom-0 top-0 border-l border-white/35"
                  style={{ left: string.left }}
                />
              ))}

              {shape ? (
                shape.frets.map((fret, stringIndex) => {
                  const left =
                    (stringIndex / (GUITAR_STRINGS.length - 1)) * 100;

                  if (fret < 0 || fret === 0) {
                    return (
                      <div
                        key={`${chord.chordName}-${stringIndex}-${fret}`}
                        className={`absolute top-[-30px] -translate-x-1/2 font-mono text-xs ${
                          fret === 0 ? "text-accent-cool" : "text-white/35"
                        }`}
                        style={{ left: `${left}%` }}
                      >
                        {fret === 0 ? "o" : "x"}
                      </div>
                    );
                  }

                  const visiblePosition = fret - baseFret;
                  const top =
                    ((visiblePosition + 0.5) / VISIBLE_FRETS) * 100;

                  return (
                    <div
                      key={`${chord.chordName}-${stringIndex}-${fret}`}
                      className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent-cool/80 bg-accent-cool text-[11px] font-semibold text-bg-base shadow-[0_0_18px_rgba(92,200,255,0.35)]"
                      style={{ left: `${left}%`, top: `${top}%` }}
                    >
                      {fret}
                    </div>
                  );
                })
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-white/45">
                  フォーム未登録
                </div>
              )}

              {stringLines.map((string) => (
                <div
                  key={`label-${string.openMidi}`}
                  className="absolute bottom-[-30px] -translate-x-1/2 font-mono text-xs text-white/45"
                  style={{ left: string.left }}
                >
                  {string.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {chords.map((item, index) => {
          const isActive = index === safeIndex;
          const hasShape = Boolean(getGuitarChordShape(item.chordName));

          return (
            <button
              key={`${item.romanNumeral}-${item.chordName}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`rounded-lg border px-3 py-2 text-left transition ${
                isActive
                  ? "border-accent-cool bg-accent-cool/15 text-white"
                  : "border-edge bg-bg-elevated text-white/70 hover:text-white"
              }`}
            >
              <div className="font-mono text-xs text-white/40">
                {item.romanNumeral}
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <span className="font-mono text-lg">{item.chordName}</span>
                <span className="font-mono text-[10px] uppercase text-white/35">
                  {hasShape ? "form" : "notes"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
