# PostHog Tracking Strategy
### Prisma Documentation & Blog | Q1 2026

> **Prepared by:** DevRel Engineering
> **Date:** March 17, 2026
> **Status:** Proposal — pending team review

---

## TL;DR

We have 2 PostHog events. We need ~10 to measure our KRs. Here's the plan:

| What | Why | Effort |
|------|-----|--------|
| Add `content_area` super property to all pageviews | KR 1.1 — can't tell ORM visits from PPG visits today | ~40 lines, 3 files |
| Track copy prompt, copy markdown, open in Claude/ChatGPT | KR 1.2 — zero high-intent interactions are tracked | ~15 lines, 1 file |
| Build a remark plugin to auto-inject UTMs on all console links | KR 2.3 — 94% of console links have no attribution | ~40 lines, 2 files |
| Add IntersectionObserver on quickstart headings | KR 2.2 — no way to measure getting-started completion | ~55 lines, 2 files |
| Track AI chat queries and feedback | KR 2.1 — baseline measurement data | ~6 lines, 1 file |

**Total: ~155 new lines of code, 4 new files, ~8 modified files. No architectural changes.**

---

## Executive Summary

Our Q1 2026 KRs depend on PostHog instrumentation that largely doesn't exist yet. This report audits the current state, identifies every gap, and proposes a concrete tracking plan to close them.

**Key findings:**

1. **We track almost nothing.** The docs site has exactly 2 custom PostHog events (`docs:search` and `docs:404_not_found`). Out of 28+ user interactions with onClick handlers, **zero** have analytics tracking.

2. **94% of console links are untagged.** Of ~78 `console.prisma.io` links in v7 docs, only 5 carry UTM parameters. This makes KR 2.3 (PPG project attribution) impossible to measure today.

3. **No content segmentation exists.** We can't distinguish ORM pageviews from PPG pageviews from Compute pageviews. This blocks KR 1.1 (25K unique visitors to PPG/Compute content).

4. **Getting-started completion is unmeasured.** We have no funnel tracking for quickstart pages, blocking KR 2.2 (15% completion rate).

5. **The fix is small.** ~200 lines of code across ~10 files, plus a remark plugin for automatic UTM injection. No major architectural changes needed.

---

## Table of Contents

1. [Current State Audit](#1-current-state-audit)
2. [KR-to-Tracking Gap Matrix](#2-kr-to-tracking-gap-matrix)
3. [Proposed Event Catalog](#3-proposed-event-catalog)
4. [Implementation Plan](#4-implementation-plan)
5. [UTM Standardization](#5-utm-standardization)
6. [High-Intent Interaction Definition](#6-high-intent-interaction-definition)
7. [Dashboard Specifications](#7-dashboard-specifications)
8. [Open Questions](#8-open-questions)

---

## 1. Current State Audit

### 1.1 PostHog Initialization

PostHog is initialized globally in both apps via `instrumentation-client.ts`. No React provider wrapper is needed — `posthog` can be imported directly in any client component.

| App | File | Super Properties |
|-----|------|-----------------|
| Docs | `apps/docs/src/instrumentation-client.ts` | `site_name: "mono-docs"`, `environment: "production"` |
| Blog | `apps/blog/src/instrumentation-client.ts` | `site_name: "mono-blog"`, `environment: "production"` |

Both use `capture_pageview: "history_change"`, which auto-captures `$pageview` events on every client-side navigation.

### 1.2 Custom Events (Total: 2)

| Event Name | File | Line | Properties | Mapped to KR? |
|------------|------|------|------------|---------------|
| `docs:search` | `src/components/search.tsx` | 55 | `{ query: string }` | No |
| `docs:404_not_found` | `src/components/not-found-tracker.tsx` | 8 | `{ $current_url, pathname }` | No |

### 1.3 Untracked User Interactions

These components have onClick handlers but **no PostHog tracking**:

| Component | File | Interaction | KR Relevance |
|-----------|------|-------------|-------------|
| **CopyPromptButton** | `src/components/page-actions.tsx:46` | Copy AI prompt to clipboard | KR 1.2 (high-intent) |
| **LLMCopyButton** | `src/components/page-actions.tsx:68` | Copy page as markdown | KR 1.2 (high-intent) |
| **ViewOptions** | `src/components/page-actions.tsx:121` | Open in GitHub / ChatGPT / Claude / T3 Chat | KR 1.2 (high-intent) |
| AI Chat Sidebar | `src/components/ai-chat-sidebar.tsx` | Submit query, feedback, suggestions, clear | KR 2.1 (baseline) |
| Sidebar Banner | `src/components/sidebar-banner.tsx` | Click CTA, dismiss | KR 1.2 |
| Blog Share | `apps/blog/src/components/BlogShare.tsx` | Copy link to clipboard | — |
| Theme Toggle | `src/components/layout/theme-toggle.tsx` | Switch theme | None |
| Language Toggle | `src/components/layout/language-toggle.tsx` | Change language | None |

### 1.4 Third-Party Scripts

| Script | File | Purpose |
|--------|------|---------|
| **Tolt.io** | `src/app/layout.tsx:47-51` | Affiliate/referral tracking |
| **CookieYes** | `src/app/layout.tsx:52-56` | Cookie consent management |
| **Sentry** | `src/instrumentation-client.ts:16-27` | Error monitoring (`tracesSampleRate: 1`) |

No Google Analytics or Segment detected.

### 1.5 UTM Attribution Coverage

| Link Type | Total Occurrences | With UTMs | Without UTMs | Gap |
|-----------|:-----------------:|:---------:|:------------:|:---:|
| `console.prisma.io` (v7 docs) | ~78 | ~5 | ~73 | **94%** |
| `console.prisma.io` (v6 docs) | ~77 | ~10 | ~67 | **87%** |
| `console.prisma.io` (blog) | ~20 | 2 | ~18 | **90%** |
| `pris.ly` short links | ~244 | ~10 | ~234 | **96%** |
| `www.prisma.io` links | ~244 | ~20 | ~224 | **92%** |

**Notable issues:**
- Blog post `formbricks-and-prisma-accelerate.../index.mdx:60` has a malformed UTM: `?source=blog?medium=customer-story-formbricks` (missing `utm_` prefix, uses `?` instead of `&`)
- v6 layout uses `utm_medium=header` while v7 uses `utm_medium=navbar` (inconsistent)
- `utm_campaign` is misused on some links (e.g., `utm_campaign=login` just restates the destination)

### 1.6 Content Structure

The docs site has clear URL-based content areas that we can use for segmentation:

```
/prisma-orm/quickstart/{database}     → ORM getting-started (8 DB variants)
/prisma-orm/add-to-existing-project/  → ORM getting-started (8 DB variants)
/prisma-postgres/quickstart/{orm}     → PPG getting-started (4 ORM variants)
/prisma-postgres/from-the-cli         → PPG getting-started
/orm/*                                → ORM reference docs
/postgres/*                           → PPG/Postgres docs
/accelerate/*                         → Accelerate docs
/console/*                            → Console docs
/guides/*                             → Integration guides
/ai/*                                 → AI docs
```

All docs pages are rendered through `apps/docs/src/app/(docs)/(default)/[[...slug]]/page.tsx`.

---

## 2. KR-to-Tracking Gap Matrix

| KR | Target | What Data Is Needed | What We Track Today | What's Missing | Priority |
|----|--------|--------------------|--------------------|---------------|:--------:|
| **1.1** Unique visitors to PPG/Compute content | 25,000 | Pageviews segmented by content area (ORM vs PPG vs Compute) | Pageviews auto-captured, but with **no content area segmentation** | `content_area` super property on all pageviews | **P0** |
| **1.2** High-intent interactions | 2,000 | Copy prompt, copy markdown, open in Claude, console link clicks — all on PPG/Compute pages | **Nothing** | 4 new events: `docs:copy_prompt`, `docs:copy_markdown`, `docs:open_external_tool`, `docs:console_link_click` | **P0** |
| **2.1** Baseline measurement report | Done | Sufficient instrumentation to measure KRs 2.2–2.4 | 2 generic events, no content categorization, no funnels | **Everything in this proposal** is the baseline | **P0** |
| **2.2** ORM getting-started completion rate | 15% | Funnel: land on quickstart → progress through steps → reach final section | Entry pageview captured; **no completion signal** | `docs:quickstart_section_view` event via IntersectionObserver | **P1** |
| **2.3** New PPG projects from DevRel surfaces | 15% | UTM attribution on all console links + outbound click tracking | 5 of ~78 console links have UTMs | Remark plugin for automatic UTM injection + `docs:console_link_click` event | **P0** |
| **2.4** Compute template activation rate | 15% | Console-side analytics (Console team owns this) | N/A | Ensure console links from compute content carry UTMs | **P2** |

---

## 3. Proposed Event Catalog

### 3.0 Content Categorization (super property — not an event)

Register `content_area` and `is_ppg_or_compute` as PostHog super properties on every route change. These automatically attach to every `$pageview` and custom event.

**URL → content_area mapping:**

| URL Prefix | `content_area` | `is_ppg_or_compute` |
|-----------|:-------------:|:-------------------:|
| `/prisma-postgres/*`, `/postgres/*` | `ppg` | `true` |
| `/prisma-orm/*`, `/orm/*` | `orm` | `false` |
| `/accelerate/*` | `accelerate` | `false` |
| `/console/*` | `console` | `false` |
| `/guides/*` | `guides` | `false` |
| `/ai/*` | `ai` | `false` |
| `/management-api/*` | `management-api` | `false` |
| `/studio/*` | `studio` | `false` |
| `/cli/*` | `cli` | `false` |
| `/query-insights/*` | `query-insights` | `false` |
| everything else | `other` | `false` |

Additionally, a `content_subtype` property:
- `quickstart` for URLs containing `/quickstart/`
- `getting-started` for `/add-to-existing-project/`, `/from-the-cli`, `/import-from-existing`

**Implementation:**
- New file: `apps/docs/src/lib/tracking.ts` (pure function)
- New file: `apps/docs/src/components/tracking-provider.tsx` (client component using `usePathname()` + `useEffect`)
- Modify: `apps/docs/src/components/provider.tsx` (render `<TrackingProvider />`)
- **Complexity:** Simple (~40 lines)
- **KRs:** 1.1, 1.2, 2.1, 2.2, 2.3

---

### 3.1 `docs:copy_prompt`

| | |
|---|---|
| **Description** | User copies the AI prompt for the current page |
| **Properties** | `{ page_path: string }` (content_area auto-attached via super property) |
| **File** | `apps/docs/src/components/page-actions.tsx:48` |
| **Where in code** | Inside `CopyPromptButton`, after `navigator.clipboard.writeText()` |
| **KRs** | 1.2 |
| **Complexity** | Trivial (1 line) |

---

### 3.2 `docs:copy_markdown`

| | |
|---|---|
| **Description** | User copies page content as markdown (for LLM use) |
| **Properties** | `{ page_path: string }` |
| **File** | `apps/docs/src/components/page-actions.tsx:77` |
| **Where in code** | Inside `LLMCopyButton`, after clipboard write |
| **KRs** | 1.2 |
| **Complexity** | Trivial (1 line) |

---

### 3.3 `docs:open_external_tool`

| | |
|---|---|
| **Description** | User clicks "Open in GitHub/ChatGPT/Claude/T3 Chat" |
| **Properties** | `{ page_path: string, tool: "github" \| "chatgpt" \| "claude" \| "t3_chat" }` |
| **File** | `apps/docs/src/components/page-actions.tsx:211-224` |
| **Where in code** | Add `onClick` handler to each `<a>` tag in the `ViewOptions` component's `items.map()` |
| **KRs** | 1.2 |
| **Complexity** | Simple (~10 lines) |

---

### 3.4 `docs:console_link_click`

| | |
|---|---|
| **Description** | User clicks any link to `console.prisma.io` |
| **Properties** | `{ page_path: string, destination_url: string, has_utm: boolean }` |
| **File** | `apps/docs/src/components/tracking-provider.tsx` |
| **Where in code** | Delegated click listener on `a[href*="console.prisma.io"]` — no per-component changes |
| **KRs** | 1.2, 2.3 |
| **Complexity** | Simple (~15 lines) |

---

### 3.5 `docs:quickstart_section_view`

| | |
|---|---|
| **Description** | User scrolls to a section heading in a getting-started guide |
| **Properties** | `{ page_path: string, section_id: string, section_index: number, total_sections: number, database: string }` |
| **File** | New: `apps/docs/src/components/section-tracker.tsx` |
| **Where in code** | Client component using `IntersectionObserver` on `h2[id]` elements. Rendered conditionally in `apps/docs/src/app/(docs)/(default)/[[...slug]]/page.tsx` when URL contains `/quickstart/` or `/add-to-existing-project/`. |
| **KRs** | 2.2 |
| **Complexity** | Complex (~50 lines — new component) |

**How it works:**
1. On mount, queries all `h2[id]` elements within the docs body
2. Creates an `IntersectionObserver` (threshold: 0.1, rootMargin: `0px 0px -20% 0px`)
3. When a heading enters the viewport, fires the event once (deduplicated via `Set`)
4. "Completion" = reaching the `next-steps` heading (the section after the last numbered step)

**Resulting funnel for KR 2.2:**
```
Step 1: $pageview on /prisma-orm/quickstart/*
Step 2: docs:quickstart_section_view (section_index >= 5)    ← midpoint
Step 3: docs:quickstart_section_view (section_id = "next-steps") ← completion

Completion rate = Step 3 / Step 1
```

The `database` property (extracted from the final URL segment) lets us compare completion rates across PostgreSQL, MySQL, SQLite, MongoDB, etc.

---

### 3.6 `docs:ai_chat_query`

| | |
|---|---|
| **Description** | User submits a question to the AI chat sidebar |
| **Properties** | `{ page_path: string, query_length: number, is_suggestion: boolean }` |
| **File** | `apps/docs/src/components/ai-chat-sidebar.tsx` |
| **Where in code** | In `handleSubmit` and `handleSuggestionClick` |
| **KRs** | 2.1 |
| **Complexity** | Trivial (2 lines) |

---

### 3.7 `docs:ai_chat_feedback`

| | |
|---|---|
| **Description** | User upvotes or downvotes an AI chat response |
| **Properties** | `{ page_path: string, reaction: "upvote" \| "downvote" }` |
| **File** | `apps/docs/src/components/ai-chat-sidebar.tsx` |
| **Where in code** | In the feedback handler |
| **KRs** | 2.1 |
| **Complexity** | Trivial (1 line) |

---

### 3.8 `docs:sidebar_banner_click`

| | |
|---|---|
| **Description** | User clicks a sidebar promotion banner CTA |
| **Properties** | `{ banner_href: string, page_path: string }` |
| **File** | `apps/docs/src/components/sidebar-banner.tsx` |
| **Where in code** | On the CTA link element |
| **KRs** | 1.2 |
| **Complexity** | Trivial (1 line) |

---

### Events NOT Recommended

| Interaction | Why Skip |
|-------------|---------|
| **Code block copy** | The `CodeBlock` component lives in `@prisma/eclipse` and does not expose an `onCopy` callback. Recommend filing an upstream issue to add one. |
| **AI chat clear** | Low signal — clearing chat doesn't indicate intent or satisfaction. |
| **Theme / language toggle** | UI preferences with no KR relevance. |
| **Sidebar collapse** | Navigation behavior, not content engagement. |

---

## 4. Implementation Plan

### Phase 1 — Content categorization + page-actions tracking
**Unlocks:** KR 1.1, KR 1.2, KR 2.1

| Action | File | Change Type | Lines |
|--------|------|:-----------:|:-----:|
| Create content area mapping function | `apps/docs/src/lib/tracking.ts` | **New** | ~25 |
| Create tracking provider (super props + console click listener) | `apps/docs/src/components/tracking-provider.tsx` | **New** | ~40 |
| Mount tracking provider | `apps/docs/src/components/provider.tsx` | Modify | ~2 |
| Add `docs:copy_prompt` capture | `apps/docs/src/components/page-actions.tsx` | Modify | ~2 |
| Add `docs:copy_markdown` capture | `apps/docs/src/components/page-actions.tsx` | Modify | ~2 |
| Add `docs:open_external_tool` capture | `apps/docs/src/components/page-actions.tsx` | Modify | ~10 |

### Phase 2 — UTM auto-injection via remark plugin
**Unlocks:** KR 2.3

| Action | File | Change Type | Lines |
|--------|------|:-----------:|:-----:|
| Create remark plugin for console UTMs | `apps/docs/src/lib/remark-console-utm.ts` | **New** | ~40 |
| Register plugin in MDX config | `apps/docs/source.config.ts` | Modify | ~2 |

### Phase 3 — Getting-started funnel
**Unlocks:** KR 2.2

| Action | File | Change Type | Lines |
|--------|------|:-----------:|:-----:|
| Create section tracker component | `apps/docs/src/components/section-tracker.tsx` | **New** | ~50 |
| Conditionally render on quickstart pages | `apps/docs/src/app/(docs)/(default)/[[...slug]]/page.tsx` | Modify | ~5 |

### Phase 4 — AI chat tracking
**Unlocks:** KR 2.1 (baseline data)

| Action | File | Change Type | Lines |
|--------|------|:-----------:|:-----:|
| Add `docs:ai_chat_query` capture (2 locations) | `apps/docs/src/components/ai-chat-sidebar.tsx` | Modify | ~4 |
| Add `docs:ai_chat_feedback` capture | `apps/docs/src/components/ai-chat-sidebar.tsx` | Modify | ~2 |

### Phase 5 — Lower priority cleanup

| Action | File | Change Type | Lines |
|--------|------|:-----------:|:-----:|
| Add `docs:sidebar_banner_click` capture | `apps/docs/src/components/sidebar-banner.tsx` | Modify | ~2 |
| Add remark plugin to blog | `apps/blog/source.config.ts` | Modify | ~2 |
| Fix malformed UTM in Formbricks post | `apps/blog/content/blog/formbricks.../index.mdx` | Modify | ~1 |
| Standardize v6 navbar UTM (`header` → `navbar`) | v6 layout file | Modify | ~1 |

### Total Scope

| | |
|---|---|
| **New files** | 4 |
| **Modified files** | ~8 |
| **New lines of code** | ~155 |
| **Modified lines** | ~35 |

---

## 5. UTM Standardization

### 5.1 Naming Convention

| Parameter | Value | When to Use |
|-----------|-------|-------------|
| **`utm_source`** | `docs` | All links from v7 docs site |
| | `docs-v6` | All links from v6 docs (tracks legacy usage) |
| | `blog` | All links from blog app |
| | `website` | Shared navigation (already in use) |
| **`utm_medium`** | `navbar` | Top navigation bar |
| | `sidebar` | Sidebar links and banners |
| | `content` | Inline links within MDX body content **(default)** |
| | `cta` | Explicit call-to-action buttons |
| | `footer` | Footer links |
| **`utm_content`** | `{section}` | Auto-derived from file path: `orm`, `postgres`, `accelerate`, `getting-started`, `guides`, etc. |
| **`utm_campaign`** | _(reserved)_ | **Do not use as default.** Only for time-bound marketing campaigns (e.g., `ppg-launch-2026`, `accelerate-promo-q1`) |

### 5.2 Remark Plugin Approach

Instead of manually editing 140+ MDX files, we build a remark plugin that runs at MDX build time.

**Plugin behavior:**
1. Walks the MDAST looking for `link` nodes
2. For any `console.prisma.io` link that **lacks** `utm_source`, appends:
   ```
   ?utm_source=docs&utm_medium=content&utm_content={section}
   ```
3. `{section}` is extracted from the file path:
   - `content/docs/postgres/foo.mdx` → `utm_content=postgres`
   - `content/docs/(index)/prisma-orm/quickstart/...` → `utm_content=getting-started`
   - `content/docs.v6/...` → `utm_source=docs-v6`
4. Links that already have `utm_source` are **left untouched** (respects manual overrides)

**Integration point:** Added to the `remarkPlugins` array in `apps/docs/source.config.ts:63`, alongside the existing 4 remark plugins.

### 5.3 Current Inconsistencies to Fix

| Issue | Location | Fix |
|-------|----------|-----|
| `?source=blog?medium=customer-story-formbricks` | `apps/blog/content/blog/formbricks.../index.mdx:60` | Replace with proper `?utm_source=blog&utm_medium=content` (or let remark plugin handle it) |
| `utm_medium=header` (v6) vs `utm_medium=navbar` (v7) | v6 layout file | Standardize to `navbar` |
| `utm_campaign=login` / `utm_campaign=signup` | `packages/ui/src/components/web-navigation.tsx` | Keep for now — nav component is shared across properties |
| `utm_source=actions_guide` | `guides/github-actions.mdx` | Let remark plugin override with `utm_source=docs` |

### 5.4 Attribution Chain (KR 2.3)

```
User reads docs page
  ↓
Clicks console.prisma.io link (UTMs from remark plugin)
  ↓
Lands on Console with ?utm_source=docs&utm_medium=content&utm_content=postgres
  ↓
Console persists UTMs in session (Console team responsibility)
  ↓
User signs up → creates PPG project
  ↓
Console analytics attributes project to "docs"
```

**Where attribution can be lost:**
1. **Docs → Console landing** — Fixed by remark plugin (from 6% to ~100% coverage)
2. **Console landing → signup** — Console team must persist UTMs from landing page into signup flow. **Requires coordination.**
3. **Signup → project creation** — Console team must associate signup UTMs with subsequent project creation.
4. **Referrer header** — Docs has `Referrer-Policy: strict-origin-when-cross-origin`, so Console only sees `https://www.prisma.io` as referrer, not the full path. UTMs are essential.

### 5.5 pris.ly Short Links

**Open question:** Does `pris.ly` preserve query parameters through redirects?

- If yes: remark plugin can also handle `pris.ly` links
- If no: UTMs must be baked into the short link's destination configuration (requires separate short links per source)

**Recommendation:** Do not use `pris.ly` for `console.prisma.io` destinations. Use full URLs so the remark plugin can inject UTMs. Reserve `pris.ly` for external links (Discord, GitHub, X).

---

## 6. High-Intent Interaction Definition

For KR 1.2 (2,000 high-intent interactions on PPG/Compute content), an interaction qualifies as "high-intent" when it signals that a user is **actively trying to use** Prisma Postgres — not just browsing.

### Qualifying Events

All events must occur on pages where `is_ppg_or_compute = true` (super property).

| Event | Signal | Rationale |
|-------|:------:|-----------|
| `docs:console_link_click` | Strongest | User navigating from PPG docs to Console to start using the product |
| `docs:copy_prompt` | Strong | Preparing to use PPG content with an AI assistant |
| `docs:copy_markdown` | Strong | Feeding PPG docs to an LLM for implementation help |
| `docs:open_external_tool` | Strong | Taking PPG docs to Claude/ChatGPT for deeper help |
| `docs:quickstart_section_view` where `section_id = "next-steps"` | Strong | Completed a PPG quickstart tutorial |
| `docs:sidebar_banner_click` on PPG banners | Moderate | Engaged with PPG promotional content |
| `docs:search` where query matches PPG terms | Weak | Searching for PPG topics (could be exploratory) |

**PPG search terms:** "prisma postgres", "ppg", "postgres database", "connection pool", "compute"

### Counting Methodology

Start with a **flat count** — each qualifying event = 1 interaction. If needed later, apply weights (e.g., 0.5 for search, 1.0 for everything else). Reassess after baseline data from KR 2.1 is available.

**PostHog implementation:** A single Trends insight filtering on the union of qualifying event names, with `is_ppg_or_compute = true`.

---

## 7. Dashboard Specifications

### Dashboard 1: "KR Overview"

The executive dashboard — one number per KR.

| Insight | Chart Type | Definition | Goal Line |
|---------|-----------|------------|:---------:|
| **KR 1.1 — PPG Unique Visitors** | Number + Trend | `$pageview` where `is_ppg_or_compute = true`, count unique users | 25,000 |
| **KR 1.2 — High-Intent Interactions** | Number + Trend | Count of qualifying high-intent events (see Section 6) | 2,000 |
| **KR 2.2 — ORM Quickstart Completion** | Funnel | `$pageview` on `/prisma-orm/quickstart/*` → `docs:quickstart_section_view` where `section_id = "next-steps"` | 15% |
| **KR 2.3 — Console Click UTM Coverage** | Number | `docs:console_link_click` breakdown by `has_utm` (true vs false) | 100% coverage |

### Dashboard 2: "Content Engagement"

| Insight | Chart Type | Definition |
|---------|-----------|------------|
| Pageviews by Content Area | Stacked area (weekly) | `$pageview`, breakdown by `content_area` |
| Top 20 Pages | Table | `$pageview`, unique users, breakdown by `$pathname` |
| AI Chat Usage | Trend (daily) | `docs:ai_chat_query` count, breakdown by `is_suggestion` |
| AI Chat Satisfaction | Trend | `docs:ai_chat_feedback`, breakdown by `reaction`. Calculate upvote ratio. |
| Search Queries | Table | Top `docs:search` queries by count |
| 404 Errors | Trend + Table | `docs:404_not_found` weekly count + top paths |

### Dashboard 3: "Getting-Started Funnels"

| Insight | Chart Type | Definition |
|---------|-----------|------------|
| ORM Quickstart Funnel (aggregate) | Funnel | pageview → section 5 → "next-steps" |
| ORM Funnel by Database | Funnel (breakdown) | Same funnel, broken down by `database` property |
| PPG Quickstart Funnel by ORM | Funnel (breakdown) | Same pattern, broken down by ORM variant (prisma-orm, drizzle, kysely, typeorm) |
| Section Drop-off | Bar chart | Count of `docs:quickstart_section_view` by `section_index` for top quickstart |

### Dashboard 4: "Page Actions"

| Insight | Chart Type | Definition |
|---------|-----------|------------|
| Copy Prompt vs Copy Markdown | Trend | Comparing `docs:copy_prompt` and `docs:copy_markdown` over time |
| External Tool by Type | Trend (breakdown) | `docs:open_external_tool`, breakdown by `tool` (GitHub, ChatGPT, Claude, T3 Chat) |
| Console Clicks by Content Area | Trend (breakdown) | `docs:console_link_click`, breakdown by `content_area` |
| Sidebar Banner Engagement | Stacked bar | `docs:sidebar_banner_click` vs `docs:sidebar_banner_dismiss` |

---

## 8. Open Questions

| Question | Who Answers | Impact |
|----------|------------|--------|
| Does `pris.ly` preserve query parameters through redirects? | DevRel (test with `curl -I 'https://pris.ly/discord?utm_source=test'`) | Determines UTM strategy for short links |
| Does Console persist landing page UTMs through signup → project creation? | Console / Platform team | Critical for KR 2.3 attribution chain |
| Can `@prisma/eclipse` expose an `onCopy` callback on CodeBlock? | Eclipse team | Would enable code block copy tracking |
| When Compute gets its own docs section, what URL prefix will it use? | Docs team | Determines `content_area` mapping for Compute |
| Should we track PPG quickstart funnels the same way as ORM? | DevRel leadership | Affects scope of Section Tracker |

---

*This document was generated from a comprehensive audit of the `prisma/web` monorepo, cross-referenced with the Q1 2026 KR dashboard.*
