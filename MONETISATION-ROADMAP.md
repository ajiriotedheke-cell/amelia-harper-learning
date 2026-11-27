# Amelia Harper Kids — Monetisation Roadmap

## Approved business direction
Balanced revenue model:
- Google AdSense, only on eligible pages after approval and compliance review.
- Digital products for parents and caregivers.
- YouTube revenue, subject to YouTube Partner Program eligibility and Made for Kids rules.
- Parent memberships and educational partnerships as later phases.

Initial advertising placement preference: parent-focused pages only. Do not place ad units in games, near game controls, within audio playback, or beside video player controls.

## Audience and content treatment
Amelia Harper Kids explicitly serves children aged 2–12 as well as parents and caregivers. Children's areas must continue to be treated as child-directed where applicable. Do not relabel children's content as adult content to obtain personalised ads. Parent pages must be genuinely written for adults and must not be a pretext for collecting children's data or targeting children with ads.

Google policy references:
- COPPA publisher requirements: https://support.google.com/publisherpolicies/answer/10436800
- Child-directed designation tools: https://support.google.com/policies/answer/9664901
- Publisher policies: https://support.google.com/adsense/answer/10502938

## Implemented in this release
- Added `parent-learning-centre.html` with practical age-banded activity ideas for ages 2–4, 5–7, 8–10 and 11–12.
- Added `about.html` explaining the platform, its content areas and parent/caregiver role.
- Added links to the Parent Learning Centre and About page from the homepage and resources page.
- Added both pages to `sitemap.xml`.
- Expanded the resources page with an adult-focused link to the Parent Learning Centre.
- No advertising code, ad tags, tracking pixels, ad network SDKs or behavioural profiling have been added.

## Product priorities
1. Expand the existing alphabet and numbers workbook catalogue.
2. Develop original printable colouring pages and activity packs by age band.
3. Create original bedtime story collections and parent-facing story discussion prompts.
4. Develop themed activity bundles that combine printable work with the existing games and stories.
5. Clearly identify the buyer as the parent/caregiver and disclose the third-party checkout provider (Gumroad).

Only advertise or sell products that are actually available. Do not show placeholder checkout links for products not yet created.

## AdSense readiness gates — not yet complete
- Replace the current privacy draft only after confirming the legal operator name, public privacy contact, hosting and analytics data flows, retention periods, third-party services and applicable rights/consent process.
- Publish a working parent contact channel. Do not invent a contact email or operator identity.
- Audit all pages and third-party embeds, including YouTube, Gumroad, Cloudflare and analytics.
- Verify site ownership in Google Search Console and submit the sitemap.
- Review child-directed designation requirements in Search Console and apply the correct treatment to relevant child-directed sections/site.
- Apply for AdSense only after the site is complete and policy review has been performed.
- If approved, begin with conservative placements on genuinely parent-focused pages, with generous spacing from navigation, downloads and purchase links.
- Check the ad-to-content ratio and accidental-click risks on desktop and mobile.
- Review country-specific privacy and consent requirements for the actual visitor markets.

## Technical and operational safeguards
- No personalised advertising or remarketing based on activity on child-directed pages.
- No ad placement within games, near interactive controls, during story playback or over video controls.
- No collection of children's names, email addresses, precise location, or persistent player profiles for advertising.
- No newsletter signup until a provider, adult-facing consent flow, unsubscribe mechanism and privacy disclosures are implemented.
- Memberships require a payment provider, server-side entitlement checks and a parent-focused account flow. A front-end-only paywall is not sufficient.
- Sponsorships and affiliate links must be clearly disclosed to parents and must not encourage children to buy or pressure adults to purchase.

## Release verification
After Cloudflare Pages deploys the GitHub `main` branch:
- Check `/parent-learning-centre.html`
- Check `/about.html`
- Check `/resources.html`
- Check `/sitemap.xml`
- Check mobile navigation and external Gumroad links
- Confirm no ad code has been introduced before approval
