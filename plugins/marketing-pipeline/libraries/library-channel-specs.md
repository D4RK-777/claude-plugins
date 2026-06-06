# Library: Channel Specs
> The platform-specs ground truth. Every paid channel constrains what creative you can ship — character limits, image dimensions, video durations, aspect ratios, format rules. This library is the reference every creative-producing skill (`hook-creative-generator`, `lp-copy-generator`, `email-sequence`, `cinematic-prompt-architect`, `creative-interrogator`) consults before declaring an asset shippable. Coverage v1: Meta (Facebook + Instagram), Google Ads (Search + PMax + Display), LinkedIn, TikTok Ads. v2 will add X, YouTube, Email, organic social.

> **Specs current as of:** 2026-05-25. Platforms change spec rules quarterly. The `RECHECK?` note next to volatile fields flags items to re-verify before each major campaign. Truth-check against each platform's official ads documentation if a spec violation is suspected.

---

## HOW TO USE THIS LIBRARY

Every creative MUST be validated against the spec for its declared placement BEFORE it ships. Producing 1280-character ad copy for Meta primary text (which truncates at 125 characters in mobile feed) is a guaranteed underperformer regardless of how good the writing is.

`creative-interrogator` Phase 7 (channel-fit) consults this library directly. `hook-creative-generator` and `lp-copy-generator` should self-check during generation.

---

## META (FACEBOOK + INSTAGRAM)

### COPY LENGTH LIMITS

| Field | Hard cap | Mobile truncation | Best-practice target |
|-------|----------|-------------------|----------------------|
| Primary Text | 63,206 chars | ~125 chars before "...See more" | 90–120 chars |
| Headline | 255 chars | ~40 chars (mobile feed) | 25–40 chars |
| Description | 30 chars (feed) / 30 chars (link descr) | full | 25–30 chars |
| Display URL | n/a | shown stripped | use root domain |

**The 125-char rule:** Most Meta mobile viewers only see the first 125 chars before the "See more" cutoff. Lead with the hook in those 125 chars. CTA optional in the primary text (the button does that job).

### IMAGE / STATIC AD SPECS

| Placement | Aspect ratio | Pixel size (min recommended) | File type | Max file size | Text-in-image limit |
|-----------|--------------|------------------------------|-----------|---------------|---------------------|
| Feed (FB + IG) | 1:1 square | 1080 × 1080 | JPG, PNG | 30 MB | No hard limit (20% rule retired) but >20% text reduces reach |
| Story / Reel cover | 9:16 vertical | 1080 × 1920 | JPG, PNG | 30 MB | Keep clear safe zones — top 250px and bottom 250px |
| Right column (FB desktop) | 1.91:1 horiz | 1200 × 628 | JPG, PNG | 30 MB | minimal — small placement |

**Safe zone for vertical placements:** Story/Reel UI overlays the top ~250px and bottom ~250px on a 1920px-tall asset. Keep critical text + product OUT of those zones.

### VIDEO AD SPECS

| Placement | Aspect ratio | Duration | Pixel size | File type | Max file size |
|-----------|--------------|----------|------------|-----------|---------------|
| Feed video | 1:1, 4:5, or 9:16 | 1s–241 mins (1m+ recommended) | 1080×1080+ | MP4, MOV | 4 GB |
| Reels | 9:16 only | 0–90s (15s sweet spot) | 1080×1920 | MP4, MOV | 4 GB |
| Story | 9:16 | 0–60s (15s sweet spot) | 1080×1920 | MP4, MOV | 4 GB |
| In-stream | 16:9 horizontal | 5s–10 mins | 1080×1080 min | MP4 | 4 GB |

**Sound-off rule:** Caption all video. ~85% of Meta video is watched without sound. No captions = no signal.

### FORMAT-SPECIFIC NOTES

- **Carousel:** 2–10 cards. Each card has its own headline (40 chars) + description (20 chars). One primary text shared across the carousel (125-char target).
- **Collection:** Cover image/video + 4 product tiles minimum. Mobile-only.
- **Dynamic Product Ads:** Specs match catalogue feed; copy is templated with {{product.name}} variables.
- **Lead Forms (Instant Forms):** Up to 21 questions. Short forms (≤4 fields) outperform long ones by 30–50% CVR.

### ADVANTAGE+ NOTES

- Advantage+ Shopping Campaigns auto-mix placements and creative variants. Provide 1:1, 4:5, AND 9:16 sized versions of each creative for full eligibility.
- Advantage+ Audience: Meta picks the audience but you can seed it with interest/lookalike inputs as "suggestions" — Meta now treats those as priors, not constraints.

---

## GOOGLE ADS

### RESPONSIVE SEARCH ADS (RSA)

| Field | Hard cap | Required count | Best-practice |
|-------|----------|----------------|----------------|
| Headlines | 30 chars each | 3 min, 15 max | 10–15 for full asset rotation |
| Descriptions | 90 chars each | 2 min, 4 max | All 4 used |
| Path 1 / Path 2 | 15 chars each | optional | use to reinforce keyword intent |
| Display URL | derived from final URL | n/a | n/a |

**Headline pinning:** You CAN pin specific headlines to positions 1, 2, or 3, but doing so reduces RSA performance ~5–15% in most accounts. Only pin a brand/legal-required headline. Let Google rotate the rest.

**Asset ratings (Optimization Score):** Google rates each asset (headline/description) "Poor / Low / Good / Best." Replace Poor and Low assets before launching.

### PERFORMANCE MAX (PMAX)

| Asset type | Required count | Cap | Spec |
|------------|----------------|-----|------|
| Logos | 1 min | 5 | 1:1 square (1200×1200), 4:1 horizontal (1200×300) |
| Images | 1 min | 20 | 1.91:1 (1200×628), 1:1 (1200×1200), 9:16 (960×1200) — all three recommended for full coverage |
| Videos | 0 min, 1+ recommended | 5 | 10s–30s, 16:9, 9:16, or 1:1 |
| Headlines | 5 (short, 30 chars) | 15 short / 5 long (90 chars) | mix |
| Descriptions | 4 | 5 | 90 chars |
| Long headline | 1 | 5 | 90 chars |
| Business name | 1 | n/a | 25 chars |

**PMax requires video.** If you don't provide one, Google auto-generates one from your images — invariably ugly. Always supply at least one branded video.

### DISPLAY NETWORK

| Asset | Spec | Notes |
|-------|------|-------|
| Square image | 1:1, 1200×1200 | required |
| Landscape | 1.91:1, 1200×628 | required |
| Portrait | 4:5, 960×1200 | recommended |
| Logo | 1:1, 1200×1200 + 4:1, 1200×300 | both |
| Headlines | 30 chars × 5 short | mix |
| Descriptions | 90 chars × 5 | required |

### YOUTUBE ADS (Google-owned, summarised here)

| Format | Duration | Aspect | Skip behavior |
|--------|----------|--------|----------------|
| Skippable in-stream | 12s–6+ mins (15–60s sweet) | 16:9 | Skip after 5s |
| Non-skippable | 6s, 15s, 20s | 16:9 | No skip |
| Bumper | 6s max | 16:9 | No skip |
| Shorts | 0–60s | 9:16 | Native scroll |

(Full YouTube ad library coming in v2.)

---

## LINKEDIN

### SPONSORED CONTENT (single-image, video, carousel, document)

| Field | Hard cap | Best-practice |
|-------|----------|----------------|
| Introductory text | 600 chars | 150 chars before "...see more" cutoff |
| Headline | 200 chars | 70 chars (full visibility on desktop) |
| Image / Video description | varies | n/a |

### IMAGE SPECS

| Placement | Aspect | Pixel size | File |
|-----------|--------|------------|------|
| Single image | 1.91:1 horiz OR 1:1 square | 1200×628 OR 1200×1200 | JPG/PNG, max 5 MB |
| Carousel image | 1:1 | 1080×1080 | JPG/PNG, 2–10 cards |

### VIDEO SPECS

| Field | Spec |
|-------|------|
| Aspect ratio | 1:1, 4:5, 9:16, or 16:9 |
| Duration | 3s–30 mins (15s–30s sweet for sponsored) |
| File type | MP4 |
| Max size | 500 MB |
| Frame rate | 30 fps max |
| Captions | Required (sound-off behaviour even higher than Meta on LinkedIn) |

### TEXT ADS (right rail)

| Field | Hard cap |
|-------|----------|
| Headline | 25 chars |
| Description | 75 chars |
| Image | 100×100 |

### MESSAGE / CONVERSATION ADS

| Field | Hard cap | Best-practice |
|-------|----------|----------------|
| Subject (Message Ads) | 60 chars | 30–40 chars (mobile preview cutoff) |
| Message body | 1,500 chars | <500 chars |
| CTA button | 25 chars | Verb-led |
| Custom Terms (legal block) | required | n/a |

**Inbox fatigue rule:** LinkedIn cap of 1 sponsored message per member per 45 days. Sequence carefully.

### LEAD GEN FORMS

- Up to 12 fields. ≤4 fields = 30% higher CVR than 5+ fields.
- Pre-fill from LinkedIn profile reduces friction dramatically — use it.
- Custom hidden fields can carry UTM data for attribution.

---

## TIKTOK ADS

### IN-FEED ADS (the most common format)

| Field | Spec |
|-------|------|
| Aspect ratio | 9:16 vertical (1080×1920) |
| Duration | 5s–60s (15–30s sweet spot; 9–15s for hook-heavy) |
| File type | MP4, MOV |
| Max file size | 500 MB |
| Frame rate | 23–60 fps |
| Bitrate | ≥516 kbps |
| Captions | Native TikTok captions strongly outperform burned-in captions |

### CAPTION / DESCRIPTION

| Field | Hard cap | Best-practice |
|-------|----------|----------------|
| Ad caption (description) | 100 chars | 1–2 lines (40–60 chars) — most viewers don't read past line 1 |
| CTA button text | preset options (e.g., "Shop Now", "Learn More", "Sign Up") | choose mode-matched to LP |

### SPARK ADS (boosted organic posts)

- Use an existing TikTok creator's organic post as the ad.
- Inherits the original post's engagement, comments, follows — outperforms standard in-feed for cold acquisition.
- Best practice: partner with creators in your niche, get permission, boost their best-performing posts as Spark Ads.

### TOPVIEW & BRAND TAKEOVER

| Format | Duration | Cost tier |
|--------|----------|-----------|
| TopView | up to 60s (first-impression) | premium |
| Brand Takeover | 3s static / 3–5s video | premium |

(Mostly for enterprise budgets; v1 of pipeline rarely uses these.)

### CREATIVE RULES

- **Sound-on is the default.** TikTok is the only major paid platform where sound-on is the assumption.
- **First 3 seconds = everything.** TikTok's algorithm uses first-3s watch as a primary signal. If the hook isn't in frame 1, the ad dies.
- **Native > polished.** TikTok ads that look like ads lose to ads that look like creator content. UGC and creator-led perform 2–4× higher than studio-produced for cold targeting.
- **Trending sounds + Spark Ads** is the highest-leverage combo when timed correctly.

---

## CROSS-PLATFORM TRUTHS

These apply regardless of channel:

1. **Always produce 1:1, 4:5, AND 9:16 versions** of any campaign asset. Letting one channel rule out a creative because of aspect ratio is a waste.
2. **Caption everything.** Sound-off behaviour is 60–85% across feed-based platforms. Captions are not optional.
3. **First 3 seconds of any video carries the hook.** Pre-roll, in-feed, and short-form all live or die in seconds 0–3.
4. **Text-in-image limits aren't enforced anymore on Meta but they still affect reach.** Keep image-text under ~20% of canvas for max distribution.
5. **The hook is mobile-first.** ~95% of paid social is viewed on phones. Design at mobile size; scale up to desktop afterwards.
6. **CTAs are mode-matched to the LP, not the platform.** Don't use "Shop Now" if the LP is a lead form. Don't use "Learn More" if the LP is a checkout page.

---

## SPEC SHEET PER CAMPAIGN

The `creative-interrogator` channel-fit phase produces this output per creative:

```
ASSET: [name]
DECLARED PLACEMENT: [Meta Feed / Meta Story / Meta Reel / Google Search / etc.]

COPY CHECK:
- Primary Text / Description: [N chars / cap N] [✓ PASS / ⚠ OVER MOBILE / ✗ HARD CAP EXCEEDED]
- Headline: [N chars / cap N] [...]
- (other fields as applicable)

VISUAL CHECK:
- Aspect ratio: [X:Y / required X:Y] [✓ / ✗]
- Resolution: [N×M / required min] [✓ / ✗]
- Safe zones honoured: [✓ / ✗]
- Text-in-image %: [estimate] [✓ <20% / ⚠ 20–35% / ✗ >35%]
- Captions present: [✓ / ✗]

FORMAT CHECK:
- Duration (if video): [Ns / cap Ns] [...]
- File type: [...] [...]
- Frame rate (if video): [...] [...]

VERDICT: [SHIPPABLE / NEEDS REVISION / FAILS PLATFORM SPEC]
SPECIFIC FIXES: [list — e.g., "Headline is 47 chars, cut to ≤40 for mobile feed full visibility"]
```

---

## VOLATILE FIELDS (RECHECK BEFORE MAJOR CAMPAIGNS)

These fields change most often as platforms update:

- Meta Advantage+ rules (eligibility, suggestion mechanics) — RECHECK quarterly
- LinkedIn message ad frequency caps — RECHECK quarterly
- TikTok creative ad rules (especially restricted verticals) — RECHECK quarterly
- Google PMax asset requirements — RECHECK twice a year
- Any character cap that says "best practice" — RECHECK on each campaign's first round; platforms tweak truncation points

---

## v2 ROADMAP

Coming in next sprint:
- X (Twitter) Ads — Promoted posts, threads
- Email — Klaviyo + generic ESP specs (subject 50 char, preview text 75 char, mobile width, image:text ratio, dark-mode behaviour)
- Organic social — IG, LinkedIn, X, TikTok organic specs
- YouTube — full TrueView, Bumper, Discovery ad specs
- Pinterest + Snapchat (lower priority)

---

## DOWNSTREAM SKILL INTEGRATION

This library is consumed by:
- **creative-interrogator** Phase 7 (channel-fit) — primary consumer; runs every asset through the spec check
- **hook-creative-generator** — self-checks against char counts during generation
- **lp-copy-generator** — checks meta/OG tags + checkout funnel specs
- **cinematic-prompt-architect** — uses aspect ratios + duration constraints in prompts
- **audience-architect** — declared placements consult this library before audience structure
- **email-sequence-from-character** — (v2 will use email specs when added)

---

> **First principle:** A creative that violates a platform spec doesn't get a fair test. It gets reduced reach, throttled distribution, or outright rejection. Spec-check before the creative leaves the building. The 30 seconds it takes saves the campaign.
