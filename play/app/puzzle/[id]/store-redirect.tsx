"use client";

import { useEffect } from "react";
import {
  ANDROID_PACKAGE,
  APP_SCHEME,
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "../../../lib/share";

/**
 * On a phone this page should not stay on screen.
 *
 * With the game installed the phone normally never loads it: the link opens
 * the game directly (iOS universal link, Android app link). It only gets here
 * when that did not happen - the game is missing, or an in-app browser kept
 * the link to itself:
 *  - Android: an intent link opens the game if it is installed and Google Play
 *    if not, in one step.
 *  - iPhone / iPad: straight to the App Store. (Trying the game's own address
 *    first would show Safari's "cannot open" error to everyone without it.)
 * A computer stays on the page, which offers both stores.
 */
export default function StoreRedirect({ path }: { path: string }) {
  useEffect(() => {
    const ua = navigator.userAgent;
    const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    if (/android/i.test(ua)) {
      window.location.replace(
        `intent://${path}#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};` +
          `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`,
      );
    } else if (/iphone|ipad|ipod/i.test(ua) || iPadOS) {
      window.location.replace(APP_STORE_URL);
    }
  }, [path]);
  return null;
}
