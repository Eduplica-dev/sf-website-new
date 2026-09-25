/**
 * What a shared puzzle link knows. Kept in step with the app's
 * services/shareService.ts and utils/puzzleInvite.ts (se-master).
 */

export const SITE_URL = "https://play.eduplica.com";

/** The doc's line G, word for word - the preview's title. */
export const SHARE_HEADLINE = "I solved an interesting puzzle, wanna try it?";

export const APP_STORE_URL = "https://apps.apple.com/app/id6761488124";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.Eduplica.SudokuForge";

/** app.json `android.package` and `scheme`. */
export const ANDROID_PACKAGE = "com.Eduplica.SudokuForge";
export const APP_SCHEME = "sudokuforge";

/** The server's puzzle ids: 6-8 letters and digits. */
export const PUZZLE_ID_RE = /^[A-Za-z0-9]{6,8}$/;

/**
 * Where the server keeps the share cards (SF-Backend src/utils/s3.ts): the
 * bucket's own address, unless the backend is set to hand out a CDN address,
 * in which case set SHARE_IMAGE_BASE to that CDN's base on Vercel.
 */
const IMAGE_BASE = (
  process.env.SHARE_IMAGE_BASE ??
  "https://sudokuevo-share-images.s3.eu-north-1.amazonaws.com"
).replace(/\/$/, "");

type QueryValue = string | string[] | undefined;
const first = (value: QueryValue) => (Array.isArray(value) ? value[0] : value);

export function wholeNumber(value: QueryValue): number | null {
  const raw = first(value);
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

/** The card picture for this puzzle's upload stamp, or null. Never a free URL. */
export function shareImageUrl(puzzleId: string, stamp: QueryValue): string | null {
  const value = first(stamp);
  if (!value || !/^\d{10,16}$/.test(value)) return null;
  return `${IMAGE_BASE}/share-images/${puzzleId}-${value}.png`;
}

/** "23:20", or "1:05:09" past an hour - the same as the app's share card. */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
