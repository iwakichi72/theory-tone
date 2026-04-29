"use client";

type Props = {
  onClick: () => void;
  isPlaying?: boolean;
  label?: string;
  size?: "sm" | "md";
};

export function PlayButton({
  onClick,
  isPlaying,
  label = "再生",
  size = "md",
}: Props) {
  const sizeCls =
    size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-accent to-accent-cool font-medium text-bg-base shadow-glow transition hover:brightness-110 active:scale-[0.98] ${sizeCls}`}
    >
      <span aria-hidden className="text-base leading-none">
        {isPlaying ? "■" : "▶"}
      </span>
      <span>{isPlaying ? "停止" : label}</span>
    </button>
  );
}
