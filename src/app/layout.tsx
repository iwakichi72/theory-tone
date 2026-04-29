import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "TheoryTone - 音で学ぶ音楽理論",
  description:
    "スケール・コード・コード進行を実際に鳴らして鍵盤で確認できるインタラクティブな音楽理論学習ツール。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
