/** Show posts that are not yet scholar-approved, with a "Draft" label. On unless SHOW_DRAFTS="false". */
export const SHOW_DRAFTS = process.env.SHOW_DRAFTS !== "false";
export const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
