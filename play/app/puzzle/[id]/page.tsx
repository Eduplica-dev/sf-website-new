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
  const card = shareImageUrl(id, query.img);
  // The app uploads the share card's 1080 x 800 preview band (LAB
  // `7010:30272`); links without one fall back to the 1200 x 630 default.
  const image = card
    ? { url: card, width: 1080, height: 800 }
    : { url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 };

  // As the WhatsApp mock writes it (`7010:30258`): "Puzzle ID #Jp2n9A ·
  // Score 1500 · Time 23:20".
  const description = [
    `Puzzle ID #${id}`,
    score != null ? `Score ${score}` : null,
    time != null ? `Time ${formatTime(time)}` : null,
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
      images: [{ ...image, alt: "The shared puzzle" }],
    },
    twitter: {
      card: "summary_large_image",
      title: SHARE_HEADLINE,
      description,
      images: [image.url],
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
