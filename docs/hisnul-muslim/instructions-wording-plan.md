# Dua and dhikr instructions: BS / EN wording plan

Implemented from the accepted review - 9 November 2026. All 36 rewrites and additions A01/A03 are applied; A02 remains omitted.

This plan covers every existing instruction passage across the current 113 dua cards and 11 dhikr cards. There are 39 distinct passages: the forgiveness note for `hisn-250` is shared between the two pages. Arabic, transcription, meanings and titles are outside this wording proposal.

## Accepted scope

- **P01-P39:** 36 rewrites applied and 3 notes kept. Every entry retains the exact old BS/EN text and the accepted new BS/EN text.
- **A01 and A03:** accepted additions, now implemented. **A02 remains omitted following the review comment:** no extra food instruction was added.
- The old/new comparisons below are retained as the implementation record.
- Entries marked **source clarification** change more than phrasing: **P16, P21, P23 and P24**. A source-grading question is marked on **P36**.
- Benefits requested in the comments are included in **P15, P21, P24 and P31**. The three unchanged notes are **P25, P38 and P39**.

## Proposed writing style

- Use impersonal wording without directly addressing the reader. Bosnian uses infinitives: **Proučiti**, **Izgovoriti**, **Staviti**, **Okrenuti se**. English uses neutral phrasing such as **This is recited**, **These words are said** and **The hand is placed**.
- Use visible numbers for repetition: **3 puta / 3 times**, **7 puta / 7 times**, **100 puta dnevno / 100 times a day**. Say **svaki / each** when the count applies to each phrase.
- Aim for one clear sentence. Keep a second sentence when a sequence or a useful virtue needs it. Do not add an instruction that merely repeats the title.
- Keep BS and EN equivalent. Preserve conditions, counts and sequence. Reported practices and virtues remain neutral statements; do not turn them into commands or invent a repetition count.
- Add **ﷺ** after mentions of the Prophet in proposed BS and EN text, replacing the written-out honorific where present. The old-text quotations remain exact.
- These are editorial summaries, not verbatim hadith quotations. Where a proposed note shortens reward details, that is called out so you can choose the fuller old note.

## Existing instructions: before and implemented

## Adhan / Ezan

### P01 - Odgovor pri slušanju ezana (passage 1)

**Responding to the adhan. Recommendation: Use suggested wording.**

Card: `hisn-22`; saying 1 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/adhan.data.ts#L14).

**BS old:** Ponavljaj za mujezinom sve riječi ezana osim ovih:

**BS new:** Ponavljati riječi ezana za mujezinom, osim ova dva poziva:

**EN old:** Repeat the caller's words, except these:

**EN new:** The words of the adhan are repeated after the caller, except these two calls:

**Why:** Names the two exceptions clearly and uses impersonal wording.

**Sources:** [Hisn al-Muslim 22](https://sunnah.com/hisn:22).

### P02 - Odgovor pri slušanju ezana (passage 2)

**Responding to the adhan. Recommendation: Use suggested wording.**

Card: `hisn-22`; saying 2 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/adhan.data.ts#L29).

**BS old:** Kada čuješ ove riječi, umjesto njih odgovori:

**BS new:** Na svaki od ova dva poziva odgovoriti ovim riječima:

**EN old:** When you hear these words, reply instead:

**EN new:** Each of these two calls is answered with these words:

**Why:** Clarifies that this is the response to each of the two calls above.

**Sources:** [Hisn al-Muslim 22](https://sunnah.com/hisn:22).

## Prayer / Namaz

### P03 - Početna dova u namazu

**Opening supplication in prayer. Recommendation: Use suggested wording.**

Card: `hisn-28`. [Current text](../../src/app/features/duas/salat.data.ts#L12).

**BS old:** Prouči nakon početnog tekbira, prije učenja Kur’ana u namazu.

**BS new:** Proučiti nakon početnog tekbira, prije učenja Kur’ana u namazu.

**EN old:** Recite after the opening takbir, before reciting the Quran in prayer.

**EN new:** This is recited after the opening takbir, before reciting the Quran in prayer.

**Why:** Uses impersonal wording while preserving the timing.

**Sources:** [Hisn al-Muslim 28](https://sunnah.com/hisn:28).

### P04 - Dova na rukūu

**Remembrance while bowing. Recommendation: Use suggested wording.**

Card: `hisn-33`. [Current text](../../src/app/features/duas/salat.data.ts#L33).

**BS old:** Proučiti tri puta na pregibanju u namazu.

**BS new:** Na rukuu proučiti 3 puta.

**EN old:** Recite three times while bowing in prayer.

**EN new:** This is recited 3 times while bowing in prayer.

**Why:** Keeps the impersonal infinitive, simplifies the phrasing and makes the count easy to scan.

**Sources:** [Hisn al-Muslim 33](https://sunnah.com/hisn:33).

### P05 - Dova na sedždi

**Remembrance while prostrating. Recommendation: Use suggested wording.**

Card: `hisn-41`. [Current text](../../src/app/features/duas/salat.data.ts#L92).

**BS old:** Proučiti tri puta na sedždi.

**BS new:** Na sedždi proučiti 3 puta.

**EN old:** Recite three times while prostrating in prayer.

**EN new:** This is recited 3 times while prostrating in prayer.

**Why:** Keeps the impersonal infinitive and makes the count easy to scan.

**Sources:** [Hisn al-Muslim 41](https://sunnah.com/hisn:41).

## After prayer / Poslije namaza

### P06 - Dove poslije namaza (passage 1)

**Dua after prayer. Recommendation: Use suggested wording.**

Card: `hisn-66`; saying 1 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/after-prayer.data.ts#L16).

**BS old:** Nakon predaje selama prouči tri puta.

**BS new:** Nakon selama proučiti 3 puta.

**EN old:** After the salam, recite three times.

**EN new:** This is recited 3 times after the salam.

**Why:** Shortens the wording while keeping the timing and count.

**Sources:** [Hisn al-Muslim 66](https://sunnah.com/hisn:66).

### P07 - Dove poslije namaza (passage 4)

**Dua after prayer. Recommendation: Use suggested wording.**

Card: `hisn-66`; saying 4 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/after-prayer.data.ts#L73).

**BS old:** Svaka se ponavlja 33 puta.

**BS new:** Svaki od ova 3 zikra proučiti 33 puta.

**EN old:** Each is recited 33 times.

**EN new:** Each of these 3 phrases is recited 33 times.

**Why:** Uses an impersonal infinitive and clarifies that 33 applies to each phrase, not the whole line.

**Review note:** Separate recited-text issue: HM69 also supplies a closing tahleel after the 33/33/33 phrases. That wording is missing here; do not claim this is the complete HM69 sequence until a separate recited-text review is approved.

**Sources:** [Hisn al-Muslim 69](https://sunnah.com/hisn:69).

### P08 - Dove poslije namaza (passage 5)

**Dua after prayer. Recommendation: Use suggested wording.**

Card: `hisn-66`; saying 5 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/after-prayer.data.ts#L97).

**BS old:** El-Ihlas: prouči jednom poslije podnevskog, ikindijskog i jacijskog namaza, a tri puta poslije sabahskog i akšamskog namaza.

**BS new:** Suru El-Ihlas proučiti 3 puta poslije sabaha i akšama, a jednom poslije podne, ikindije i jacije.

**EN old:** Al-Ikhlas: recite once after Dhuhr, Asr and Isha, and three times after Fajr and Maghrib.

**EN new:** Al-Ikhlas is recited 3 times after Fajr and Maghrib, and once after Dhuhr, Asr and Isha.

**Why:** Puts the exceptional count first and uses familiar prayer names.

**Sources:** [Hisn al-Muslim 70](https://sunnah.com/hisn:70).

### P09 - Dove poslije namaza (passage 6)

**Dua after prayer. Recommendation: Use suggested wording.**

Card: `hisn-66`; saying 6 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/after-prayer.data.ts#L126).

**BS old:** El-Felek: prouči jednom poslije podnevskog, ikindijskog i jacijskog namaza, a tri puta poslije sabahskog i akšamskog namaza.

**BS new:** Suru El-Felek proučiti 3 puta poslije sabaha i akšama, a jednom poslije podne, ikindije i jacije.

**EN old:** Al-Falaq: recite once after Dhuhr, Asr and Isha, and three times after Fajr and Maghrib.

**EN new:** Al-Falaq is recited 3 times after Fajr and Maghrib, and once after Dhuhr, Asr and Isha.

**Why:** Uses the same clear count-and-timing pattern as the preceding surah.

**Sources:** [Hisn al-Muslim 70](https://sunnah.com/hisn:70).

### P10 - Dove poslije namaza (passage 7)

**Dua after prayer. Recommendation: Use suggested wording.**

Card: `hisn-66`; saying 7 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/after-prayer.data.ts#L155).

**BS old:** En-Nas: prouči jednom poslije podnevskog, ikindijskog i jacijskog namaza, a tri puta poslije sabahskog i akšamskog namaza.

**BS new:** Suru En-Nas proučiti 3 puta poslije sabaha i akšama, a jednom poslije podne, ikindije i jacije.

**EN old:** An-Nas: recite once after Dhuhr, Asr and Isha, and three times after Fajr and Maghrib.

**EN new:** An-Nas is recited 3 times after Fajr and Maghrib, and once after Dhuhr, Asr and Isha.

**Why:** Uses the same clear count-and-timing pattern as the preceding surahs.

**Sources:** [Hisn al-Muslim 70](https://sunnah.com/hisn:70).

### P11 - Dove poslije namaza (passage 9)

**Dua after prayer. Recommendation: Use suggested wording.**

Card: `hisn-66`; saying 9 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/after-prayer.data.ts#L210).

**BS old:** Prouči deset puta poslije sabahskog i akšamskog namaza.

**BS new:** Poslije sabaha i akšama proučiti 10 puta.

**EN old:** Recite ten times after Fajr and Maghrib.

**EN new:** This is recited 10 times after Fajr and Maghrib.

**Why:** Shortens the prayer names and makes the count easy to scan.

**Sources:** [Hisn al-Muslim 72](https://sunnah.com/hisn:72).

### P12 - Dove poslije namaza (passage 10)

**Dua after prayer. Recommendation: Use suggested wording.**

Card: `hisn-66`; saying 10 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/after-prayer.data.ts#L234).

**BS old:** Prouči nakon predaje selama sabahskog farza.

**BS new:** Proučiti nakon predaje selama sabahskog farza.

**EN old:** Recite after the salam of the obligatory Fajr prayer.

**EN new:** This is recited after the salam of the obligatory Fajr prayer.

**Why:** Uses impersonal wording while preserving the timing.

**Sources:** [Hisn al-Muslim 73](https://sunnah.com/hisn:73).

## Istikharah / Istihara

### P13 - Dova istihare

**Istikharah supplication. Recommendation: Use suggested wording.**

Card: `hisn-74`. [Current text](../../src/app/features/duas/istikhara.data.ts#L12).

**BS old:** Kad te zaokupi odluka, klanjaj dva rekata neobaveznog namaza, zatim prouči dovu.

**BS new:** Pri donošenju odluke klanjati 2 rekata dobrovoljnog namaza, pa proučiti ovu dovu.

**EN old:** When deciding a matter, pray two rak‘ahs other than the obligatory prayer, then recite this supplication.

**EN new:** When making a decision, 2 rak‘ahs of voluntary prayer are offered, followed by this supplication.

**Why:** Uses natural impersonal wording and preserves the two voluntary rak‘ahs before the supplication.

**Sources:** [Bukhari 6382](https://sunnah.com/bukhari:6382).

## Sleep and dreams / Spavanje i snovi

### P14 - Dova prije spavanja

**Before sleeping. Recommendation: Use suggested wording.**

Card: `hisn-111`. [Current text](../../src/app/features/duas/sleep.data.ts#L12).

**BS old:** Kad se odlučiš ići u postelju, prethodno uzmi abdest kao za namaz, potom lezi na desni bok i prouči dovu:

**BS new:** Prije spavanja uzeti abdest kao za namaz, leći na desni bok i proučiti ovu dovu.

**EN old:** Before you go to bed perform ablutions as you would for prayer, then lie down on your right side and say. . .

**EN new:** Before sleeping, this supplication is recited after performing ablution as for prayer and lying on the right side.

**Why:** Removes awkward introductory wording and the unfinished English ellipsis without adding steps.

**Sources:** [Bukhari 247](https://sunnah.com/bukhari:247).

### P15 - Dova pri buđenju noću

**When waking during the night. Recommendation: Use suggested wording.**

Card: `hisn-2`. [Current text](../../src/app/features/duas/sleep.data.ts#L34).

**BS old:** Ako se probudiš noću, prouči ovu dovu i zamoli za oprost, bit će ti oprošteno. Ako uputiš dovu, bit će primljena. Ako uzmeš abdest i klanjaš nafilu, namaz će biti primljen.

**BS new:** Pri buđenju noću proučiti ovu dovu, pa zamoliti Allaha za oprost ili Mu uputiti vlastitu dovu. U hadisu se navode oprost i uslišana dova, te primljen namaz ako se nakon toga uzme abdest i klanja.

**EN old:** If you wake during the night, recite this dua and ask Allah for forgiveness, you will be forgiven. If you make a supplication, it will be answered. If you perform ablution and pray, your prayer will be accepted.

**EN new:** On waking during the night, this supplication is recited, followed by asking Allah for forgiveness or making a personal supplication. The hadith mentions forgiveness and an answered supplication, as well as acceptance of prayer if ablution and prayer follow.

**Why:** Restores the requested benefits while keeping the instruction impersonal. Acceptance of prayer remains conditional on performing ablution and praying afterwards.

**Sources:** [Bukhari 1154](https://sunnah.com/bukhari:1154) / [Hisn al-Muslim 2](https://sunnah.com/hisn:2).

### P16 - Dova poslije ružnog snoviđenja

**After a bad dream. Recommendation: Use suggested wording.** **Source clarification.**

Card: `hisn-114`. [Current text](../../src/app/features/duas/sleep.data.ts#L53).

**BS old:** Onaj ko sanja san koji mu nije drag neka ga ne priča nikome. Neka u lijevu stranu puhne tri puta, potom prouči ovu dovu tri puta i prevrne se na drugu stranu.

**BS new:** Nakon ružnog sna 3 puta lagano pljucnuti ulijevo i 3 puta zatražiti Allahovu zaštitu od šejtana i zla sna. Ne pričati san nikome i okrenuti se na drugi bok.

**EN old:** Whoever has a dream they dislike should not tell anyone about it. They should blow to their left three times, then recite this dua three times and turn onto their other side.

**EN new:** After a bad dream, the practice is to spit lightly to the left 3 times and seek Allah’s protection from Satan and the dream’s evil 3 times. The dream is not shared with anyone, and the sleeping position is changed to the other side.

**Why:** Uses impersonal wording and restores the object of seeking protection stated in the source.

**Review note:** Source clarification, not style-only: the current Arabic card only says “I seek refuge in Allah”; the source gives an action without fixing that short wording as the entire formula. Review this wording separately. “Lightly spit” makes the action more precise than plain “blow”.

**Sources:** [Hisn al-Muslim 114](https://sunnah.com/hisn:114) / [Muslim 2262](https://sunnah.com/muslim:2262) / [Muslim 2261a](https://sunnah.com/muslim:2261a).

## Illness / Bolest

### P17 - Dova pri tjelesnoj boli (passage 1)

**For bodily pain. Recommendation: Use suggested wording.**

Card: `hisn-243`; saying 1 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/illness.data.ts#L13).

**BS old:** Stavi ruku na površinu tijela gdje osjećaš bol. Izgovori tri puta.

**BS new:** Staviti ruku na bolno mjesto i izgovoriti ovo 3 puta.

**EN old:** Place your hand on the painful area. Say this three times.

**EN new:** The hand is placed on the painful area, and these words are said 3 times.

**Why:** Joins two short steps naturally and uses a visible count.

**Sources:** [Muslim 2202](https://sunnah.com/muslim:2202).

### P18 - Dova pri tjelesnoj boli (passage 2)

**For bodily pain. Recommendation: Use suggested wording.**

Card: `hisn-243`; saying 2 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/illness.data.ts#L22).

**BS old:** Zatim izgovori sedam puta.

**BS new:** Zatim izgovoriti ovo 7 puta.

**EN old:** Then say this seven times.

**EN new:** Then these words are said 7 times.

**Why:** Uses impersonal wording while preserving the sequence and count.

**Sources:** [Muslim 2202](https://sunnah.com/muslim:2202).

### P19 - Dova za ozdravljenje bolesnika

**For the sick person’s recovery. Recommendation: Use suggested wording.**

Card: `hisn-148`. [Current text](../../src/app/features/duas/illness.data.ts#L62).

**BS old:** Prilikom posjete bolesniku prouči ovu dovu sedam puta.

**BS new:** Pri posjeti bolesniku proučiti ovu dovu 7 puta.

**EN old:** Recite seven times when visiting someone who is ill.

**EN new:** This supplication is recited 7 times when visiting someone who is ill.

**Why:** Uses a short, impersonal introduction and preserves the seven recitations.

**Sources:** [Hisn al-Muslim 148](https://sunnah.com/hisn:148).

### P20 - Podsjećanje čovjeka na samrti da izgovori šehadet

**Instruction for the one nearing death. Recommendation: Use suggested wording.**

Card: `hisn-153`. [Current text](../../src/app/features/duas/illness.data.ts#L103).

**BS old:** Ući će u Džennet onaj čije posljednje riječi budu:

**BS new:** Poslanik ﷺ je rekao da će onaj kome ove riječi budu posljednje ući u Džennet.

**EN old:** Will enter Paradise he whose last words are:

**EN new:** The Prophet ﷺ said that whoever dies with these as their last words will enter Paradise.

**Why:** Repairs the inverted English and keeps this as an attributed report, without inventing repetitions or instructions to pressure a dying person.

**Sources:** [Abu Dawud 3116](https://sunnah.com/abudawud:3116).

## Protection / Zaštita

### P21 - Dova za zaštitu Allahovim imenom

**Protection through Allah's name. Recommendation: Use suggested wording.** **Source clarification.**

Card: `hisn-86`. [Current text](../../src/app/features/duas/protection.data.ts#L197).

**BS old:** Ko ovu dovu prouči tri puta ujutro, neće ga zadesiti nikakva nedaća do večeri, a ko je prouči tri puta navečer, neće ga zadesiti nikakva nedaća do jutra.

**BS new:** Proučiti ovu dovu 3 puta ujutro i 3 puta navečer. U hadisu se navodi da jutarnje učenje štiti od iznenadne nedaće do večeri, a večernje do jutra.

**EN old:** Whoever recites this supplication three times in the morning will not face a calamity until evening, and whoever recites it three times in the evening will not face a calamity until morning.

**EN new:** This supplication is recited 3 times in the morning and 3 times in the evening. The hadith mentions protection from sudden affliction until evening after the morning recitation, and until morning after the evening recitation.

**Why:** Restores the requested benefit after the count and timing. “Sudden affliction / iznenadna nedaća” follows the wording of Abu Dawud 5088 more closely than the old general reference to calamity.

**Sources:** [Abu Dawud 5088](https://sunnah.com/abudawud:5088).

## Hajj and Umrah / Hadž i umra

### P22 - Dova prilikom boravka na Saffi i Mervi (passage 1)

**At Safa and Marwah. Recommendation: Use suggested wording.**

Card: `hisn-236`; saying 1 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/hajj.data.ts#L34).

**BS old:** Kada se približiš Saffi, prouči ovaj ajet:

**BS new:** Pri približavanju Saffi proučiti ovaj ajet:

**EN old:** As you approach Safa, recite this verse:

**EN new:** This verse is recited when approaching Safa:

**Why:** Uses impersonal wording while preserving the context.

**Sources:** [Hisn al-Muslim 236](https://sunnah.com/hisn:236).

### P23 - Dova prilikom boravka na Saffi i Mervi (passage 2)

**At Safa and Marwah. Recommendation: Use suggested wording.** **Source clarification.**

Card: `hisn-236`; saying 2 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/hajj.data.ts#L50).

**BS old:** Na Saffi se okreni prema Kibli i prouči ovu dovu, i nakon nje uputi svoju dovu, tako učini tri puta. Isto učiniti i na Mervi.

**BS new:** Na Saffi se okrenuti prema Kibli i proučiti ovaj zikr 3 puta, a između ponavljanja uputiti vlastite dove. Isto učiniti na Mervi.

**EN old:** At Safa, face the Qiblah and recite this dua, and after it make your own dua, do this three times. Do the same at Marwah.

**EN new:** At Safa, this dhikr is recited 3 times while facing the Qiblah, with personal supplications between repetitions. The same is done at Marwah.

**Why:** Clarifies the sequence and uses impersonal infinitives throughout.

**Review note:** Source clarification: current wording places own duas after every repetition; the Arabic report specifies supplications between the repetitions. Do not imply that three complete cycles, each ending with a personal dua, are required.

**Sources:** [Hisn al-Muslim 236](https://sunnah.com/hisn:236) / [Muslim 1218a](https://sunnah.com/muslim:1218a).

## Forgiveness / Oprost

### P24 - Dova nakon počinjenog grijeha

**After committing a sin. Recommendation: Use suggested wording.** **Source clarification.**

Card: `hisn-140`. [Current text](../../src/app/features/duas/forgiveness.data.ts#L12).

**BS old:** Svakome vjerniku koji počini grijeh, pa potom lijepo uzme abdest, klanja dva rekata i zatim zamoli Allaha za oprost ovim riječima, Allah mu oprosti počinjeni grijeh.

**BS new:** Nakon počinjenog grijeha lijepo uzeti abdest, klanjati 2 rekata, pa zamoliti Allaha za oprost. U hadisu se navodi da Allah tada oprašta počinjeni grijeh.

**EN old:** After committing a sin, perform ablution well, pray two rak‘ahs, then ask Allah for forgiveness.

**EN new:** After committing a sin, ablution is performed well, 2 rak‘ahs are offered, and Allah’s forgiveness is sought. The hadith states that Allah then forgives the sin.

**Why:** Restores the requested forgiveness benefit in both languages. The sequence remains clear without suggesting that the source prescribes this exact spoken formula.

**Review note:** This is also a source clarification: the current BS wording overstates the role of the exact displayed words. The proposed note gives the actions without claiming a specific formula.

**Sources:** [Abu Dawud 1521](https://sunnah.com/abudawud:1521).

### P25 - Zikr za oprost grijeha

**Dhikr for forgiveness. Recommendation: Keep current text.**

Card: `hisn-250`. [Current text](../../src/app/features/duas/forgiveness.data.ts#L28).

**BS old:** Onome ko izgovori ovaj zikr Allah će oprostiti čak i ako je utekao sa bojnoga polja.

**BS new:** Onome ko izgovori ovaj zikr Allah će oprostiti čak i ako je utekao sa bojnoga polja.

**EN old:** Whoever says this will be forgiven, even if they fled from the battlefield.

**EN new:** Whoever says this will be forgiven, even if they fled from the battlefield.

Already clear and readable; no change recommended.

**Shared note:** the same source record appears in Duas as “Dova za oprost grijeha” and in Dhikr as “Zikr za oprost grijeha”. Apply an accepted change once in `forgiveness.data.ts`.

**Sources:** [Abu Dawud 1517](https://sunnah.com/abudawud:1517).

## General / Opće

### P26 - Dova prilikom kihanja (passage 1)

**Upon sneezing. Recommendation: Use suggested wording.**

Card: `hisn-188`; saying 1 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/general.data.ts#L114).

**BS old:** Kad kihneš, reci:

**BS new:** Pri kihanju izgovoriti:

**EN old:** When you sneeze, say:

**EN new:** Upon sneezing, these words are said:

**Why:** Uses impersonal wording while keeping the instruction short.

**Sources:** [Hisn al-Muslim 188](https://sunnah.com/hisn:188).

### P27 - Dova prilikom kihanja (passage 2)

**Upon sneezing. Recommendation: Use suggested wording.**

Card: `hisn-188`; saying 2 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/general.data.ts#L121).

**BS old:** Kada druga osoba čuje da neko kihne i zahvali Allahu, neka uzvrati:

**BS new:** Kada neko kihne i zahvali Allahu, odgovoriti ovim riječima:

**EN old:** When someone sneezes and praises Allah, reply:

**EN new:** These words are said in response to someone who sneezes and praises Allah:

**Why:** Keeps the condition clear without directly addressing the reader.

**Sources:** [Hisn al-Muslim 188](https://sunnah.com/hisn:188).

### P28 - Dova prilikom kihanja (passage 3)

**Upon sneezing. Recommendation: Use suggested wording.**

Card: `hisn-188`; saying 3 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/general.data.ts#L130).

**BS old:** Naposljetku osoba koja je kihnula neka uzvrati sa:

**BS new:** Nakon kihanja uzvratiti na odgovor druge osobe:

**EN old:** When someone responds to your sneeze with “Yarḥamukallāh”, say:

**EN new:** The person who sneezed then replies:

**Why:** Removes the repeated phrase already shown above while retaining the reply sequence and impersonal wording.

**Sources:** [Hisn al-Muslim 188](https://sunnah.com/hisn:188).

### P29 - Dova kada se dogodi nešto nepoželjno

**When something unwelcome happens. Recommendation: Use suggested wording.**

Card: `hisn-144`. [Current text](../../src/app/features/duas/general.data.ts#L219).

**BS old:** Kad te nešto zadesi, ne reci „Da učinih tako i tako”, nego prouči ovu dovu.

**BS new:** Kada se dogodi nešto nepoželjno, ne govoriti „Da je bilo ovako ili onako…”, nego proučiti ovu dovu.

**EN old:** When a setback occurs, do not say “If only I had done such and such”, rather say this supplication.

**EN new:** When something unwelcome happens, this supplication is recited instead of saying, “If only things had been done differently…”.

**Why:** Replaces archaic phrasing with a familiar expression while preserving the source’s instruction.

**Sources:** [Hisn al-Muslim 144](https://sunnah.com/hisn:144).

## Dhikr / Zikrovi

### P30 - Traženje oprosta i pokajanje

**Seeking forgiveness and repentance. Recommendation: Use suggested wording.**

Card: `hisn-248`. [Current text](../../src/app/features/duas/dhikr.data.ts#L25).

**BS old:** Poslanik, sallallahu alejhi ve sellem, kazao je da više od sedamdeset puta dnevno traži oprost od Allaha i kaje Mu se.

**BS new:** Poslanik ﷺ tražio je oprost od Allaha i kajao Mu se više od 70 puta dnevno.

**EN old:** The Prophet said that he sought Allah’s forgiveness and repented to Him more than seventy times each day.

**EN new:** The Prophet ﷺ sought Allah’s forgiveness and turned to Him in repentance more than 70 times a day.

**Why:** Use a simpler report and a scannable number. Preserve this as a reported practice rather than a prescribed count.

**Sources:** [Bukhari 6307](https://sunnah.com/bukhari:6307).

### P31 - Tevhid

**Declaration of Allah’s oneness. Recommendation: Use suggested wording.**

Card: `bukhari-6403`. [Current text](../../src/app/features/duas/dhikr.data.ts#L51).

**BS old:** Prouči stotinu puta dnevno. U predaji se navodi nagrada kao za oslobađanje deset robova, upisivanje stotinu dobrih djela, brisanje stotinu loših djela i zaštita od šejtana toga dana sve dok noć ne nastupi. Niko ne može učiniti nešto vrednije od toga, osim onoga koji ove riječi izgovori više puta.

**BS new:** Proučiti ovo 100 puta dnevno. U hadisu se navode nagrada kao za oslobađanje 10 robova, upisivanje 100 dobrih djela, brisanje 100 grijeha i zaštita od šejtana do večeri.

**EN old:** Recite one hundred times a day. The narration promises a reward equal to freeing ten slaves, one hundred good deeds recorded, one hundred misdeeds erased, and protection from Satan until evening. Only someone who does more can surpass this reward.

**EN new:** This is recited 100 times a day. The hadith mentions a reward equivalent to freeing 10 slaves, 100 good deeds recorded, 100 sins erased, and protection from Satan until evening.

**Why:** Restores the requested reward equivalent to freeing 10 slaves, alongside the other benefits already included.

**Sources:** [Bukhari 6403](https://sunnah.com/bukhari:6403).

### P32 - Slavljenje Allaha i zahvala

**Glorifying and praising Allah. Recommendation: Use suggested wording.**

Card: `hisn-254`. [Current text](../../src/app/features/duas/dhikr.data.ts#L76).

**BS old:** Prouči stotinu puta na dan. Onome ko tako izgovori bit će skinuti (umanjeni) grijesi makar da su veličine morske pjene.

**BS new:** Proučiti ovo 100 puta dnevno. U hadisu se navodi oprost grijeha, makar ih bilo poput morske pjene.

**EN old:** Recite one hundred times a day. The narration states that doing so brings forgiveness of sins, even if they are as abundant as sea foam.

**EN new:** This is recited 100 times a day. The hadith describes forgiveness of sins, even if they are as abundant as sea foam.

**Why:** Replace the awkward parenthetical wording with a plain, attributed summary and use digits for the count.

**Sources:** [Bukhari 6405](https://sunnah.com/bukhari:6405).

### P33 - Dvije lahke riječi

**Two beloved phrases. Recommendation: Use suggested wording.**

Card: `hisn-256`. [Current text](../../src/app/features/duas/dhikr.data.ts#L101).

**BS old:** Ove dvije riječi lahke su na jeziku, teške na Vagi i drage Svemilosnom.

**BS new:** Ove dvije riječi su lahke na jeziku, teške na Vagi i drage Svemilosnom.

**EN old:** These two phrases are easy to say, heavy on the Scale, and beloved to the Most Merciful.

**EN new:** These two phrases are easy to say, heavy on the Scale, and beloved to the Most Merciful.

**Why:** Retains the review edit adding “su” in Bosnian. The English wording is unchanged.

**Sources:** [Bukhari 6406](https://sunnah.com/bukhari:6406).

### P34 - Allahu najdraže četiri riječi (passage 1)

**Four beloved phrases. Recommendation: Use suggested wording.**

Card: `hisn-257`; saying 1 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/dhikr.data.ts#L130).

**BS old:** Allahu su najdraže ove četiri riječi. Možeš početi bilo kojom od njih. Poslanik, sallallahu alejhi ve sellem, kazao je da mu je njihovo izgovaranje draže nego sve ono što sunce obasja.

**BS new:** Ove četiri riječi Allahu su najdraže i može se početi bilo kojom od njih. Poslaniku ﷺ bile su draže od svega što sunce obasja.

**EN old:** These four phrases are the most beloved words to Allah, and you may begin with any of them. The Prophet said they were dearer to him than everything the sun shines upon.

**EN new:** These four phrases are the words most beloved to Allah, and recitation may begin with any of them. The Prophet ﷺ said they were dearer to him than everything the sun shines upon.

**Why:** Combine the introductory sentences and shorten the indirect speech. Preserve both sourced virtues and the freedom to begin with any phrase.

**Sources:** [Muslim 2137a](https://sunnah.com/muslim:2137a) / [Muslim 2695](https://sunnah.com/muslim:2695).

### P35 - Tesbih za brisanje grijeha

**Tasbih for forgiveness. Recommendation: Use suggested wording.**

Card: `hisn-258`. [Current text](../../src/app/features/duas/dhikr.data.ts#L170).

**BS old:** Prouči stotinu puta dnevno. Bit će ti upisano hiljadu dobrih djela ili pobrisano hiljadu ružnih djela koja si počinio.

**BS new:** Proučiti ovo 100 puta dnevno. U hadisu se navodi da se za to upisuje 1.000 dobrih djela ili briše 1.000 grijeha.

**EN old:** Recite one hundred times a day. The narration states that one thousand good deeds will be recorded, or one thousand sins erased.

**EN new:** This is recited 100 times a day. The hadith describes 1,000 good deeds being recorded or 1,000 sins being erased.

**Why:** Use digits, remove the long relative clause, and retain ili/or from the Arabic source.

**Review note:** The Arabic and Hisn al-Muslim use “ili/or”; this proposal retains that wording. The linked Muslim page's English rendering uses “and”.

**Sources:** [Muslim 2698](https://sunnah.com/muslim:2698) / [Hisn al-Muslim 258](https://sunnah.com/hisn:258).

### P36 - Palma u Džennetu

**A palm tree in Paradise. Recommendation: Use suggested wording.**

Card: `hisn-259`. [Current text](../../src/app/features/duas/dhikr.data.ts#L192).

**BS old:** Onome ko izgovori ove riječi u Džennetu će biti zasađena palma.

**BS new:** U predaji se navodi da će onome ko izgovori ove riječi u Džennetu biti zasađena palma.

**EN old:** The narration states that whoever says this will have a date palm planted for them in Paradise.

**EN new:** The narration mentions a date palm being planted in Paradise for whoever says these words.

**Why:** Keep the virtue as an attributed report in both languages. Do not add a count or turn it into a stronger guarantee.

**Review note:** Separate source decision: grading disagreement exists. This wording proposal preserves attribution; it is not a declaration that grading is undisputed. Do not expand the reward claim without a chosen source/grading policy.

**Sources:** [Hisn al-Muslim 259](https://sunnah.com/hisn:259) / [Tirmidhi 3464](https://sunnah.com/tirmidhi:3464).

### P37 - Jedna od džennetskih riznica

**A treasure of Paradise. Recommendation: Use suggested wording.**

Card: `hisn-260`. [Current text](../../src/app/features/duas/dhikr.data.ts#L217).

**BS old:** Poslanik, sallallahu alejhi ve sellem, podučio je Abdullaha, sina Kajsova, ovim riječima i nazvao ih jednom od džennetskih riznica.

**BS new:** Poslanik ﷺ nazvao je ove riječi jednom od džennetskih riznica.

**EN old:** The Prophet taught these words to Abdullah ibn Qays, describing them as one of the treasures of Paradise.

**EN new:** The Prophet ﷺ described these words as one of the treasures of Paradise.

**Why:** Remove the biographical detail from the instruction note; retain the short, meaningful virtue. No artificial repetition count is needed.

**Sources:** [Bukhari 6384](https://sunnah.com/bukhari:6384).

### P38 - Najbolja dova i najbolji zikr (passage 1)

**The best supplication and remembrance. Recommendation: Keep current text.**

Card: `hisn-264`; saying 1 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/dhikr.data.ts#L244).

**BS old:** U predaji se ove riječi navode kao najbolja dova.

**BS new:** U predaji se ove riječi navode kao najbolja dova.

**EN old:** The narration describes these words as the best supplication.

**EN new:** The narration describes these words as the best supplication.

Already clear and readable; no change recommended.

**Sources:** [Tirmidhi 3383](https://sunnah.com/tirmidhi:3383).

### P39 - Najbolja dova i najbolji zikr (passage 2)

**The best supplication and remembrance. Recommendation: Keep current text.**

Card: `hisn-264`; saying 2 (counted from 1, including passages without instructions). [Current text](../../src/app/features/duas/dhikr.data.ts#L253).

**BS old:** U predaji se ove riječi navode kao najbolji spomen Allaha.

**BS new:** U predaji se ove riječi navode kao najbolji spomen Allaha.

**EN old:** The narration describes these words as the best remembrance of Allah.

**EN new:** The narration describes these words as the best remembrance of Allah.

Already clear and readable; no change recommended.

**Sources:** [Tirmidhi 3383](https://sunnah.com/tirmidhi:3383).

## Additional instructions and omitted proposal

A01 and A03 now have the accepted BS/EN instructions. A02 records the decision to leave the card without an extra note.

### A01 - Dova poslije ezana

**Supplication after the adhan. Implemented addition.**

Card: `hisn-25`. [Current card](../../src/app/features/duas/adhan.data.ts#L48).

**BS old:** No instruction note.

**BS new:** Nakon ezana proučiti salavat na Poslanika ﷺ, pa ovu dovu.

**EN old:** No instruction note.

**EN new:** After the adhan, blessings are sent upon the Prophet ﷺ, followed by this supplication.

**Why:** Makes the timing plain: the salawat and this supplication follow the adhan.

**Review note:** “Responding to the adhan” meant repeating the mujezin during the adhan, with the two exceptions already covered by P01/P02. Muslim 384 then gives the sequence of salawat followed by asking Allah to grant al-Wasilah. The proposed card note uses “Nakon ezana / After the adhan” to avoid ambiguity. No particular salawat formula or repetition count is prescribed by that narration.

**Sources:** [Hisn al-Muslim 24](https://sunnah.com/hisn:24) / [Muslim 384](https://sunnah.com/muslim:384) / [Bukhari 611](https://sunnah.com/bukhari:611) / [Muslim 385](https://sunnah.com/muslim:385).

- [Hisn al-Muslim 24](https://sunnah.com/hisn:24): Verified: after responding to the adhan, send blessings upon the Prophet ﷺ.
- [Muslim 384](https://sunnah.com/muslim:384): Verified primary narration: respond to the adhan, send blessings upon the Prophet ﷺ, then ask Allah to grant him al-Wasilah.
- [Bukhari 611](https://sunnah.com/bukhari:611) / [Muslim 385](https://sunnah.com/muslim:385): responding means repeating the mujezin during the adhan, with the stated exceptions.

### A02 - Dova kada se sjetimo da smo počeli jesti

**When we remember that we started eating. Decision: No additional instruction.**

Card: `hisn-178-forgot`. [Current card](../../src/app/features/duas/food.data.ts#L40).

**BS old:** No instruction note.

**BS new:** Bez dodatne upute.

**EN old:** No instruction note.

**EN new:** No instruction note.

**Why:** Omitted following the review comment: the title gives enough context, so no extra instruction is proposed.

**Sources:** [Tirmidhi 1858](https://sunnah.com/tirmidhi:1858) / [Hisn al-Muslim 178](https://sunnah.com/hisn:178).

- [Tirmidhi 1858](https://sunnah.com/tirmidhi:1858): Graded Sahih on the source page; the Prophet ﷺ gives this wording for someone who forgot Bismillah at the start of eating.
- [Hisn al-Muslim 178](https://sunnah.com/hisn:178): The current card source explicitly says to use the wording when the forgotten opening is remembered.

### A03 - Dova pri povratku s puta

**When returning from a journey. Implemented addition.**

Card: `hisn-217`. [Current card](../../src/app/features/duas/travel.data.ts#L40).

**BS old:** No instruction note.

**BS new:** Pri povratku s puta proučiti ovu dovu na svakom uzvišenju.

**EN old:** No instruction note.

**EN new:** On the return journey, this supplication is recited at each elevated point.

**Why:** Optional: the title gives the return journey, but not the elevated-point context.

**Review note:** The displayed Arabic already includes three opening takbirs. Do not add “say takbir three times, then recite this whole card”, which could make the opening count six.

**Sources:** [Bukhari 2995](https://sunnah.com/bukhari:2995) / [Hisn al-Muslim 217](https://sunnah.com/hisn:217).

- [Bukhari 2995](https://sunnah.com/bukhari:2995): The narration reports the return-journey practice of the Prophet ﷺ at elevated places.
- [Hisn al-Muslim 217](https://sunnah.com/hisn:217): The current source says to begin at elevated points with three takbirs, then the return wording.

## Implementation and verification

1. Applied the accepted BS/EN strings to existing `instructions` fields in the category data files and `dhikr.data.ts`. The shared forgiveness entry remains reused. A02 is excluded.
2. Verified all 41 distinct instruction notes against this review. A before/after catalogue comparison confirmed that every other field, including Arabic, transcription, translations, sources and titles, is unchanged. The recited-text/source questions at P07 and P16 remain outside this change.
3. The existing dua-page and search tests passed: **10 tests**. The production build passed with CSS budget and CommonJS dependency warnings.
4. A mobile visual check could not be completed because no browser was available in the session. The existing tests verify instruction rendering in both BS and EN.

No blanket expansion is proposed for the remaining cards. The older [INSTRUCTION-REVIEW.md](INSTRUCTION-REVIEW.md) audited a smaller catalogue; this plan uses the currently active content.
