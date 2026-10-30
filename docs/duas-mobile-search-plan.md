# Dua mobile layout and forgiving search

Planning only · 30 October 2026 · Reference: option 1, “Kategorije”, in the supplied redesign image.

Updated with the requested Opće-first ordering and independent soft-letter search alternatives.

## Outcome

Replace the category wall with a search field and one compact row: **Sve dove · Sačuvane · Kategorije ▾**. Let people find a dua using its title, meaning, or transcription, even when typing without special characters or using familiar alternative spellings. Preserve the sourced text exactly as it is displayed today.

## What the current code tells us

- The catalog has **113 dua cards in 26 categories**. Every category currently renders as a pill before the first card. Mobile CSS still wraps the entire list; making the pills smaller would leave the underlying problem.
- There is no dua text search. The existing flow selects All, Saved, or a category, then displays ten cards at a time.
- `/duas` and `/dhikr` use the same component. Dhikr has five cards, its own bookmark storage, and no categories.
- Some cards contain multiple `sayings[]`, each with its own transcription and translation. Searching only the top-level fields would miss them.
- Bosnian and English transcriptions already encode many useful spelling alternatives. Both should be searchable regardless of the display language.
- The documented transcription key distinguishes `ḏ`, `ṯ`, `ḫ`, `ḥ`, `ṣ`, `ḍ`, `ṭ`, `ẓ`, long vowels, ayn and hamza. Removing accents alone cannot produce all the requested matches: `E‘ūḏu` becomes `eudu`, not `euzu`.

Evidence: [page state and pagination](../src/app/features/duas/duas.page.ts), [current controls and card rendering](../src/app/features/duas/duas.page.html), [mobile CSS](../src/app/features/duas/duas.page.css), [catalog and data shapes](../src/app/features/duas/duas.data.ts), [documented transcription key](hisnul-muslim/README-full.md).

## 1. Layout and interaction

1. Keep the heading and subtitle, then add a full-width search field: **Pretraži dove… / Search duas…**. Give it a persistent accessible label, search icon, and a clear button when nonempty. Use at least 16px input text and 44px touch targets. Do not autofocus and open the mobile keyboard on page load.
2. Directly below, show All, Saved with its existing count, and Categories. Use a styled native `<select>` for Categories. The closed control follows option 1; the open picker uses the device's native interface. Its selectable entries are **Sve dove, Sačuvane, Opće, then every other category A–Z** using the current display language's collation. In English: **All duas, Saved, General, then A–Z**. All/Saved entries invoke the same scope changes as the two shortcut buttons. The closed picker reads “Kategorije” when no category is active; a selected category gets its own label.
3. Keep the normal-size mobile controls on one row. Long selected category labels may shorten visually inside the picker; show the full selected category in a compact status line below. Never shorten the actual option or accessible name. At enlarged text/zoom, allow wrapping rather than clipping.
4. Show a result count during search or category browsing; do not reserve an empty status row. Announce count changes politely without moving focus. Keep storage errors separate from search status.
5. Retain the existing card hierarchy: title, Arabic, instructions when present, transcription, meaning, sources. Keep readable type and the current ornaments/colors. Reduce the category area rather than shrinking the religious text or clipping long cards.
6. Use the same compact controls on desktop within the existing 960px content width. Keep the shared responsive site header; forcing all its controls onto one narrow row is outside this change.

The initial visual target is two control rows totaling roughly 110–120px before an optional status line. At 360 × 800 and 390 × 844 CSS pixels, the first card's heading and the start of its content should be visible without scrolling, subject to verification with the actual header.

## 2. Filter behavior

Preserve the existing mutually exclusive collection scopes:

- **Sve dove:** all duas, with every **Opće / General** card first; clears category and Saved scope. Preserve card order within General and preserve the previous relative order of all remaining cards. Alphabetical sorting applies to the picker, not to the remaining cards in All.
- **Sačuvane:** saved duas; clears category.
- **Choose a category:** that category; leaves Saved scope.
- Search applies within the selected scope. Switching scope keeps the query; clearing the query keeps the scope. Display the active scope so users understand why a result may be absent.

Derive this General-first order for the All view without mutating the source catalog. Category views retain their internal card order, Saved keeps its existing ordering, and Dhikr stays unchanged. During an All-view search, relevance comes first; General-first browsing order breaks ties within a relevance tier. Clearing search restores General-first browsing.

Search the complete selected collection **before** pagination. Reset to ten results when query or scope changes. “Show more” retains its current focus behavior; typing must keep focus in the input and must not jump the page.

Keep existing `category` and `view=saved` links working. Add `q` for shareable/restorable search state. Typing replaces the current history entry; an explicit scope change creates a history entry. Clear irrelevant scope parameters explicitly, preserve `q`, and remove `q` when empty. Back/Forward restores both controls and results. A bad category continues to fall back to All.

Use the shared behavior for Dhikr, with localized Dhikr placeholder/labels and only All/Saved controls. Never mix the two collections or their bookmark IDs.

## 3. Search fields and matching

Index the title, translation, and transcription in **both BS and EN**. Include every nested saying, but return its parent card only once. The display language still controls the text rendered on the card.

Initial scope excludes source URLs, references, instructional notes, category labels, and Arabic-script search. These can be separate later requirements; they should not silently broaden the three requested fields.

Use ordinary normalized keys plus an additional transcription matcher that accepts the specified alternatives on either side:

### A. Ordinary text matching

For every requested field:

- Case-insensitive matching, trimming, and repeated-whitespace normalization.
- Unicode normalization and combining-mark removal: `ā/ī/ū → a/i/u`, `č/ć → c`, `š → s`, `ž → z`, `ḥ/ḫ → h`, `ṣ → s`, `ḍ → d`, `ṭ → t`, `ẓ → z`.
- Explicit `đ → dj`, because accent stripping does not handle it. Keep this distinct from automatically equating all `d` and `dj`.
- Ignore apostrophe/ayn/hamza variants inside words: straight and curly quotes, backticks, `ʿ`, and `ʾ`. Handle composed and decomposed Unicode identically.
- Treat punctuation, newlines, and dash variants consistently as separators. Keep a joined spelling for internal transcription joiners as described below.
- Match partial words: `namaz` finds `namaza`, `oprost` finds `oprosta`. Multiple query terms use **AND**, in any order, and may match different fields on the same card: `toalet euzu` must satisfy both terms.

Empty or whitespace-only input restores the selected scope. Input containing no searchable letters/digits also behaves as no text filter; it must never trigger an accidental “match every empty token” search. One- and two-letter input uses ordinary matching only.

### B. Additional forgiving transcription matching

Keep the ordinary transcription key too; add relaxed matching instead of replacing it. These are accepted typing alternatives, not changes to the pronunciation guide or displayed transcription. The user's soft-z description of `ḏ` is captured by accepting `z`; `ṯ` explicitly accepts both `t` and `s`.

- `v ↔ w`: `vahdehu` / `wahdehu`.
- `q ↔ k`: `qadir` / `kadir`, `qul` / `kul`.
- `ḏ`, or transcription digraph `dh`, accepts **`d`, `z`, and `dh`**: `E‘ūḏu` is found by `eudu`, `euzu`, and `eudhu`. Support a typed `ḏ` against its plain alternatives too, without making every ordinary `d` and `z` interchangeable.
- `ṯ`, or transcription digraph `th`, accepts **`t`, `s`, and `th`**: `ḫubṯi` accepts `hubti`, `hubsi`, `hubthi`, `khubti`, `khubsi`, and `khubthi`. These alternatives must combine independently with `ḫ → h/kh` within the same word. Existing English `kathīrin` should also accept `katir` and `kasir`; Bosnian `keṯīrin` accepts `ketir`, `kesir`, and `kethir` without a global a/e substitution.
- `ḫ / kh ↔ h`: accept `halfi` and `khalfi` for `ḫalfī`.
- The other marked consonants already present in the catalog retain their plain equivalents: **`ḥ → h`, `ṣ → s`, `ḍ → d`, `ṭ → t`, `ẓ → z`**. Keep `ḏ` distinct from `ḍ`: the soft-z alternative belongs to `ḏ`, not every d with a mark. Examples include `Subḥānallāh → subhanallah`, `beṣarī → besari`, `šejṭān → sejtan`, and `‘aẓīm → azim`.
- `gh ↔ g`: allow `gufran` / `ghufran` in transcription.
- `š / sh ↔ s`: accept `sejtan`, `shejtan`, and `šejtan` without requiring the Bosnian keyboard.
- Collapse repeated consonants during relaxed matching: `Allāh` / `Allah` / `Alah`, `rabbi` / `rabi`. Remove internal joiners before collapsing, so `l-l`, `ll`, and `l` agree inside a word. Recognize the existing Bosnian consonant digraph `dž` (plain `dz`) as a unit too: `dedždžāli` accepts `dedzali`; simply collapsing identical adjacent characters would miss this. No global j/y or j/dž replacement is needed.
- Collapse `aa`, `ii`, and `uu` as alternative long-vowel spellings: `Allaah` / `Allah`, `qadiir` / `qadir`. Do not indiscriminately remove vowels or merge all vowel sounds.
- Accept English-style `ee → i` and `oo → u` in the relaxed transcription key: `innee` / `inni`, `noor` / `nur`. The catalog already contains `innee`; ordinary title/meaning keys must retain their original vowels.
- Add a compact transcription phrase key that ignores spaces and internal joiners: `El-ḥamdu lillāh`, `el hamdu lillah`, and `elhamdulillah` can match. Keep ordinary term matching alongside it.

**Alternatives must compose independently.** Two whole-string keys (all accent-stripped versus all pronunciation-folded) are not enough: `khubti` mixes the `kh` alternative for `ḫ` with `t` for `ṯ`. Preserve the marked-letter information and match allowed alternatives at each position rather than generating every possible spelling of an entire sentence. Also accept mixed choices in a compact phrase, such as `eudubikeminelhubsi`. No transitive global `d/z` or `t/s` substitution is needed, even inside transcription: the special-letter or recognized digraph relationship must justify the alternative.

Relaxed matching requires at least three meaningful characters in a query term, or in a joined transcription phrase. The `l/ll/l-l` rule applies within words; a lone `l` should not expand into a large phonetic search.

**Ordering of transformations matters:** first normalize to NFC and lowercase, capture explicit special-letter and digraph alternatives, then decompose ordinary characters with NFD and remove combining marks. Normalize the vowel pairs, fold joiners/separators, and finally handle repeated consonants. Preserve the captured alternatives through matching; otherwise `ḏ` loses its identity before it can accept `z`, or choosing one alias destroys other valid combinations. Do not create digraph mappings across whitespace boundaries.

Compact representations stay within one transcription field, one language, and one saying. Never concatenate a title with its translation, two languages, or separate sayings to manufacture a phrase match. Queries remain literal strings, not user-built regular expressions.

### Relevance and limits

Use a small deterministic ordering:

1. Full query matches the title after ordinary normalization.
2. All terms match using ordinary keys across the requested fields.
3. A complete match requires relaxed transcription or compact-phrase matching.

Within each tier, keep the selected scope's browsing order: General first for All, existing order for Saved or an individual category. A strong title match should not be buried beneath loose General transcription matches. With no query, All starts with General; the other scopes retain their existing order.

Do **not** globally equate `d/z`, `t/s`, `a/e`, or `j/y`, and do not apply Arabic phonetic mappings to ordinary English/Bosnian meanings. Both language versions already cover many real variants, such as `Estagfirullāh` / `Astaghfirullāh`; universal substitutions would create unrelated results. Any additional colloquial phrase aliases should be justified by a concrete missed query and covered by a test.

General typo correction, stemming, synonym search, and semantic/AI search are deferred. The initial version should first prove these specific, explainable spelling rules against the real collection. No search library, backend, or new dependency is needed.

## 4. Empty states and feedback

- **No bookmarks, no query:** retain the current explanation of how to save a dua.
- **No matching results:** show “Nema rezultata za ovu pretragu” / “No results for this search”, with a clear-search action. In a restricted scope, also offer searching all duas while retaining the query.
- **Matching results:** show the total number of matching cards, not just the first ten rendered. Keep the saved count as the total saved count, not the filtered count.
- Do not rewrite transcription, insert inferred text into Arabic, or highlight approximate substrings in the first version. Whole cards remain the reading surface, including all nested sayings and their instructions/sources.

## 5. Implementation sequence

1. Add one small pure search module beside the dua page, plus one focused spec. Prepare ordinary keys and transcription alias information once for the immutable collection; normalize only the changing query during typing. Preserve field, language, and saying boundaries. The current catalog is small enough for a direct in-memory scan without a worker, debounce, or external index. Do not enumerate combinations of whole-sentence aliases.
2. Derive General-first All-view ordering and the All/Saved/General/A–Z picker order in the existing page. Integrate the matcher with the current scope computation before the ten-card slice. Add query URL state and result counts; retain bookmark persistence and Dhikr separation.
3. Replace the category loop in the controls with the native picker; add search, clear, scope/count feedback, and distinct empty states. Reuse existing theme tokens and layout styles.
4. Add strings and accessible labels through the existing BS/EN label files. Use a simple localized count label rather than adding a pluralization system.
5. Extend the existing page tests for search/routing/pagination and update category assertions to inspect picker options. Run focused tests, build, and visual checks.

Expected production files: `duas.page.ts`, `duas.page.html`, `duas.page.css`, `core/i18n/bs.ts`, `core/i18n/en.ts`, and one `duas-search.ts` helper. Expected test files: one helper spec and the existing `duas.page.spec.ts`. No catalog-content rewrite or shared search framework.

## 6. Acceptance checks

The focused search spec should use actual catalog entries as well as a few boundary fixtures:

- `toalet` finds a title; `prizivam` finds the meaning of `hisn-10`; `euzu` finds its transcription.
- `E‘ūḏu`, decomposed Unicode, `euzu`, `eudhu`, `eudu`, and uppercase versions find the expected refuge entries.
- `Allāh`, `Allah`, `Alah`, `Allaah`, and an internal `l-l` spelling match equivalently in transcription.
- `innee` / `inni` and `noor` / `nur` match through relaxed transcription keys; ordinary titles/meanings do not inherit the `ee/oo` substitutions.
- Verify every relaxed rule in both directions, including `v/w`, `q/k`, `ḫ/h/kh`, `ṯ/s/th`, `gh/g`, `š/sh/s`, repeated consonants, and long-vowel alternatives.
- For `ḫubṯi`, verify all six combinations `hubti`, `hubsi`, `hubthi`, `khubti`, `khubsi`, `khubthi`; also verify mixed compact-phrase alternatives such as `eudubikeminelhubsi` against `hisn-10`. Tests must catch the shortcomings of only two whole-string keys.
- Check independent choices for repeated occurrences of the same marked letter: `dallezi` matches `ḏā-lleḏī` in the nested after-prayer recitation. Check `katir/kasir/kathir` against existing English `kathīrin`, and `ketir/kesir/kethir` against Bosnian `keṯīrin` in the protection category.
- Check every other marked consonant against real data (`ḥ/h`, `ṣ/s`, `ḍ/d`, `ṭ/t`, `ẓ/z`), and ensure `ḍ` does not gain `ḏ`'s z alternative.
- Check repeated consonant digraphs using the protection text: `mesihidedzal` finds `mesīḥi-d-dedždžāli`, combining accent removal, internal joiners, repeated d, and repeated dž/dz units.
- `elhamdulillah` finds a transcription written with internal hyphens/spaces. Compact matching cannot bridge separate sayings, languages, or fields.
- `toalet euzu` requires both terms; `toalet nonexistentword` returns no matches. The order of terms does not matter.
- `Estagfirullāh` / `Astaghfirullāh` and nested saying text remain searchable in either display language, with one result per parent card.
- Accent-only matching works in titles/meanings, but phonetic-only `d/z` or `t/s` lookalikes in ordinary meanings do not match. Keep a negative example for every deliberately broad transcription rule.
- Strong title matches precede relaxed matches; ties and empty-query ordering remain stable. Apostrophe-only, whitespace-only, pasted punctuation, and literal regex symbols are handled without exceptions.

Page integration checks:

- With no search, All starts with every General card in its existing internal order, even when the group spans more than ten cards. Remaining cards keep their relative order; no card is duplicated or lost. Clearing search restores that order. Relevance still precedes General priority during search.
- Picker entries are All, Saved, General, then the other categories sorted by localized label in BS and EN. Selecting its All/Saved shortcuts has exactly the same behavior as the external buttons. Category/Saved/Dhikr card order remains unchanged.
- Search reaches a matching item beyond the initial ten; changing query/scope resets pagination; “Show more” still focuses the first newly revealed heading.
- Search combines correctly with each exclusive scope. Clear-search keeps scope; searching all keeps query. Existing URLs, unknown-category fallback, query restoration, and Back/Forward remain correct.
- Bookmark persistence, unsaving inside Saved results, storage errors, and separate Dhikr storage continue to work. Counts update without stale results.
- Search input retains focus during typing. No-match messaging differs from empty bookmarks. All labels are available in BS and EN.

Visual/accessibility checks at 320, 360, 390, 430, 768, and desktop widths, in both languages and both themes: no horizontal page overflow; normal-size mobile controls use two rows; long category names remain understandable; input and touch sizes remain usable; Arabic marks are not clipped; native picker and clear button work with keyboard/touch; focus is visible; zoom can wrap controls; the initial viewport exposes the first card.

Use the project's existing Vitest/Angular test command and production build. This document is the plan; implementation and visual verification are still to be done.
