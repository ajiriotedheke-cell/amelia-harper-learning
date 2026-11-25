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
- ABC game shows progress and answer feedback, supports text and image answer options, and sends only game start/completion analytics using the API's expected field names.
- Seven incorrect article usages in picture-matching prompts were corrected.

## Static checks performed

- Question bank parsed as JSON and contains 500 records, 500 unique IDs, four options per question and an answer matching an option in every record.
- Age-band overlap audit found: 316 records match ages 2–4; 440 match ages 5–7; 110 match ages 8–10; zero match ages 11–12. These are overlapping counts, not additive totals.
- Catalogue and homepage copy now disclose that the ABC bank is strongest for early learners, has limited overlap for age 8, and has no 11–12 questions. Game availability is distinguished from the wider age-group roadmap.
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
