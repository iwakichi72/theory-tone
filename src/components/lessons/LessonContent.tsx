"use client";

import type { Lesson } from "@/lib/music/theoryTypes";
import { MusicExampleCard } from "@/components/music/MusicExampleCard";
import { PianoKeyboard } from "@/components/music/PianoKeyboard";

export function LessonContent({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-white/40">
          Lesson · {lesson.category}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="text-white/60">{lesson.summary}</p>
      </header>

      <div className="sticky top-[72px] z-20 -mx-2 rounded-2xl bg-bg-base/70 px-2 py-2 backdrop-blur">
        <PianoKeyboard startOctave={4} octaveCount={2} />
      </div>

      {lesson.sections.map((section) => (
        <section key={section.id} className="space-y-4">
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          <p className="whitespace-pre-line text-white/75">{section.body}</p>

          {section.examples.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {section.examples.map((ex) => (
                <MusicExampleCard key={ex.id} example={ex} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
