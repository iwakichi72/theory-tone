import { lessons } from "@/data/lessons";
import { LessonList } from "@/components/lessons/LessonList";

export const metadata = {
  title: "レッスン一覧 · TheoryTone",
};

export default function LessonsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">レッスン</h1>
        <p className="text-white/60">
          音名から王道コード進行まで。気になるところから触ってOKです。
        </p>
      </header>
      <LessonList lessons={lessons} />
    </div>
  );
}
