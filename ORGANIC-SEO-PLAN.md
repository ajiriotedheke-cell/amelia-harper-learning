# Amelia Harper Kids — Organic Search & Discovery Plan

## Implemented on the website

- Created a Parent Learning Centre article hub at `/parent-learning-centre/`.
- Published five original parent-facing guides: alphabet activities for ages 5–7; calm bedtime routines; sharing and kindness for preschoolers; balanced screen time; dinosaur learning activities.
- Added internal links from guides to relevant games, stories and resources.
- Expanded the Tumi and the Little Star page with a story description and parent discussion prompts. A transcript was not fabricated because the source story script was not present in the reviewed site files.
- Confirmed that the MP3 asset exists in the repository (about 11.2 MB) and changed the audio element to `preload="metadata"`. Actual browser playback still needs testing on the live site.
- Added parent-oriented explanatory content to the seven published game pages.
- Standardised parent-facing navigation/footer links on the main content, story, song, resource and game-library pages.
- Improved homepage navigation labels, removed the roadmap sentence from the hero and replaced the inactive newsletter prompt with a link to existing parent guides.
- Added all new guide URLs to `sitemap.xml`. Existing `robots.txt` already allows public crawling and points to the sitemap.

## Search themes to build around

1. Early literacy and alphabet activities.
2. Family routines, bedtime and shared reading.
3. Kindness, sharing and social learning.
4. Balanced screen use and choosing learning games.
5. Printable learning activities and workbooks.
6. Dinosaur, ocean and creative discovery activities.

## Google Search Console checklist

1. Verify the domain property for `ameliaharperkids.com`.
2. Submit `https://ameliaharperkids.com/sitemap.xml`.
3. Inspect the homepage, game library, each new article and the story page.
4. Check indexing status, canonical selection, mobile usability and page experience.
5. Review the Search results report every 2–4 weeks. Prioritise pages with impressions but low click-through rate and queries that already show traction.
6. Request indexing only for materially new or corrected URLs; do not repeatedly submit unchanged pages.

## YouTube and Pinterest distribution workflow

- For each published song or story video, write a descriptive parent-facing title and description, include the matching site page near the top, and use the platform's correct audience designation. Do not label child-directed material as made for adults to pursue reach.
- Create a vertical Pinterest creative for each genuinely available printable, parent guide or story. Use a clear benefit-led title, concise description and direct destination URL. Do not advertise a free download unless a free file is actually available.
- Link pins to the exact relevant page, not only the homepage. Check the destination on mobile before publishing.
- Use only original or properly licensed images, music, video and artwork.

## Editorial quality rules

- Publish helpful, original material rather than pages created only to target keywords.
- Keep article titles descriptive and natural; do not promise outcomes that the content cannot support.
- Add full story transcripts only from approved source scripts. Add song lyrics only when the corresponding released song and authorised lyrics exist.
- Keep planned song themes clearly identified as planned until playable tracks are published.
- Do not invent author qualifications, testimonials, product availability, learning outcomes or medical claims.
- Update pages when a game, product, link or media asset changes.

## Technical work still requiring a separate verification pass

- Test every page and internal link on the production domain after Cloudflare Pages deploys.
- Test the MP3 player in current desktop and mobile browsers; a file being present in GitHub does not prove it streams successfully from production.
- Run PageSpeed Insights / Lighthouse on the homepage, article hub and representative game pages. Record Core Web Vitals before changing assets or scripts.
- Consider image conversion to WebP/AVIF after comparing visual quality and confirming the deployment supports the generated files. This repository update did not rewrite binary image assets.
- Profile the 3D games on mobile before changing their Three.js loading strategy; the interactive code was not rewritten in this SEO pass.
- Verify canonical URLs, sitemap responses, HTTPS, redirects and indexability after deployment.

## Measurement

Track organic impressions, clicks, click-through rate and average position in Search Console by page and query. Use aggregate site analytics only after reviewing the actual privacy, consent and child-directed requirements. Do not add analytics solely because an SEO checklist says it is mandatory; it is not a Google ranking prerequisite.

## Advertising and child-directed safeguards

No AdSense code, advertising SDK, new tracking pixel or behavioural advertising feature was added in this work. The site is child-directed and should be treated accordingly. Any future advertising must follow applicable law and the ad provider's child-directed policies, and the privacy notice must describe the actual implementation before ads are activated.
