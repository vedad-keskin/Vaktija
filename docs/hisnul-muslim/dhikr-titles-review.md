# Dhikr titles: BS / EN review

Implemented from the accepted review - 9 November 2026. All 9 recommended BS/EN title changes are applied; T02 and T10 are kept.

All 11 dhikr cards are covered below: **9 title changes and 2 titles kept**. Six Bosnian titles use **“Zikr za…”**; the others use a short descriptive title where that reads more naturally.

Each entry retains the exact old BS/EN titles and the accepted new pair. T05 uses the recommended “Zikr drag Svemilosnom” pair; its alternative is retained below for reference only.

## Naming approach

- Prefer **“Zikr za…” / “Dhikr for…”** for a clear purpose or an established benefit.
- Keep titles distinct: forgiveness, repentance, glorification, praise and protection should remain easy to tell apart.
- Keep repetition counts and detailed rewards in the existing instructions. These titles are editorial labels, not quotations or new instructions.
- Use descriptive wording for the beloved phrases, the treasure of Paradise and enduring value. Keep both parts of the card containing the best supplication and the best remembrance visible in its title.

## Before and implemented titles

### T01 - Seeking forgiveness and repentance

Card: `hisn-248`. **Recommendation: Use new.**

**BS old:** Traženje oprosta i pokajanje

**BS new:** Zikr za oprost i pokajanje

**EN old:** Seeking forgiveness and repentance

**EN new:** Dhikr for forgiveness and repentance

**Why:** Adds the preferred wording while preserving both forgiveness and repentance.

**Source:** [Bukhari 6307](https://sunnah.com/bukhari:6307).

### T02 - Dhikr for forgiveness

Card: `hisn-250`. **Recommendation: Keep current.**

**BS old:** Zikr za oprost grijeha

**BS new:** Zikr za oprost grijeha

**EN old:** Dhikr for forgiveness

**EN new:** Dhikr for forgiveness

**Why:** Already clear and consistent with the preferred style. T01 retains “pokajanje” to distinguish the two cards.

**Source:** [Abu Dawud 1517](https://sunnah.com/abudawud:1517).

### T03 - Declaration of Allah’s oneness

Card: `bukhari-6403`. **Recommendation: Use new.**

**BS old:** Tevhid

**BS new:** Zikr za zaštitu od šejtana

**EN old:** Declaration of Allah’s oneness

**EN new:** Dhikr for protection from Satan

**Why:** Gives a useful purpose in familiar language. The source explicitly mentions this protection with 100 daily recitations; that count and the other benefits remain in the existing instruction.

**Source:** [Bukhari 6403](https://sunnah.com/bukhari:6403).

### T04 - Glorifying and praising Allah

Card: `hisn-254`. **Recommendation: Use new.**

**BS old:** Slavljenje Allaha i zahvala

**BS new:** Zikr za slavljenje Allaha i zahvalu

**EN old:** Glorifying and praising Allah

**EN new:** Dhikr for glorifying and praising Allah

**Why:** Uses “Zikr za…” naturally and describes the recitation. This also avoids giving several different cards the same forgiveness title.

**Source:** [Hisn al-Muslim 254](https://sunnah.com/hisn:254).

### T05 - Two beloved phrases

Card: `hisn-256`. **Recommendation: Use new.**

**BS old:** Dvije lahke riječi

**BS new:** Zikr drag Svemilosnom

**EN old:** Two beloved phrases

**EN new:** Dhikr beloved to the Most Merciful

**Why:** Gives the title a warmer, clearer focus using the description in the hadith. A descriptive title fits this virtue naturally.

**Alternative BS:** Zikr težak na Vagi

**Alternative EN:** Dhikr that weighs heavily on the Scale

The alternative highlights another virtue from the same narration. The recommended pair emphasizes being beloved to the Most Merciful.

**Source:** [Bukhari 6406](https://sunnah.com/bukhari:6406).

### T06 - Four beloved phrases

Card: `hisn-257`. **Recommendation: Use new.**

**BS old:** Allahu najdraže četiri riječi

**BS new:** Četiri Allahu najdraže riječi

**EN old:** Four beloved phrases

**EN new:** Four words most beloved to Allah

**Why:** Uses a more natural Bosnian word order and makes the English equally specific. Keeping “četiri / four” helps distinguish this card from T05.

**Source:** [Muslim 2137a](https://sunnah.com/muslim:2137a).

### T07 - Tasbih for forgiveness

Card: `hisn-258`. **Recommendation: Use new.**

**BS old:** Tesbih za brisanje grijeha

**BS new:** Zikr za brisanje grijeha

**EN old:** Tasbih for forgiveness

**EN new:** Dhikr for erasing sins

**Why:** A small change that matches the preferred label. “Brisanje / erasing” also distinguishes this from T02 while reflecting the narration.

**Source:** [Muslim 2698](https://sunnah.com/muslim:2698).

### T08 - A palm tree in Paradise

Card: `hisn-259`. **Recommendation: Use new.**

**BS old:** Palma u Džennetu

**BS new:** Zikr za slavljenje Uzvišenog Allaha

**EN old:** A palm tree in Paradise

**EN new:** Dhikr for glorifying Allah, the Most Great

**Why:** Describes the recited words. The palm-tree reward remains in the existing note, with its source discussion preserved in the instruction review. The title adds no further reward claim.

**Source:** [Hisn al-Muslim 259](https://sunnah.com/hisn:259). See also [the accepted instruction review, P36](instructions-wording-plan.md).

### T09 - A treasure of Paradise

Card: `hisn-260`. **Recommendation: Use new.**

**BS old:** Jedna od džennetskih riznica

**BS new:** Zikr iz džennetskih riznica

**EN old:** A treasure of Paradise

**EN new:** A dhikr from the treasures of Paradise

**Why:** Keeps the recognisable description from the source and makes clear that the card contains a dhikr.

**Source:** [Bukhari 6384](https://sunnah.com/bukhari:6384).

### T10 - The best supplication and remembrance

Card: `hisn-264`. **Recommendation: Keep current.**

**BS old:** Najbolja dova i najbolji zikr

**BS new:** Najbolja dova i najbolji zikr

**EN old:** The best supplication and remembrance

**EN new:** The best supplication and remembrance

**Why:** The card contains two sayings: one identified as the best supplication and the other as the best remembrance. The current title covers both clearly.

**Source:** [Tirmidhi 3383](https://sunnah.com/tirmidhi:3383).

### T11 - Enduring good deeds

Card: `hisn-265`. **Recommendation: Use new.**

**BS old:** Trajno vrijedne riječi

**BS new:** Zikr trajne vrijednosti

**EN old:** Enduring good deeds

**EN new:** Dhikr of lasting value

**Why:** A short, natural title preserving the existing theme of enduring value. BS and EN now use the same editorial wording.

**Source:** [Hisn al-Muslim 265](https://sunnah.com/hisn:265).

## Implementation and verification

Updated only the 9 accepted BS/EN title pairs in [dhikr.data.ts](../../src/app/features/duas/dhikr.data.ts). T02 keeps the existing `fromDua` title override, so the Duas title “Dova za oprost grijeha” stays independent.

All 11 title pairs were checked against this review. A before/after catalogue comparison confirmed that all non-title dhikr fields and the entire Duas catalogue are unchanged.

The existing integration test now covers the new protection title in both BS and EN, the broader forgiveness-title search results, and the existing bookmark behavior. **All 10 focused dua-page/search tests and the production build passed.** The build reports the existing CSS budget and CommonJS dependency warnings.
