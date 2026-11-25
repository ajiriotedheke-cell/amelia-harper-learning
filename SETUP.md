# Amelia Harper Kids — website setup and launch notes

A responsive Cloudflare Pages website starter with the approved brand sections, one working ABC game using the 500-question bank, the existing Tumi and the Little Star audio story, an admin settings interface, Cloudflare D1 schema and a privacy-conscious aggregate game-event endpoint.

## What is included

- Premium colourful 3D-inspired brand layout, mobile responsive.
- Home sections: Games, Audio Bedtime Stories, Good Manners Songs, Sweet Bedtime Moments, Learning Resources and Parents & Community.
- Dedicated games, stories, songs and resources browsing pages. The game library supports search, age-band and category filters.
- Social destinations are editable in `/admin/` (Facebook, YouTube, TikTok, Gumroad).
- Sweet Bedtime Moments Gumroad URL, description, button label and publish toggle are editable.
- One ABC Letter Adventure game backed by 500 question records. The bank is structurally checked, but still requires human educational review and supervised playtesting before commercial release.
- Existing Tumi and the Little Star audio file included locally.
- Cloudflare Pages Functions for public settings and admin settings, plus a simple aggregate game event endpoint.

## Important implementation boundaries

This is a Phase 1 starter, not a live deployed website. Admin settings require Cloudflare D1 and Cloudflare Access setup before they can be saved securely. Membership checkout, newsletter provider, upload manager, full analytics reporting dashboard, additional games and YouTube Playables packaging are not yet implemented. The public settings page has safe defaults until D1 is connected.

The event endpoint stores only game slug, event type, coarse age band, device category, country code and timestamp. It does not collect player names, email addresses, precise location or persistent player IDs. Before release, add rate limiting, retention/deletion rules, parental notices/consent as legally required, and verify that analytics practices comply with the laws in each target market. Do not use this external event endpoint in a YouTube Playables build; use YouTube's permitted SDK/reporting path for that separate build.

## Deploy to Cloudflare Pages

1. Upload the contents of this folder to the root of the GitHub repository (not the ZIP file itself).
2. In Cloudflare, create a Pages project connected to that repository.
3. Framework preset: **None**. Build command: leave blank. Build output directory: `.`. Production branch: `main`.
4. Add a D1 database named `amelia-harper-db`.
5. Run `schema.sql` against that D1 database.
6. In Pages → Settings → Functions, bind the D1 database using binding name `DB`.
7. Add environment variable `ADMIN_EMAIL` with the administrator email address.
8. Configure Cloudflare Access to protect `https://YOUR-DOMAIN/admin/*` and `https://YOUR-DOMAIN/api/admin/*`, allowing only your administrator email. The Pages Function also checks the Access-injected `Cf-Access-Authenticated-User-Email` header against `ADMIN_EMAIL`.
9. Test `/api/config`, `/admin/`, saving a temporary social URL, and confirming the public site reflects it. Remove the test URL afterwards.
10. Connect the custom domain `ameliaharperkids.com` after the Pages project is deployed.

## Add new games

Create a folder under `/games/<game-slug>/` with its own `index.html`, assets and JavaScript. Add the game card to the home page or, in the next phase, move the cards to a managed game catalogue. Use the event endpoint with allowed event names: `game_start`, `game_complete`, `level_complete`, `replay`, `game_error`.

## Current known gaps before production

- Admin content upload (audio/images/game bundles) needs an authenticated upload workflow and object storage such as Cloudflare R2.
- Paid memberships need a payment provider, webhook verification, parent account system and entitlement checks. Do not treat a front-end toggle as access control.
- The full admin analytics dashboard and aggregation/report queries need to be built.
- Parent newsletter requires a chosen email service and verified consent workflow.
- Privacy policy needs legal review for target countries and child-directed services.
- Accessibility, performance, browser/device testing, audio rights checks and child playtesting are required before public launch.
- The YouTube Playables version must be a separate build using the current Playables SDK and rules; external analytics requests are not used in that build.

## Game catalogue structure

`game-library.json` is the initial modular catalogue. Each game has its own folder and URL. The public `/games/` page reads the catalogue and filters games by age group. Add a new game by creating a new `/games/<slug>/` folder and adding a catalogue record with its title, description, age bands, path, category, status and icon. In this first release the catalogue is edited in GitHub; an authenticated in-dashboard game publisher is a later phase.


## Current development branch work

The current development branch adds the searchable game library, dedicated story/song/resource pages, improved mobile navigation, accessibility and progress feedback, parent-facing privacy draft, and corrected analytics event payloads. These changes are in a draft pull request and are not yet merged into the production branch.

## Known content gaps found during review

- The question bank contains 500 records with unique IDs and four answer choices per question. Its age labels extend only to 8 years; there are no 11–12 age questions. The game now shows a coming-soon message rather than serving unrelated questions for an age group with no matching content.
- The repository contains one playable bedtime audio story. The good-manners song page is a topic catalogue only; no playable song files were found.
- The picture-answer renderer supports image-based options, but dedicated 3D picture assets (including goat, hat, kite and sun) have not yet been added. Do not publish question records that reference missing image paths.
- Current PNG images are approximately 2.2–2.4 MB each and the audio story is approximately 11.2 MB. Optimise these assets and verify quality before broad international release.
- Parent membership, payment checkout, newsletter sign-up and content uploads are not implemented. They require selected providers, secure server-side integration and appropriate parental consent workflows.
