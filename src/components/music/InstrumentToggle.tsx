"use client";

import type { Instrument } from "@/lib/music/theoryTypes";

type Props = {
  value: Instrument;
  onChange: (instrument: Instrument) => void;
};

const MODES: { value: Instrument; label: string }[] = [
  { value: "synth", label: "Keys" },
  { value: "guitar", label: "Guitar" },
];

export function InstrumentToggle({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wide text-white/40">
        Mode
      </label>
      <div className="grid grid-cols-2 rounded-md border border-edge bg-bg-elevated p-1">
        {MODES.map((mode) => {
          const isActive =
            mode.value === "guitar" ? value === "guitar" : value !== "guitar";

          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => onChange(mode.value)}
              className={`rounded px-3 py-1.5 text-sm transition ${
                isActive
                  ? "bg-accent text-white shadow-glow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
