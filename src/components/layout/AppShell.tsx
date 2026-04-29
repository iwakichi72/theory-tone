import { AppHeader } from "./AppHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </main>
      <footer className="border-t border-edge/70 px-6 py-6 text-center text-xs text-white/40">
        TheoryTone · MVP — 音と鍵盤で音楽理論を体感する学習ツール
      </footer>
    </div>
  );
}
