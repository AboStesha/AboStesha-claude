# Axi Copy Trading: sourced fact sheet (for the Axi Iraq reel)

Accessed: 2026-10-20. Every fact below carries its source. Anything without a live source is listed under **Unverified / do not use on screen**.

Source key:

| ID | Source | Status |
|---|---|---|
| S1 | https://www.axi.com/int/copy-trading-app | Live (EN). Text pulled from the page HTML |
| S2 | https://www.axi.com/ar/copy-trading-app | Live (AR). Text and FAQ answers pulled verbatim from the page HTML payload |
| S3 | https://help.axi.com/en-US/axiv2--axicorp-prod/article/IAldXc9h ("What is Axi Copy Trading?") | Live. Linked from the S1 FAQ. Read through WebFetch (paraphrased) |
| S4 | https://help.axi.com/en-US/axiv2--axicorp-prod/article/N4qJOBBw ("How do I set up an account as a copier?") | Live. Read through WebFetch (paraphrased) |
| S5 | https://help.axi.com/en-US/axiv2--axicorp-prod/article/RmPHppoa ("Can I set my own fees as a Signal Provider?") | Live. Read through WebFetch (paraphrased) |
| S6 | https://help.axi.com/en-US/axiv2--axicorp-prod/article/o2qoHyga ("Can I see a Signal Provider's open trades before I copy them?") | Snippet embedded in the S1 FAQ |
| S7 | https://help.axi.com/en-US/axiv2--axicorp-prod/article/Jt9tT49T (multiple Copy Trading accounts) | Snippet embedded in the S1 FAQ |
| S8 | https://help.axi.com/en-US/axiv2--axicorp-prod/article/ZVkk7i94 (bonus and copy trading) | Snippet embedded in the S1 FAQ |
| S9 | https://www.axi.com/int/blog/education/signal-providers | Live. Read through WebFetch |
| S10 | https://apps.apple.com/us/app/axi-copy-trading/id1589937901 | Live App Store listing |
| S11 | https://play.google.com/store/apps/details?id=com.axi.pelican | Google Play link taken from S1. The listing did not render for fetching |
| S12 | https://www.axi.com/int/zendesk-faqs/copy-trading/how-do-i-stop-copying-traders and `.../how-does-copy-trading-work` | **Now return 404.** Text known only from search-engine snippets. Corroborated by S3 |
| S13 | https://www.axi.com/int/zendesk-faqs/copy-trading/what-is-the-minimum-amount-i-need-to-copy-trade | **Now returns 404.** Search snippet only. Superseded by S2 |
| G-IQ | Axi Iraq Brand Guidelines, Sept 2026 (local: `src/guides/iraq/`, client upload `Axi_Iraq_Brand_Guidelines_Final.pdf`) | Client document |

---

## 1. What the product is

| # | Fact | Source |
|---|---|---|
| 1.1 | EN page title: "Axi Copy Trading App: Copy the best Forex & CFD traders". | S1 |
| 1.2 | AR page title: «تطبيق آكسي لنسخ التداول: انسخ صفقات أفضل متداولي العملات الأجنبية والعقود مقابل الفروقات». The official Arabic name of the app is «تطبيق آكسي لنسخ التداول». | S2 |
| 1.3 | AR hero: «اعثر على أفضل محافظ التداول وقم بنسخها في الوقت الفعلي.» | S2 |
| 1.4 | EN: "Copy trading allows you to automatically replicate the trades of top traders from around the globe… download the Axi Copy Trading app, connect your MT4/MT5 account, and select the traders you want to follow!" | S1 |
| 1.5 | AR: «تتيح لك ميزة «التداول بالنسخ» محاكاة صفقات أفضل المتداولين من جميع أنحاء العالم تلقائيًا… تنزيل تطبيق آكسي لنسخ التداول، وربط حساب MT4/MT5 الخاص بك، واختيار المتداولين الذين ترغب في متابعتهم!» | S2 |
| 1.6 | AR FAQ: «التداول بالنسخ هو أسلوب تداول آلي يتيح للمستثمر متابعة الصفقات الحية للمتداولين الأكثر خبرة ومحاكاتها في الوقت الفعلي… تقوم باختيار متداول بناءً على سجل أدائه، وملف المخاطر الخاص به، والأسواق التي يتداول فيها». | S2 |
| 1.7 | EN: "say goodbye to late-night market monitoring and second-guessing your entry points. Just find the traders you want to follow and let the app do the rest." AR: «لتودع بذلك مراقبة السوق ليلاً… ودع التطبيق يقوم بالباقي.» | S1, S2 |
| 1.8 | EN: "Copy trading is an effective way to make well-informed trade entries without needing advanced expertise." AR: «دون الحاجة إلى خبرة متقدمة». | S1, S2 |
| 1.9 | EN: "When you choose to copy a top trader, your account replicates their trades in real time". AR: «يقوم حسابك بتكرار تداولاته في الوقت الفعلي». | S1, S2 |
| 1.10 | If the copied trader does well you can benefit, and you also copy their losses. | S3 |
| 1.11 | Copy trading "doesn't rely on a managed fund, giving you the flexibility to manage your risk on your terms." | S1 |
| 1.12 | The app is developed by the Pelican Group. | S3 |
| 1.13 | You can copy more than one trader. | S3, S12 |

## 2. How it works (Axi's own three steps)

| # | Fact | Source |
|---|---|---|
| 2.1 | EN steps: (1) "Follow a trader: Choose a trader to follow and copy their trades." (2) "Trade size and preferences: Set your trade size and risk preferences." (3) "Mirror trades: Automatically start mirroring their trades!" | S1 |
| 2.2 | AR step headings: «تابع أحد المتداولين» / «حجم التداول والتفضيلات» / «صفقات متطابقة». The AR descriptions under them are mismatched on the live page (they describe account login and payment), so use only the headings. | S2 |
| 2.3 | Setup: register in the app and select "Copy Trades". Open the **Discover** tab, which lists every Signal Provider you can copy. | S4 |
| 2.4 | Each provider profile shows **profitability, return history, the markets they trade, and their performance fee**. | S4 |
| 2.5 | In the app you can filter traders by **profitability, asset type and risk level**. | S3 |
| 2.6 | Trade size methods: **Fixed Size, Mirror Master Size, Proportional by Equity, Proportional by Balance**. Options: "Round up to minimum trade size" and "Copy existing trades" (or future trades only). | S4 |
| 2.7 | You accept the Social Trading Authorisation and Subscription Terms (STAST). A **"Max Drawdown"** setting sets risk limits and works on equity, not balance. Copying starts with the provider's next trade. | S4 |
| 2.8 | Once linked, you can see a provider's performance statistics and current trading exposure (open trades) before copying. | S6 |
| 2.9 | You must register inside the Axi Copy Trading app even if you already hold a live Axi account. You link an MT4/MT5 account from the "Account" tab. | S1 FAQ snippets (P1MEJZqD, Os-Cgm8R) |
| 2.10 | Several accounts can be managed in one app (multi-account feature). | S7 |

## 3. Control and stopping

| # | Fact | Source |
|---|---|---|
| 3.1 | You can stop copying at any time. | S3 (live). S12 snippet adds the path: Accounts, "Who am I copying", select the provider, "Edit copy", then adjust settings or "stop copying". |
| 3.2 | AR FAQ: «اختر المتداولين وفقًا لتفضيلاتك، وانسخ تداولاتهم تلقائيًا وفي الوقت الفعلي، واضبط إعدادات المخاطرة الخاصة بك، واحتفظ بالسيطرة على حسابك مع تغير ظروف السوق.» | S2 |
| 3.3 | "Once you've filtered traders based on your preferences, you can fine-tune your risk settings to suit your personal goals and trading style." | S1 |
| 3.4 | A bonus credit counts in equity and drawdown and can change copied trade size under the proportional settings. | S8 |

## 4. Money: minimums and fees

| # | Fact | Source |
|---|---|---|
| 4.1 | **No minimum deposit for copiers.** AR FAQ, verbatim: «لا يوجد شرط للحد الأدنى للإيداع بالنسبة للناسخين (Copiers). كل ما تحتاجه هو توفير أموال كافية لتغطية مواصفات التداول وإدارة المخاطر بفعالية. يُرجى العلم بأن مقدّمي الإشارات (Signal Providers) مطالبون بإيداع 500 دولار أمريكي كحد أدنى.» | S2 |
| 4.2 | An older EN FAQ recommended an initial USD 250 while saying no minimum is required. That page now returns 404. **Do not use "USD 250" on screen.** | S13 (snippet only) |
| 4.3 | **No commissions on copied trades. A performance fee may apply.** AR FAQ: «لا توجد عمولات إضافية على التداولات التي تنسخها، لكن قد تدفع لمقدّم الإشارة رسوم أداء (performance fee) على الأرباح المحققة.» The fee is shown in the app when you copy or follow a trader. | S2, S5 |
| 4.4 | Worked example (AR FAQ): a 30% fee on a USD 100 profit deducts USD 30. Fees are deducted **weekly**, usually on the first day of the week, and appear as "Signal fee" (PPF) in MT4/MT5 history. | S2 |
| 4.5 | Performance fee **cannot exceed 50%**. It is charged only on profit above a **High-Water Mark**. The app may also charge an admin fee. Fee changes apply only to future copiers. | S5 |
| 4.6 | Signal providers may also charge a subscription fee. Charging fees is optional for them. | S9 |

## 5. Who you can copy (signal providers)

| # | Fact | Source |
|---|---|---|
| 5.1 | To charge a fee, a provider applies through a Signal Application Form. Requirements: **USD 500 minimum starting balance and a 6-month trading history**, plus approval. | S5 |
| 5.2 | Signal providers need a USD 500 minimum deposit. | S2 |
| 5.3 | "Any accounts available for copying have not been authorised or approved by Axi." **So the copy must not say Axi "selected", "vetted" or "approved" the traders.** Axi's own wording "top traders / أفضل المتداولين" is allowed. | S9 |
| 5.4 | Copiers look at more than returns: "traders will also be scrutinizing their drawdown and risk profile" and fees. Consistently profitable providers are featured on the Axi copy trading leaderboard. | S9 |
| 5.5 | Strategies can be manual (technical or fundamental) or automated. | S9 |
| 5.6 | **Number of providers: not published.** No source gives a count. | none |

## 6. Stats shown on the marketing page (sample only)

| # | Fact | Source |
|---|---|---|
| 6.1 | Six sample trader cards show **30D Profit, Win Rate, Copiers**. Examples: "Ava Goldsmith 79.67% / 61.8% / 4437 Copiers" and "Emily Brown 74.36% / 76.98% / 1439 Copiers". Every block carries "Past performance is not indicative of future results." | S1, S2 |
| 6.2 | **Compliance decision: do not show these return figures or any return figure in the reel.** They are illustrative sample cards, and G-IQ p.60 bans "any promise of a specific numeric return". UI mock-ups use labels only, with the tag «للتوضيح فقط» (illustration only). | S1, G-IQ |

## 7. App availability

| # | Fact | Source |
|---|---|---|
| 7.1 | "Axi Copy Trading" is on the iOS App Store (id1589937901) and Google Play (`com.axi.pelican`). | S1, S2, S10, S11 |
| 7.2 | The iOS app is **free**. Seller: AxiCorp Financial Services Pty Ltd. Requires iOS 15.0 or later. Age rating 4+. | S10 |
| 7.3 | The iOS description lists markets including stocks, forex, gold, commodities and indices, and warns that you "may lose your initial deposit". Copyright line: Pelican Exchange Limited. | S10 |
| 7.4 | The iOS rating is 2.6 from 11 ratings. **Do not reference the rating.** | S10 |
| 7.5 | App UI language support (Arabic?) is **not listed**. | S10 |

## 8. Entities, regulation, awards

| # | Fact | Source |
|---|---|---|
| 8.1 | Axi is a trading name of AxiTrader LLC, incorporated in St Vincent and the Grenadines (number 4303 LLC 2025) and registered by the Financial Services Authority. AxiTrader LLC is a member of The Financial Commission. | S1 |
| 8.2 | "Pelican Trading is a trading name of London & Eastern LLP… authorised and regulated by the Financial Conduct Authority in the UK, with firm reference number 534484." Axi is "Partner of London & Eastern LLP." | S1, S2 |
| 8.3 | The site's information "is not intended for Australian and New Zealand residents." | S1 |
| 8.4 | AxiTrader "is not a financial adviser and all services are provided on an execution only basis." | S1 |
| 8.5 | **Award:** "Best Copy Trading Platform", MENA, Global Forex Awards, 2023. AR: «أفضل منصة لنسخ الصفقات – الشرق الأوسط وشمال أفريقيا». The award block is footnoted "*Axi group of companies." | S1, S2 |
| 8.6 | Iraq eligibility for the Copy Trading app is **not stated** on any source. | none |

## 9. Official risk wording (use verbatim)

- EN: "Trading involves risk. You may lose more than you invest. Past performance is not indicative of future results." (S1)
- AR: «ينطوي التداول على مخاطر. قد تخسر أكثر مما تستثمر. الأداء السابق لا يضمن النتائج المستقبلية.» (S2)
- AR, near the trader cards: «الأداء السابق لا يشير إلى النتائج المستقبلية.» (S2)
- EN OTC footer: "Over-the-counter derivatives are complex instruments and come with a high risk of losing substantially more than your initial investment rapidly due to leverage." (S1)
- Axi Iraq standard risk strip (G-IQ p.60, marked "to be confirmed by legal"): «تنطوي عقود الفروقات والمنتجات المشتقة خارج البورصة على مخاطر عالية قد تؤدي إلى خسارة رأس المال. المحتوى التعليمي والتحليلي لا يُعدّ نصيحة استثمارية. قد لا يكون هذا المحتوى متاحًا في منطقتك. يُرجى الرجوع إلى شروط الخدمة.»

## 10. Brand rules from the Axi Iraq guidelines that change the copy (G-IQ)

| # | Rule | Page |
|---|---|---|
| 10.1 | **Language level is white Modern Standard Arabic (الفصحى البيضاء).** No spoken dialect in official material. Iraqi dialect is allowed only in friendly comment replies and casual stories, in moderation. | p.58 (also p.7 "Arabic first") |
| 10.2 | A headline line has at most 5 words. Body text has at most 70 characters. Right-aligned, or centred for short headlines only. | p.35 |
| 10.3 | Never mix full English words into an Arabic sentence on the same line. Latin is kept for tickers, technical terms and the wordmark. | p.35, p.7 |
| 10.4 | Banned words: ربح مضمون، بلا مخاطر، دخل ثابت، مضاعفة رأس المال، توصية مؤكدة، إشارة ١٠٠٪، لا تخسر أبدًا. Also banned: «مرخّص في العراق» unless the licence says so, and any promise of a specific numeric return. | p.60 |
| 10.5 | Video: opens with the white Axi Iraq lockup on the primary gradient (1.5 s, sonic identity). Axi white watermark at 60% opacity and 5% of frame width, bottom-left, for the whole video. Closes on a red screen with the white Axi logo (1 s), then a CTA screen with a red button. **Risk strip in the last 3 s.** Captions in Rabar Regular, 4% of frame height, 2 lines max. **Safe zone: top 10% and bottom 15% hold no important text.** | p.24, p.44 |
| 10.6 | Compliance list also requires an **audio disclosure at the end of a promotional video**. This conflicts with the client's "no voice-over" brief and must be resolved by the brand manager or legal. | p.60 |
| 10.7 | The approved personas are **Noor** (primary face for campaigns and video), **Saeed** and **Aisha** (Axi global ME), and **Sarmad** and **Rojin** (Kurdish audience). **No more than 2 personas per post.** No new faces per campaign. | p.46, p.44, p.50 |
| 10.8 | Colour: 70% light neutrals, 20% darks, **red at most 10%**. Mint #5EE0BB is for gains/data only. Red in charts means loss. Never use traditional green. | p.28 |
| 10.9 | Components: light glass is white 22% with 22 px blur, a 55% white border and a 44 px chamfer. Dark glass is black 72% with 22 px blur and an 18 px radius. CTA pill: Axi red #E4002E, white heavy Rabar 30 px, 72 px high. Two red triangles, 26 px, in the bottom corners. Background candles are white at 35-50%, behind text only. | p.41, p.43 |
| 10.10 | 3D: use the Axi global instrument library only (silver coins for FX, metallic stock cards, bullion bars). One hero object, or three objects on a diagonal. No crowds of objects. The logo is never made 3D. | p.56 |
| 10.11 | Voice: clear, confident, respectful, local. "We are a reference, not a seller." No FOMO and no condescension to beginners. Counter-example to avoid: «صِر محترفًا بأسبوع». | p.57-59 |
| 10.12 | Landscapes: a small human in a grand, cool, muted landscape (Tigris, the southern marshes, the Kurdistan mountains, the western desert, the Erbil skyline). No tourist landmarks, flags, or religious or political symbols. | p.55 |

## 11. Unverified / do not use on screen

- "USD 250 recommended deposit" (S13, page removed; S2 now states no minimum).
- App launch date (Dec 2021) and the partner name "Pelican Exchange": from a press-release search snippet whose domain did not resolve.
- Any count of available traders, any leaderboard ranking method, or any trader vetting by Axi (S9 says accounts are **not** approved by Axi).
- App availability for Iraqi residents, and an Arabic UI in the app. **The client must confirm both before publishing.**
- Third-party claims (TradersUnion "20-30% fees, monthly", Benzinga "USD 500 live minimum") conflict with Axi's own sources. Ignore them.
