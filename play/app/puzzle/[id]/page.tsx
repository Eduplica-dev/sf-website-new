import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StoreRedirect from "./store-redirect";
import CopyId from "./copy-id";
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  PUZZLE_ID_RE,
  SHARE_HEADLINE,
  SITE_URL,
  formatTime,
  shareImageUrl,
  wholeNumber,
} from "../../../lib/share";

type SearchParams = Record<string, string | string[] | undefined>;
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
};

/**
 * What chat apps show for the link. WhatsApp, iMessage and the rest read this
 * page behind the scenes (they do not run its script), so the preview is the
 * card picture the sharer's phone uploaded, the doc's line as the title, and
 * the result as the text.
 */
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!PUZZLE_ID_RE.test(id)) return { title: "Sudoku Carve" };
  const query = await searchParams;
  const score = wholeNumber(query.score);
  const time = wholeNumber(query.time);
  const image = shareImageUrl(id, query.img) ?? `${SITE_URL}/og-default.png`;

  const description = [
    score != null ? `Score ${score.toLocaleString("en-US")}` : null,
    time != null ? `Time ${formatTime(time)}` : null,
    `Puzzle ID ${id}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    title: SHARE_HEADLINE,
    description,
    openGraph: {
      title: SHARE_HEADLINE,
      description,
      url: `${SITE_URL}/puzzle/${id}`,
      siteName: "Sudoku Carve",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: "The shared puzzle" }],
    },
    twitter: {
      card: "summary_large_image",
      title: SHARE_HEADLINE,
      description,
      images: [image],
    },
  };
}

/**
 * Only a computer (or a phone whose redirect failed) ever sees this: the
 * Puzzle ID to open with Play by ID, and the two stores.
 */
export default async function PuzzlePage({ params, searchParams }: Props) {
  const { id } = await params;
  if (!PUZZLE_ID_RE.test(id)) notFound();
  const query = await searchParams;
  const score = wholeNumber(query.score);
  const time = wholeNumber(query.time);
  const appQuery = new URLSearchParams();
  if (score != null) appQuery.set("score", String(score));
  if (time != null) appQuery.set("time", String(time));
  const appPath = `puzzle/${id}${appQuery.size ? `?${appQuery}` : ""}`;

  return (
    <main style={styles.main}>
      <StoreRedirect path={appPath} />
      <p style={styles.brand}>Sudoku Carve</p>
      <h1 style={styles.headline}>{SHARE_HEADLINE}</h1>
      <p style={styles.id}>
        Puzzle ID <strong style={styles.idValue}>{id}</strong>
        <CopyId id={id} />
      </p>
      <p style={styles.hint}>
        Get the game, then open Classic and choose Play by ID.
      </p>
      <div style={styles.stores}>
        <a style={styles.store} href={APP_STORE_URL}>
          App Store
        </a>
        <a style={styles.store} href={PLAY_STORE_URL}>
          Google Play
        </a>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 420,
    margin: "0 auto",
    padding: "64px 24px",
    textAlign: "center",
  },
  brand: { margin: 0, fontWeight: 700, color: "#5C489D" },
  headline: { fontSize: 24, lineHeight: 1.3, margin: "16px 0 24px" },
  id: { fontSize: 16, margin: 0 },
  idValue: { color: "#5C489D", userSelect: "all" },
  hint: { fontSize: 14, color: "#575757", margin: "8px 0 32px" },
  stores: { display: "flex", gap: 12, justifyContent: "center" },
  store: {
    padding: "12px 20px",
    borderRadius: 10,
    background: "#5C489D",
    color: "#FFFFFF",
    fontWeight: 600,
    textDecoration: "none",
  },
};
