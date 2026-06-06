---
description: Start a new marketing campaign — walk through the 9 strategic essentials in the terminal
---

Start a new campaign in the Marketing Command Center pipeline.

This is the **terminal entry point**. It walks the operator through the 9 strategic essentials inline in chat (the same fields the intake form collects), saves them to `intake.json`, then dispatches `phase-doc-setup` to fill the rest from the URL.

**If the Command Center hasn't been installed yet**, say so and ask the operator to run `/install-marketing-command-center` first.

**If it IS installed**, do this:

## Process

1. Confirm the operator's name (read from `setup-marketing-command-center` output, or ask).
2. Confirm the brand. List existing brands from `{marketing_root}/*/` directories. If new, ask for the name.
3. Walk through the 9 essentials — one at a time, conversational, not a form dump. Use the field list below.
4. After the 9 essentials are captured, write `{marketing_root}/{brand_slug}/{project_slug}/intake.json` with the operator's answers.
5. Run the `phase-doc-setup` skill. The skill will fetch the URL, extract product truth, brand voice, etc., and write `{marketing_root}/{brand_slug}/{project_slug}/1-setup.md`.
6. Print the next action: "Open the dashboard with `/open-command-center` to review the Setup doc and tick sections."

## The 9 essentials

| # | Field | Question | Required |
|---|-------|----------|----------|
| 1 | `brand_name` | Which brand is this campaign for? | yes |
| 2 | `project_name` | What's the campaign called? (slugify for filename) | yes |
| 3 | `product_url` | What's the website URL AI should research? | yes |
| 4 | `campaign_goal` | Primary goal? (awareness / leadgen / trial / purchase / retarget / retention / brand) | yes |
| 5 | `campaign_channels` | Channels in scope? (e.g. "Meta, Google, Email") | yes |
| 6 | `campaign_budget` | Budget + structure? (e.g. "$25k total / $5k test, $15k scale, $5k sustain") | yes |
| 7 | `campaign_kpi` | Primary KPI + target? (e.g. "CPL $80, range $60–$140") | yes |
| 8 | `campaign_timeline` | Timeline + launch date? (e.g. "Launch Sept 12, hard end Dec 1, 12-week run") | yes |
| 9 | `brand_hard_nos` | Hard NOs — topics/claims absolutely off-limits? (legal, ethical, category-specific) | yes |

Optional: `paste_docs` — operator can paste an existing brief, sample ads, or brand doc. Augments URL research; doesn't replace it.

## Hard rules

- **One question at a time.** Don't dump all 9 at once.
- **Never ask for data fetchable from the URL.** The `phase-doc-setup` skill will read the site. Don't ask "what does your product do" — let the AI find out.
- **Always offer to walk the operator through it** if they say "I don't know what to put." Don't refuse and don't auto-fill.
- **If the operator pasted a URL earlier in the session**, use it. Don't ask again.
- **The brand_slug + project_slug are kebab-case.** Slugify automatically. If a folder already exists with that name, append `-2`, `-3`, etc.
- **End with the path to the dashboard** so the operator can review the generated Setup doc.

## Example

```
You: /start-campaign
Claude: Which brand is this for? Existing brands: ChatInc, Gloss, Konekt.
You: ChatInc
Claude: What's the campaign called?
You: Flex Shopify launch
Claude: Got it — flex-shopify-launch. What URL should I research?
You: https://chatinc.com/flex
Claude: ... (continues through goals, channels, budget, KPI, timeline, hard NOs)
Claude: ✓ intake.json saved at ~/Documents/ChatInc-Marketing/chatinc/flex-shopify-launch/intake.json
        Running phase-doc-setup — fetching chatinc.com/flex now.
        (Claude invokes the phase-doc-setup skill, which writes 1-setup.md)
        ✓ Phase 1 doc ready: ~/Documents/ChatInc-Marketing/chatinc/flex-shopify-launch/1-setup.md
        Next: run /open-command-center to review, tick sections, approve.
```
