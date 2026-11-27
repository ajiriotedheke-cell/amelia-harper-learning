# Amelia Harper Kids — development QA status

## Implemented on the development branch

- Homepage navigation connects to dedicated game, story, song and resource pages.
- Game library supports search, age-band filtering and category filtering. Catalogue content is inserted with DOM text nodes rather than interpolated into HTML.
- Audio story page uses the existing Tumi and the Little Star cover and MP3.
- Good-manners song page clearly labels planned themes as coming soon; no unavailable audio is presented as playable.
- Learning resources page links to the existing My Alphabet & Numbers Adventure Gumroad product.
- Parent-facing privacy and safety draft describes the event fields currently implemented and calls out outstanding legal/operational work.
- Admin-managed Sweet Bedtime Moments title, description, button label and published link are connected to the public homepage.
- Mobile navigation has expanded-state labels, closes on navigation and supports Escape on the homepage.
- ABC game age selection uses the actual select element and matches overlapping age ranges. It does not silently fall back to unrelated questions when a selected age has no suitable content.
- ABC game shows progress and answer feedback, supports text, image and emoji-only picture answer options, and sends only game start/completion analytics using the API's expected field names.
- The AH-020 goat picture question now presents four emoji-only choices (hat, kite, goat and sun), with accessible answer names.
- Seven incorrect article usages in picture-matching prompts were corrected.

## Static checks performed

- Question bank parsed as JSON and contains 500 records, 500 unique IDs, four options per question and an answer matching an option in every record.
- Age-band overlap audit found: 316 records match ages 2–4; 440 match ages 5–7; 110 match ages 8–10; zero match ages 11–12. These are overlapping counts, not additive totals.
- Catalogue and homepage copy now disclose that the ABC bank is strongest for early learners, has limited overlap for age 8, and has no 11–12 questions. Game availability is distinguished from the wider age-group roadmap.
- The question-bank record for AH-020 was checked after editing: four distinct picture options are present and the correct answer label matches one option.
- No live browser/device test has been completed in this workflow. No production deployment or merge has been performed.

## Required before production launch

1. Add and playtest age-appropriate content for ages 9–12, especially the missing 11–12 band.
2. Produce and add approved 3D picture assets for picture-answer activities; validate every referenced file path.
3. Add original good-manners and bedtime song audio, with documented music and voice rights.
4. Compress large PNG and MP3 assets, then test mobile loading on slower connections.
5. Complete and obtain legal review of the privacy notice for each intended market; add operator identity, contact channel, retention schedule and parent-rights process.
6. Confirm Cloudflare Access protects both /admin/* and /api/admin/*; verify D1 binding and administrator email.
7. Add suitable rate limiting/abuse controls and data retention/deletion automation to analytics.
8. Select and securely integrate a payment provider before introducing paid memberships or subscriptions. Do not rely on front-end-only gating.
9. Connect a newsletter provider only after consent, unsubscribe and data-handling workflows are configured.
10. Perform real browser tests at desktop, tablet and mobile sizes; test keyboard access, screen readers, audio controls, error states and all navigation links.
11. Verify external Gumroad/social links, domain DNS, Cloudflare Pages preview and production deployments.
12. Complete child-focused educational review and supervised usability testing before monetisation or broad release.

## Latest visual and navigation refinements

- Added a shared visual polish layer across the homepage, game catalogue, story, song, resource and privacy pages: softer layered backgrounds, consistent card treatments, clearer hierarchy, improved hover/focus states and responsive spacing.
- Refined homepage hero, age cards, featured game, audio player, song tiles, bedtime banner, resource card and parent section.
- Refined shared library-page hero panels and content cards for a more consistent premium feel.
- Standardised mobile menu behaviour across pages: expanded state, close after selecting a link and Escape-key support.
- Static JavaScript syntax checks passed for shared scripts and inline page scripts after these changes.
- Visual appearance has not yet been verified in a real browser at desktop/tablet/mobile breakpoints; screenshot review and device testing remain required.


## Latest content-page visual and accessibility pass

- Added dedicated page artwork to the game library, bedtime stories, good-manners songs and learning resources hero panels, reusing existing repository assets.
- Added keyboard-accessible skip-to-content links on the homepage and all content-library pages.
- Standardised mobile menu buttons as explicit non-submit buttons.
- Added responsive hero-art layout rules and visible keyboard focus treatment for the skip link.
- These changes are committed to the development branch only; browser screenshot review is still outstanding.


## Website upgrades — phase 1

- Added a branded, responsive 404 page with clear routes back to the homepage and game library.
- Added `robots.txt` to keep administrator and administrator API paths out of crawler discovery while allowing public pages.
- Added an XML sitemap for public pages and both playable games.
- Added canonical URLs, Open Graph metadata and social sharing metadata to the homepage and public library, privacy and game pages.
- Added skip-to-content links to the privacy page and ABC game page.
- Added Magical Memory Match as a second playable game. It scales from 3 pairs for ages 2–4 to 10 pairs for ages 11–12, includes keyboard-operable buttons and live status messages, and sends only the existing aggregate game event types.
- Featured Magical Memory Match on the homepage and published it in the game catalogue for all four age bands.
- Static checks confirmed the new game is present in the catalogue, its published route is configured, the homepage links to it, and the sitemap and crawler rules include the intended routes.

### Still required

- Run browser tests for the new game and all navigation at desktop, tablet and mobile sizes.
- Review memory-game difficulty with educators/parents and supervise child usability testing.
- Confirm sitemap and 404 behaviour on the live Cloudflare Pages deployment.
- Continue with the admin content-management upgrade, story/song library management, media optimisation and privacy/accessibility review.
- No production deployment has been confirmed in this phase.


## YouTube video library — implementation notes

- Added an administrator textarea that accepts one `Video title | YouTube URL` entry per line.
- Client-side validation accepts standard YouTube watch, short-link, Shorts, embed and live-video URL formats and extracts the 11-character video ID.
- The admin API validates titles, IDs and a maximum of 30 videos before storing the list in the existing D1 `site_settings` table.
- Added `/videos.html`, which reads the public settings endpoint and renders a responsive video collection.
- The video page uses standard YouTube embeds (`youtube.com/embed`) rather than privacy-enhanced `youtube-nocookie.com` embeds, and does not configure autoplay. The iframe is only inserted after the visitor selects the load-player control; the visitor then presses Play inside YouTube.
- Added a parent-facing note that playback is served by YouTube.
- Added the video page to homepage navigation and the XML sitemap.
- Confirmed the video page, homepage, sitemap and robots file use the custom domain `amelia-harperkids.com`.

### Outstanding YouTube setup and verification

- The video library will remain empty until the administrator adds actual video titles and links after Cloudflare Access and D1 are working.
- The website owner must designate the site as child-directed through Google's applicable site tools. Each relevant YouTube upload/channel must also be accurately designated Made for Kids in YouTube Studio.
- Actual view counts are controlled by YouTube's validation systems. No autoplay is configured because YouTube says autoplayed embedded videos do not increment views.
- Test a real video on the deployed website, then verify playback and traffic in YouTube Studio Analytics. This repository change does not prove a view has been counted.
- Review the privacy notice for third-party YouTube player data collection and applicable child privacy requirements.


## Adventure Universe and 3D visual direction

- Added the Adventure Universe hub with a layered fantasy-galaxy scene, floating planets, animated star effects and six themed destination worlds.
- Added a simple five-star collection interaction with accessible buttons and live status feedback; no personal data or child-level profile is collected.
- Added Adventure Universe to the published game catalogue and homepage, with links to the existing ABC and memory games.
- Upgraded the ABC quiz and Magical Memory Match presentation with richer layered gradients, depth, raised controls, shadows and motion-aware styling.
- Updated the game catalogue with a direct Adventure Universe entry point and more dimensional card treatments.
- These are CSS-based 3D-inspired visual treatments rather than a full WebGL 3D engine. Real device/browser visual testing, performance checks and supervised child playtesting are still required.


## Rainbow Runway — first playable Adventure Universe world

- Built `/games/rainbow-runway/` as a self-contained canvas runner with a perspective rainbow runway, layered sky, floating islands, clouds, stars, animated player character and particle effects.
- Added lane movement, jumping, star collection, cloud-bump collisions, hearts/lives, distance, score, best-run storage, pause, restart and end-of-run summary.
- Added keyboard and touch controls, responsive canvas sizing, reduced-motion handling, visibility-change pause, age-level settings for ages 2–4, 5–7, 8–10 and 11–12, and a short on-screen control guide.
- Game analytics sends only aggregate start/completion events with the existing event API fields; no child identity or per-action answer data is sent.
- Added Rainbow Runway to the published catalogue and XML sitemap.
- Static code review and route/catalogue checks are required before release. Real browser/device testing, playtesting with parents/educators, performance/accessibility review and tuning of difficulty/collision behaviour remain outstanding.
