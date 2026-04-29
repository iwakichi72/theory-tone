"use client";

type Props = {
  value: number;
  onChange: (bpm: number) => void;
  min?: number;
  max?: number;
};

export function BpmControl({ value, onChange, min = 50, max = 200 }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wide text-white/40">
        BPM
      </label>
      <div className="flex items-center gap-3 rounded-md border border-edge bg-bg-elevated px-3 py-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-[#7c5cff]"
        />
        <span className="w-12 text-right font-mono text-sm tabular-nums">
          {value}
        </span>
      </div>
    </div>
  );
}
