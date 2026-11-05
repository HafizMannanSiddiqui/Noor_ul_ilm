import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { LANGS } from "@/lib/lang";
import { SITE_URL } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/posts", "/sisters", "/youth", "/events", "/join", "/donate", "/contact"];
  const posts = await db.post.findMany({ where: { status: "APPROVED" }, select: { slug: true, updatedAt: true } });
  return [
    ...LANGS.flatMap((l) => pages.map((p) => ({ url: `${SITE_URL}/${l}${p}`, changeFrequency: "weekly" as const }))),
    ...LANGS.flatMap((l) => posts.map((p) => ({ url: `${SITE_URL}/${l}/posts/${p.slug}`, lastModified: p.updatedAt }))),
  ];
}
