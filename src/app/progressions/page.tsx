import { ProgressionPlayer } from "@/components/music/ProgressionPlayer";

export const metadata = {
  title: "コード進行プレイヤー · TheoryTone",
};

export default function ProgressionsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          コード進行プレイヤー
        </h1>
        <p className="text-white/60">
          プリセットの進行をキー・BPM・ループを変えながら鳴らして、構造を耳で確認できます。
        </p>
      </header>
      <ProgressionPlayer />
    </div>
  );
}
