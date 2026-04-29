"use client";

const KEYS = ["C", "G", "D", "A", "E", "F", "Bb"] as const;

type Props = {
  value: string;
  onChange: (key: string) => void;
};

export function KeySelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-wide text-white/40">
        キー
      </label>
      <div className="flex flex-wrap gap-1">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            className={`min-w-[2.5rem] rounded-md border px-2.5 py-1 text-sm font-mono transition ${
              value === k
                ? "border-accent bg-accent/20 text-white"
                : "border-edge bg-bg-elevated text-white/70 hover:text-white"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
