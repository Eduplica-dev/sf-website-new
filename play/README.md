# play.eduplica.com

Where Sudoku Carve's shared puzzle links land:
`https://play.eduplica.com/puzzle/<id>?score=..&time=..&img=..`

Nobody is meant to look at this site.

- **Phone with the game:** the link opens the game directly (iOS universal link / Android app link), and the home screen offers the puzzle. The page never loads.
- **Chat apps (WhatsApp, iMessage…):** they read the page behind the scenes for the link preview: the share card picture, the title "I solved an interesting puzzle, wanna try it?", and the score, time and Puzzle ID.
- **Phone without the game:** the page sends it straight to the App Store / Google Play.
- **Computer:** a small page with the Puzzle ID (with a Copy button) and both stores.

The two files in `public/.well-known/` are how iOS and Android know these links belong to the game.

## Deploy (Vercel)

1. On Vercel, point a project at this repository with **Root Directory `play`**. The old `sudoku-forge` project can be reused.
2. Add the domain **play.eduplica.com** to that project.
3. In GoDaddy (DNS for eduplica.com), add a **CNAME** record: name `play`, value `cname.vercel-dns.com`.
4. `public/.well-known/assetlinks.json` holds the SHA-256 of the app signing key (filled 25 Sep 2026). It lives in Play Console → **Protected with Play** → Play Store protection → Play App Signing → **App signing key certificate** (App integrity moved there in 2026). Update the file if that key ever changes.
5. Optional: if the backend serves share cards from a CDN (`SHARE_IMAGES_CDN_BASE_URL`), set `SHARE_IMAGE_BASE` to the same base on Vercel.

## Check after deploying

- `https://play.eduplica.com/.well-known/apple-app-site-association` → JSON, no redirect
- `https://play.eduplica.com/.well-known/assetlinks.json` → JSON with the real fingerprint
- Google's checker: `https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://play.eduplica.com&relation=delegate_permission/common.handle_all_urls`

The app only opens these links from the build that lists `play.eduplica.com` (se-master `app.json`, the next native build).
