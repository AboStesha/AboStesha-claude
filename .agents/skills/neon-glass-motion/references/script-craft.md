# Script craft: from words to beats

The same engine makes a great film or a mediocre one depending on the words it is given. This is
the part of the job that matters most. Use it to turn any script, notes or website copy into 4–7
beats of five-word lines.

## Contents

1. The five rules
2. Weak vs strong
3. The cutting method, step by step
4. Worked example: the Meridian script (20 s, 9:16)
5. Line surgery: before and after
6. When the material is thin, long, or adjective-only
7. Numbers
8. Calls to action
9. Arabic scripts
10. Telling the user what you chose

---

## 1. The five rules

1. **Write for the ear, not the page.** Lines should sound like the product explained to a friend.
2. **Four to six ideas, maximum.** A 20-second film holds about five beats. If the script has
   twelve points, pick five and drop the rest (and say which you dropped).
3. **Lead with the sharpest line.** The first beat is the one people actually watch.
4. **Kill the adjectives.** "Powerful, intuitive, best-in-class platform" gives nothing to animate.
   "Deploy in nine seconds" does.
5. **Numbers are gold.** Concrete figures get their own `number` beat: a big number slamming in with
   a bloom. "40% fewer meetings" beats any adjective.

Plus the hard limit: **five words or fewer per on-screen line** (validate.py rejects six).

## 2. Weak vs strong

**Weak**
> Meridian is a comprehensive, enterprise-grade scheduling solution that leverages intelligent
> algorithms to optimise calendar management across your organisation.

**Strong**
> Meridian finds meeting times nobody hates. It reads every calendar in your team and picks the
> slot that costs the least. Cut 40% of your meetings. Free under ten people.

The second has four clean beats in it; the first has none. Beats hiding in the strong version:

| Idea in the script | Beat |
|---|---|
| "finds meeting times nobody hates" | opener: `type` bar or `title` — "Meeting times nobody hates." |
| "reads every calendar in your team" | `device` ui calendar — "Reads every team calendar" |
| "picks the slot that costs the least" | `rings` icon clock — "Picks the cheapest slot" |
| "Cut 40% of your meetings" | `number` — value "40%", label "fewer meetings" |
| "Free under ten people" | `endcard` — cta "Free under ten people" |

If a user hands you the weak version, you can still make a film, but tell them in one line what
would make it better (a number, what it actually does, who it is for). Do not fabricate claims.

## 3. The cutting method, step by step

1. **List every claim** in the material as a plain sentence (what it does, for whom, how, proof,
   where it works, price/offer).
2. **Score each claim**: concrete (a verb, an object, a number) beats abstract; unique beats
   generic ("works offline" beats "easy to use"); proof beats promise.
3. **Pick the beats**: the sharpest line (opener), how it works (1–2), proof (a number), where it
   works or breadth (optional), the offer (endcard). That is 4–6 ideas.
4. **Cut each to five words or fewer**, keeping the verb and the concrete noun. Drop "that",
   "which", "our", "your", "very", company name repetition, and hedges ("helps you to").
5. **Assign shots** (see `shot-library.md`): let the shot show what the line says.
6. **Time it**: opener and endcard get the longest holds; the number the shortest; nothing at the
   bottom of its range. Make the total land exactly on the requested duration.
7. **Read the beat sheet aloud in order.** It should sound like one confident sentence spread
   over 20 seconds.

## 4. Worked example: the Meridian script (20 s, 9:16)

User: "Make me a 20 second promo, 9:16. Here's the script: Meridian is a scheduling tool for
distributed teams. It finds meeting times that don't wreck anyone's morning. Works with Google and
Outlook. Free for teams under ten."

Claims: scheduling tool for distributed teams · finds times that don't wreck mornings · works with
Google and Outlook · free under ten. No number in the script: do not invent one. Four ideas plus
the endcard fits 20 s well.

| # | Time | Shot | On screen |
|---|---|---|---|
| 1 | 0.0–4.0 s | type (glass bar, calendar icon) | No more 7am meetings. |
| 2 | 4.0–8.2 s | device · calendar | Finds times across timezones |
| 3 | 8.2–12.0 s | rings · globe | Built for distributed teams |
| 4 | 12.0–16.0 s | orbit | Google · Outlook — "Works where you work" |
| 5 | 16.0–20.0 s | endcard | Meridian — "Free for teams under ten" — meridian.app |

Note how "don't wreck anyone's morning" became a concrete opener ("No more 7am meetings.") that
says the same thing with an image in it. That is fair: it restates the script's own claim. Adding
"40% fewer meetings" here would not be: the user never said it.

## 5. Line surgery: before and after

| Before | After (≤ 5 words) |
|---|---|
| Our platform helps you deploy your applications in under nine seconds | Deploy in nine seconds. |
| Seamlessly integrates with all your favourite tools | Works with your stack |
| Bank-grade security keeps your data safe | Encrypted end to end |
| Get started for free today, no credit card required | Free. No card needed. |
| An AI assistant that answers your customers 24/7 | Answers customers at 3am |
| We reduce your cloud bill significantly | Cut your cloud bill (then a `number` if they have the figure) |
| The all-in-one workspace for modern teams | Docs, chat, tasks. One place. (as a `stack` or `tiles`) |

Patterns: verbs first; one concrete object; specific time or place beats "anytime/anywhere";
break lists into `stack` lines or `tiles` labels instead of commas.

## 6. When the material is thin, long, or adjective-only

- **Only a product name or one vague line**: ask (in the same message as any missing duration or
  ratio) for 2–4 sentences on what it does and for whom, or a website URL. If the user says "just
  make it", work from what you have and keep claims generic but concrete in form (what it does,
  not how great it is).
- **Long script (8+ points)**: choose 4–6. Say which points you dropped in one line after the beat
  sheet, so the user can swap them back.
- **All adjectives**: find the verbs underneath ("intelligent scheduling" -> "picks the time for
  you"). If there is no proof, build the film on what the product does and end on the offer.
- **Several products or audiences**: one film, one product, one audience. Ask which, or pick the
  flagship and say so.

## 7. Numbers

- Use every real figure in the material (percentages, seconds, multipliers, prices, user counts,
  ratings). Each gets its own `number` beat; two numbers in a 30 s film is plenty.
- `value` <= 6 characters and plain: `40%`, `9s`, `10x`, `$0`, `2M+`, `4.9` (with label "App Store
  rating", not `4.9★`). The label says what it counts, in 1–4 words.
- Never invent, round up, or combine figures. "Up to 40%" becomes value `40%`, label "fewer
  meetings" only if "up to" is honest in context; otherwise put the qualifier in the label.
- A price is a number too ("$0" + "for small teams"), but "Free" as a word belongs in the endcard CTA.

## 8. Calls to action

The endcard `cta` is the offer or the next step, concrete and short: "Free under ten people",
"Download free on iOS", "Join the waitlist", "Start in 60 seconds". Avoid "Learn more", "Visit our
website", "Contact us". The URL sits separately (`brand.url`), so the CTA does not repeat it.

## 9. Arabic scripts

- Write lines in Arabic when the script is Arabic; the engine handles direction and font.
- The five-word limit counts Arabic words (particles attached to words count with their word:
  "وبسرعة" is one word).
- Prefer Modern Standard Arabic or the user's dialect consistently; do not mix within a film unless
  the user did.
- Figures in `value` count up in Western ("40%") or Arabic-Indic ("٤٠٪") digits; follow the
  user's own usage. Put the Arabic words in the label ("اجتماعات أقل").
- Product and integration names stay as the brand writes them ("Google", "Outlook"), even inside
  Arabic lines.
- Example beats: `type` bar "متى الكل فاضي؟" · `device` "يقرأ تقويم فريقك" · `number` "40%" /
  "اجتماعات أقل" · `endcard` cta "مجاني حتى عشرة أشخاص".

## 10. Telling the user what you chose

After the beat-sheet table, add at most three short lines: the palette/brand placement, anything
you dropped or assumed (duration/ratio defaults, a colour you chose), and "If the story is wrong,
tell me now." Do not explain the rules to the user unless they ask how to write a better script;
then give them sections 1 and 2 in their own words.
