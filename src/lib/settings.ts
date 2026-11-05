/** Show not-yet-approved posts/texts (with a Draft warning). Set SHOW_DRAFTS="false" before launch. */
export const SHOW_DRAFTS = process.env.SHOW_DRAFTS === "true";
export const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
