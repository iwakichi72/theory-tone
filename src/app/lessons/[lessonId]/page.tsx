import { notFound } from "next/navigation";
import Link from "next/link";
import { getLessonById, lessons } from "@/data/lessons";
import { LessonContent } from "@/components/lessons/LessonContent";

export function generateStaticParams() {
  return lessons.map((l) => ({ lessonId: l.id }));
}

export default function LessonDetailPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const lesson = getLessonById(params.lessonId);
  if (!lesson) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/lessons"
        className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white"
      >
        ← レッスン一覧へ
      </Link>
      <LessonContent lesson={lesson} />
    </div>
  );
}
