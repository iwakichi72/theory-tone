import { RecordingAnalyzer } from "@/components/analyze/RecordingAnalyzer";

export const metadata = {
  title: "録音コード解析 · TheoryTone",
};

export default function AnalyzePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          録音コード解析
        </h1>
        <p className="text-white/60">
          弾いたコード進行を録音して、コード名とローマ数字へ変換します。
        </p>
      </header>
      <RecordingAnalyzer />
    </div>
  );
}
