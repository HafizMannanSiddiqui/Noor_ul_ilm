"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TabIcons } from "./Icons";

type Tab = { href: string; label: string; icon: keyof typeof TabIcons };

/** App-style bottom navigation on phones. */
export default function TabBar({ tabs, home }: { tabs: Tab[]; home: string }) {
  const pathname = usePathname() || home;
  return (
    <nav className="tabbar" aria-label="Quick navigation">
      {tabs.map((t) => {
        const active = t.href === home ? pathname === home : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} aria-current={active ? "page" : undefined}>
            {TabIcons[t.icon]}
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
