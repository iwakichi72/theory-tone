import Link from "next/link";
import { lessons } from "@/data/lessons";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-edge bg-bg-surface p-8 sm:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-accent-cool/20 blur-3xl" />

        <div className="relative max-w-2xl space-y-5">
          <span className="inline-block rounded-full border border-edge bg-bg-elevated px-3 py-1 text-xs text-white/60">
            MVP · 音で学ぶ音楽理論
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            読むだけじゃない。
            <br />
            <span className="bg-gradient-to-r from-accent to-accent-cool bg-clip-text text-transparent">
              鳴らして、見て、触って覚える音楽理論。
            </span>
          </h1>
          <p className="text-white/65">
            TheoryTone はスケール・コード・コード進行を実際に再生し、鳴っている音を鍵盤上で確認できるインタラクティブな学習ツールです。説明文だけで分かったつもりにならず、耳と目で理解しましょう。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/lessons"
              className="rounded-lg bg-gradient-to-br from-accent to-accent-cool px-5 py-2.5 text-sm font-medium text-bg-base shadow-glow transition hover:brightness-110"
            >
              レッスンを見る
            </Link>
            <Link
              href="/progressions"
              className="rounded-lg border border-edge bg-bg-elevated px-5 py-2.5 text-sm transition hover:border-accent hover:text-white"
            >
              コード進行プレイヤー
            </Link>
            <Link
              href="/analyze"
              className="rounded-lg border border-edge bg-bg-elevated px-5 py-2.5 text-sm transition hover:border-accent-cool hover:text-white"
            >
              録音解析
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold">レッスン</h2>
            <p className="text-sm text-white/55">
              基礎から進行まで、音を鳴らしながら順に学べます。
            </p>
          </div>
          <Link
            href="/lessons"
            className="text-sm text-accent-cool hover:text-accent"
          >
            すべて見る →
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.slice(0, 3).map((lesson) => (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.id}`}
              className="rounded-2xl border border-edge bg-bg-surface p-5 transition hover:border-accent hover:bg-bg-elevated"
            >
              <div className="text-xs text-white/45">{lesson.category}</div>
              <h3 className="mt-1 font-semibold">{lesson.title}</h3>
              <p className="mt-2 text-sm text-white/60">{lesson.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
