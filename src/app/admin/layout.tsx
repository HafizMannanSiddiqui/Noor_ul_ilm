import "./admin.css";
import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";

export const metadata: Metadata = { title: { default: "Admin — Noor-ul-Ilm", template: "%s — Admin" }, robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
