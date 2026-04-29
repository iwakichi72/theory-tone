import Link from "next/link";
import type { Lesson } from "@/lib/music/theoryTypes";

const CATEGORY_LABEL: Record<Lesson["category"], string> = {
  basics: "基礎",
  scales: "スケール",
  intervals: "音程",
  chords: "コード",
  progressions: "進行",
  composition: "作曲",
};

const LEVEL_LABEL: Record<Lesson["level"], string> = {
  beginner: "初級",
  intermediate: "中級",
};

export function LessonList({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson, idx) => (
        <Link
          key={lesson.id}
          href={`/lessons/${lesson.id}`}
          className="group flex flex-col gap-3 rounded-2xl border border-edge bg-bg-surface p-5 transition hover:border-accent hover:bg-bg-elevated"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="rounded-md bg-bg-elevated px-2 py-0.5 text-white/60">
              {CATEGORY_LABEL[lesson.category]}
            </span>
            <span className="text-white/40">{LEVEL_LABEL[lesson.level]}</span>
          </div>
          <div>
            <div className="text-xs text-white/40">Lesson {idx + 1}</div>
            <h3 className="mt-1 text-lg font-semibold leading-snug">
              {lesson.title}
            </h3>
          </div>
          <p className="text-sm text-white/60">{lesson.summary}</p>
          <span className="mt-auto text-sm text-accent-cool group-hover:text-accent">
            開く →
          </span>
        </Link>
      ))}
    </div>
  );
}
