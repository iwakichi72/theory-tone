"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "ホーム" },
  { href: "/lessons", label: "レッスン" },
  { href: "/progressions", label: "進行プレイヤー" },
  { href: "/analyze", label: "録音解析" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-edge/70 bg-bg-base/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-accent to-accent-cool text-sm font-bold text-bg-base">
            T
          </span>
          <span className="font-semibold tracking-tight">TheoryTone</span>
          <span className="hidden text-xs text-white/40 sm:inline">
            音で学ぶ音楽理論
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1.5 transition ${
                  isActive
                    ? "bg-bg-elevated text-white"
                    : "text-white/60 hover:bg-bg-surface hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
