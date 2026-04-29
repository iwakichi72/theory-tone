"use client";

import { useEffect, useMemo, useState } from "react";
import { progressionPresets } from "@/data/progressionPresets";
import { resolveRomanProgression } from "@/lib/music/progressions";
import { usePlaybackStore } from "@/store/playbackStore";
import { playProgression, stopPlayback } from "@/lib/audio/toneEngine";
import { KeySelector } from "./KeySelector";
import { BpmControl } from "./BpmControl";
import { PlayButton } from "./PlayButton";
import { GuitarFretboard } from "./GuitarFretboard";
import { InstrumentToggle } from "./InstrumentToggle";
import { PianoKeyboard } from "./PianoKeyboard";

export function ProgressionPlayer() {
  const [presetId, setPresetId] = useState<string>(progressionPresets[0].id);

  const selectedKey = usePlaybackStore((s) => s.selectedKey);
  const setSelectedKey = usePlaybackStore((s) => s.setSelectedKey);
  const bpm = usePlaybackStore((s) => s.bpm);
  const setBpm = usePlaybackStore((s) => s.setBpm);
  const loop = usePlaybackStore((s) => s.loop);
  const setLoop = usePlaybackStore((s) => s.setLoop);
  const selectedInstrument = usePlaybackStore((s) => s.selectedInstrument);
  const setSelectedInstrument = usePlaybackStore((s) => s.setSelectedInstrument);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const activeStepIndex = usePlaybackStore((s) => s.activeStepIndex);

  const preset = useMemo(
    () => progressionPresets.find((p) => p.id === presetId)!,
    [presetId],
  );

  const resolved = useMemo(() => {
    try {
      return resolveRomanProgression(selectedKey, [...preset.romanNumerals]);
    } catch {
      return [];
    }
  }, [preset, selectedKey]);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }
    await playProgression(resolved, bpm, {
      instrument: selectedInstrument,
      loop,
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-edge bg-bg-surface p-5">
        <div className="grid gap-5 md:grid-cols-[2fr,1fr,1fr,1fr,auto] md:items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-white/40">
              プリセット
            </label>
            <select
              value={presetId}
              onChange={(e) => setPresetId(e.target.value)}
              className="rounded-md border border-edge bg-bg-elevated px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {progressionPresets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.romanNumerals.join("–")})
                </option>
              ))}
            </select>
            <p className="text-xs text-white/50">{preset.description}</p>
          </div>

          <KeySelector value={selectedKey} onChange={setSelectedKey} />
          <BpmControl value={bpm} onChange={setBpm} />
          <InstrumentToggle
            value={selectedInstrument}
            onChange={setSelectedInstrument}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wide text-white/40">
              ループ
            </label>
            <button
              type="button"
              onClick={() => setLoop(!loop)}
              className={`rounded-md border px-3 py-2 text-sm transition ${
                loop
                  ? "border-accent bg-accent/20 text-white"
                  : "border-edge bg-bg-elevated text-white/70 hover:text-white"
              }`}
            >
              {loop ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <PlayButton onClick={handleTogglePlay} isPlaying={isPlaying} />
          <span className="text-xs text-white/50">
            {selectedKey} メジャーキー · {preset.romanNumerals.join(" – ")} ·{" "}
            {selectedInstrument === "guitar" ? "Guitar" : "Keys"}
          </span>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {resolved.map((chord, i) => {
            const isActive = isPlaying && activeStepIndex === i;
            return (
              <div
                key={`${chord.romanNumeral}-${i}`}
                className={`rounded-xl border p-3 transition ${
                  isActive
                    ? "border-accent bg-accent/15 shadow-glow"
                    : "border-edge bg-bg-elevated"
                }`}
              >
                <div className="text-xs uppercase tracking-wide text-white/40">
                  {chord.romanNumeral}
                </div>
                <div className="mt-1 font-mono text-2xl">
                  {chord.chordName}
                </div>
                <div className="mt-1 text-xs text-white/50">
                  {chord.notes.join(" · ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedInstrument === "guitar" ? (
        <GuitarFretboard
          chords={resolved}
          activeStepIndex={activeStepIndex}
          isPlaying={isPlaying}
        />
      ) : (
        <PianoKeyboard startOctave={4} octaveCount={2} />
      )}
    </div>
  );
}
