# Frontal Smile Assessment Survey: Implementation Plan

> This document is the full specification for building the survey web app. Follow it exactly. Where something is marked **ASSUMPTION**, implement the stated default but keep it easy to change.

---

## 1. Project Overview

A bilingual (English / Arabic) multi-page survey built with **Next.js**. Participants answer personal questions, rate smile photographs on a 10 to 100 scale, and rank groups of four smile photographs using a click-to-rank method. When the participant submits, the answers are saved as **one new row** in a **Google Sheet**. The data is later used for statistics and graphs in a scientific paper.

**Key goals**

- Questions and photos are defined in a **JSON file**, so the owner can change them without touching code.
- Language popup at the start (English or عربي), with full RTL support for Arabic.
- 7 pages, a progress bar fixed at the bottom, then a thank-you page.
- Clean, analysis-ready data in Google Sheets: one row per participant.

---

## 2. Tech Stack

| Area | Choice |
|---|---|
| Framework | Next.js (App Router) with TypeScript |
| Styling | Tailwind CSS |
| Images | `next/image`, files stored in `/public/survey-photos/` |
| Google Sheets | `googleapis` npm package, called **server-side only** from a Next.js route handler |
| Hosting | Vercel (or any Node host) |
| Fonts | An Arabic-capable font such as Cairo or Noto Sans Arabic, plus a clean Latin font |

No database is needed. Google Sheets is the only storage.

---

## 3. Survey Structure (7 pages + thank-you)

| Page | Content | Questions |
|---|---|---|
| 1 | Personal questions | 5 |
| 2 | Photo rating (10 to 100) | 7 |
| 3 | Photo rating (10 to 100) | 7 |
| 4 | Photo rating (10 to 100) | 7 |
| 5 | Click-to-rank | 2 |
| 6 | Click-to-rank | 2 |
| 7 | Click-to-rank, with **Submit** button instead of Next | 2 |
| After submit | Thank-you page | none |

Total: **32 questions** (5 personal, 21 ratings, 6 rankings).

> The page layout must be **data-driven**. The number of pages, and the number of questions on each page, come entirely from the JSON file (section 8). The owner may add more questions later (the target is about 40), so nothing may be hard-coded to 32.

---

## 4. Language Popup and RTL

1. On first load, show a **modal popup** that cannot be dismissed without choosing: two large buttons, **English** and **عربي**.
2. The chosen language applies to every question, answer option, button and message. Only one language is shown at a time.
3. The choice is stored in app state (and `sessionStorage` so a refresh does not lose it) and is saved to the sheet in the `language` column (`en` or `ar`).
4. For Arabic: set `dir="rtl"` and `lang="ar"` on the document, mirror the layout (text alignment, button order), and use the Arabic font.
5. **Exception:** the 10 to 100 rating scale and the rank badges always use Western digits (0-9), and the scale always displays left to right (10 on the left, 100 on the right) in both languages. Put `dir="ltr"` on the scale container.
6. The language is locked after it is chosen, so each participant's data stays consistent.

### UI strings

| Key | English | Arabic |
|---|---|---|
| `next` | Next | التالي |
| `back` | Back | السابق |
| `submit` | Submit | إرسال |
| `pageOf` | Page {current} of {total} | صفحة {current} من {total} |
| `required` | This question is required. | هذا السؤال مطلوب. |
| `answerAll` | Please answer all required questions to continue. | يرجى الإجابة عن جميع الأسئلة المطلوبة للمتابعة. |
| `submitting` | Submitting... | جارٍ الإرسال... |
| `submitError` | Something went wrong. Your answers are saved, please try again. | حدث خطأ ما. إجاباتك محفوظة، يرجى المحاولة مرة أخرى. |
| `thanksTitle` | Thank you for participating! | شكراً لمشاركتك! |
| `thanksBody` | Your responses have been recorded. | تم تسجيل إجاباتك. |
| `chooseLanguage` | Choose your language | اختر لغتك |

> The Arabic text above was drafted by the assistant. The owner must review it.

---

## 5. Questions

### 5.1 Page 1: Personal questions (all required unless stated)

| ID | English | Arabic | Type | Options (`value`: English / Arabic) |
|---|---|---|---|---|
| `name` | Name | الاسم | short text, max **30 characters** | none |
| `gender` | Gender | الجنس | single choice | `male`: Male / ذكر; `female`: Female / أنثى |
| `age_group` | Age | العمر | single choice | `18_24`: 18 to 24 years old / من 18 إلى 24 سنة; `25_34`: 25 to 34 years old / من 25 إلى 34 سنة; `35_45`: 35 to 45 years old / من 35 إلى 45 سنة; `over_45`: Older than 45 / أكثر من 45 سنة |
| `occupation` | Occupation | المهنة | single choice | `orthodontist`: Orthodontist / أخصائي تقويم أسنان; `dentist`: Dentist / طبيب أسنان; `non_dental`: Non-dental profession / مهنة غير متعلقة بطب الأسنان |
| `work_experience` | Years of work experience | عدد سنوات الخبرة | number | see below |

**Work experience rules**

- **Conditional:** only shown and required when `occupation` is `orthodontist` or `dentist`. For `non_dental` it is hidden, not required, and its sheet cell stays empty.
- If the participant selects an occupation, then switches to `non_dental`, clear and hide the experience answer.
- **ASSUMPTION:** it is a whole-number input in years (0 to 60). If the owner prefers ranges (for example 0 to 5, 6 to 10), only the JSON needs to change, since the type can be `single_choice` instead.

### 5.2 Pages 2 to 4: Photo rating (21 questions, 7 per page)

Each question shows **one large photo** and one row of scale buttons.

- **English instruction:** "Rate the smile attractiveness, using the scale below the photo where 10 = least attractive going to 100 = most attractive."
- **Arabic instruction:** "قيّم مدى جاذبية الابتسامة باستخدام المقياس أسفل الصورة، حيث يمثل الرقم 10 الأقل جاذبية والرقم 100 الأكثر جاذبية."
- **Scale:** values 10, 20, 30, 40, 50, 60, 70, 80, 90, 100. Exactly one value can be chosen. All required.
- **UI:** a row of 10 large tappable buttons (not tiny radio ovals). On small phones they may wrap into 2 rows of 5. The selected value is clearly highlighted.
- Each question has its own numbered label (Question 6, Question 7, and so on, continuing the numbering across pages).
- The photo should be large and clear, centered, `object-fit: contain`, with a sensible max height so the scale stays visible on screen without much scrolling.

### 5.3 Pages 5 to 7: Click-to-rank (6 questions, 2 per page)

**Instruction text (editable in JSON)**

- **English:** "Rank the following smiles according to your personal preference, from the most preferred to the least preferred. Click the photos one by one, starting with your first choice."
- **Arabic:** "رتّب الابتسامات التالية حسب تفضيلك الشخصي، من الأكثر تفضيلاً إلى الأقل تفضيلاً. اضغط على الصور واحدة تلو الأخرى، بدءاً باختيارك الأول."

**Layout**

- Exactly **4 photos**, in a **2 x 2 grid**, each photo as large as the screen allows so the participant can see the differences. Keep the 2 x 2 grid on phones as well. Do not shrink into a small thumbnail strip.
- Photos keep their natural aspect ratio (`object-fit: contain`), with equal-sized cells.
- Optional but recommended: a small magnifier icon on each photo opens a full-screen zoom view (this must not change the ranking).

**Behavior (Sequential Click-to-Rank)**

1. Participants click each photograph in order, starting with their **first choice** and continuing until all 4 are ranked.
2. When a photo is clicked, a **numeric badge** appears on it (1 = most preferred, 4 = least preferred). The badge is large, high contrast, and placed in a corner of the photo. Ranked photos also get a visible border or highlight.
3. If the participant clicks a photo that is **already ranked**, its rank is **removed** and all remaining ranked photos are **renumbered automatically** so the sequence stays continuous (1, 2, 3...).
4. Implementation: keep an ordered array of photo IDs. Clicking an unranked photo appends its ID. Clicking a ranked photo removes its ID from the array. A photo's rank is its index in the array plus 1.
5. The question counts as **answered only when all 4 photos are ranked** (array length 4).
6. No drag-and-drop anywhere.
7. Show a small live hint such as "2 of 4 ranked" (translated).
8. Each photo is a real `<button>` with an `aria-label` (for example "Photo B, ranked 2") so it works with keyboard and screen readers.

**Saved value:** for each photo, the rank it received (1 to 4). See section 9.

---

## 6. Navigation and Validation

- **Next** is disabled until every *required and visible* question on the current page is answered. If the participant tries to continue anyway, highlight the unanswered questions with the `required` message and scroll to the first one.
- **Back** is available on pages 2 to 7. Answers are kept when moving back and forth.
- On page 7, the Next button is replaced by **Submit**.
- Scroll to the top on every page change.
- Answers are kept in a single state object and mirrored to `sessionStorage`, so an accidental refresh does not lose progress.
- After pressing **Submit**: disable the button, show "Submitting...", send the data (section 9). On success, show the thank-you page. On failure, show the error message, keep all answers, and allow retry. Prevent double submission.

---

## 7. Progress Bar

- A bar **fixed at the bottom of the screen**, always visible, full width.
- Shows a filled bar plus text: "Page 2 of 7" (translated).
- **ASSUMPTION:** progress is page-based: percentage = current page number / total pages. For example, page 2 of 7 is about 29%, and page 7 is 100%.
- In Arabic (RTL) the bar fills from right to left.
- The bar is hidden on the thank-you page.
- Leave bottom padding on the page content so the fixed bar never covers the Next/Submit buttons.

---

## 8. JSON Question File

File: `src/data/survey.json`. The app reads **all** questions, pages, options, photos and instruction texts from this file. Every user-facing string has an `en` and an `ar` version.

### Question types

| `type` | Used for |
|---|---|
| `short_text` | Name |
| `single_choice` | Gender, age, occupation |
| `number` | Work experience |
| `photo_rating` | Pages 2 to 4 |
| `photo_ranking` | Pages 5 to 7 |

### Fields

- `id`: unique, used for the sheet column names. Use only letters, numbers and underscores.
- `required`: true or false.
- `showIf` (optional): shows the question only when another question has one of the listed values.
- `photo_rating` has `photo` (`id` and `src`), `min`, `max`, `step`.
- `photo_ranking` has `photos`: **exactly 4** items, each with a unique `id` and `src`. The photo `id` becomes part of the sheet column name, so use meaningful names.
- `shuffle` (ranking only, default `false`): if true, randomize the grid positions of the 4 photos for each participant. The saved data is unaffected.

### Example

```json
{
  "meta": {
    "title": { "en": "Frontal Smile Assessment Questionnaire", "ar": "استبيان تقييم الابتسامة من المنظور الأمامي" },
    "photoRatingInstruction": {
      "en": "Rate the smile attractiveness, using the scale below the photo where 10 = least attractive going to 100 = most attractive.",
      "ar": "قيّم مدى جاذبية الابتسامة باستخدام المقياس أسفل الصورة، حيث يمثل الرقم 10 الأقل جاذبية والرقم 100 الأكثر جاذبية."
    },
    "photoRankingInstruction": {
      "en": "Rank the following smiles according to your personal preference, from the most preferred to the least preferred. Click the photos one by one, starting with your first choice.",
      "ar": "رتّب الابتسامات التالية حسب تفضيلك الشخصي، من الأكثر تفضيلاً إلى الأقل تفضيلاً. اضغط على الصور واحدة تلو الأخرى، بدءاً باختيارك الأول."
    }
  },
  "pages": [
    {
      "id": "page1",
      "questions": [
        { "id": "name", "type": "short_text", "required": true, "maxLength": 30,
          "label": { "en": "Name", "ar": "الاسم" } },
        { "id": "gender", "type": "single_choice", "required": true,
          "label": { "en": "Gender", "ar": "الجنس" },
          "options": [
            { "value": "male",   "label": { "en": "Male",   "ar": "ذكر" } },
            { "value": "female", "label": { "en": "Female", "ar": "أنثى" } }
          ] },
        { "id": "age_group", "type": "single_choice", "required": true,
          "label": { "en": "Age", "ar": "العمر" },
          "options": [
            { "value": "18_24",   "label": { "en": "18 to 24 years old",  "ar": "من 18 إلى 24 سنة" } },
            { "value": "25_34",   "label": { "en": "25 to 34 years old",  "ar": "من 25 إلى 34 سنة" } },
            { "value": "35_45",   "label": { "en": "35 to 45 years old",  "ar": "من 35 إلى 45 سنة" } },
            { "value": "over_45", "label": { "en": "Older than 45",       "ar": "أكثر من 45 سنة" } }
          ] },
        { "id": "occupation", "type": "single_choice", "required": true,
          "label": { "en": "Occupation", "ar": "المهنة" },
          "options": [
            { "value": "orthodontist", "label": { "en": "Orthodontist",            "ar": "أخصائي تقويم أسنان" } },
            { "value": "dentist",      "label": { "en": "Dentist",                 "ar": "طبيب أسنان" } },
            { "value": "non_dental",   "label": { "en": "Non-dental profession",   "ar": "مهنة غير متعلقة بطب الأسنان" } }
          ] },
        { "id": "work_experience", "type": "number", "required": true, "min": 0, "max": 60,
          "label": { "en": "Years of work experience", "ar": "عدد سنوات الخبرة" },
          "showIf": { "question": "occupation", "in": ["orthodontist", "dentist"] } }
      ]
    },
    {
      "id": "page2",
      "questions": [
        { "id": "R01", "type": "photo_rating", "required": true,
          "photo": { "id": "smile_01", "src": "/survey-photos/smile_01.jpg" },
          "min": 10, "max": 100, "step": 10 }
        /* ...R02 to R07 on this page, same structure... */
      ]
    },
    {
      "id": "page5",
      "questions": [
        { "id": "K01", "type": "photo_ranking", "required": true, "shuffle": false,
          "photos": [
            { "id": "setA_1", "src": "/survey-photos/setA_1.jpg" },
            { "id": "setA_2", "src": "/survey-photos/setA_2.jpg" },
            { "id": "setA_3", "src": "/survey-photos/setA_3.jpg" },
            { "id": "setA_4", "src": "/survey-photos/setA_4.jpg" }
          ] }
        /* ...K02 on this page... */
      ]
    }
  ]
}
```

(The `/* ... */` comments are only for this document. Real JSON has no comments.)

Pages 2 to 4 hold `R01` to `R21` (7 each). Pages 5 to 7 hold `K01` to `K06` (2 each). The owner fills in the real photo names.

**Validation at startup:** a script or a type check must fail loudly if the JSON is invalid: duplicate IDs, a ranking question without exactly 4 photos, a missing `en` or `ar` text, or a photo `src` that does not exist in `/public`.

---

## 9. Google Sheets Storage

### 9.1 Layout: one row per participant

Sheet tab name: `Responses`. Row 1 is the header. **Every submission appends one new row.** The header and column order are **generated from the JSON file** by a script (`npm run init-sheet`), so the sheet always matches the questions.

**Column order**

1. `submission_id` (UUID)
2. `timestamp` (UTC, ISO 8601)
3. `language` (`en` or `ar`)
4. `duration_seconds` (time from the first question page to submit)
5. `name`
6. `gender`
7. `age_group`
8. `occupation`
9. `work_experience` (empty for non-dental)
10. One column per rated photo: `rate_<photoId>`, in the same order as the JSON, containing 10 to 100.
11. For each ranking question, **one column per photo**: `<questionId>_rank_<photoId>`, containing **1 to 4**.

**Example (ranking question K01 with four photos)**

| submission_id | ... | K01_rank_setA_1 | K01_rank_setA_2 | K01_rank_setA_3 | K01_rank_setA_4 |
|---|---|---|---|---|---|
| a1b2... | ... | 3 | 1 | 4 | 2 |

This means this participant ranked photo `setA_2` first, `setA_4` second, `setA_1` third and `setA_3` last.

### 9.2 Rules

- Always store the **English canonical values** (for example `male`, `18_24`, `orthodontist`) and English column headers, no matter which language the participant used. Only the `language` column records the language.
- Never store the Arabic or English display text in the sheet.
- Numbers are stored as real numbers, not text, so formulas work directly.

### 9.3 Server-side submission

- Route handler: `POST /api/submit` (`src/app/api/submit/route.ts`).
- The browser sends only the answers (plus language, submission ID and duration). **Google credentials are never sent to or exposed in the browser.**
- The server **re-validates** everything against the JSON: all visible required questions answered, option values exist, ratings are in the allowed set, each ranking is a valid permutation of 1 to 4 across the 4 photos, name length is 30 characters or fewer, and work experience is only accepted for orthodontists and dentists.
- If valid, build the row in the header order and append it with the Sheets API `spreadsheets.values.append` (`valueInputOption: "RAW"`, `insertDataOption: "INSERT_ROWS"`).
- Return `{ ok: true }` or a clear error. Never put stack traces or secrets in responses.

### 9.4 Google setup (owner steps, to be documented in the README)

1. Create a Google Cloud project and enable the **Google Sheets API**.
2. Create a **service account** and download its JSON key.
3. Create the Google Sheet, add a tab called `Responses`, and **share the sheet with the service account's email as Editor**.
4. Put these in `.env.local` (and in the hosting provider's environment settings):
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (handle the `\n` line breaks correctly)
   - `GOOGLE_SHEET_ID`
5. Run `npm run init-sheet` once to write the header row from the JSON file.
6. Never commit `.env.local` or the key file. Add them to `.gitignore`, and commit an `.env.example`.

### 9.5 Analysis (optional second phase)

Add an `Analysis` tab in the same spreadsheet using formulas, so the owner gets totals and graph-ready tables without code:

- Mean and standard deviation per rating column, for example `=AVERAGE(Responses!J2:J)` and `=STDEV(Responses!J2:J)`.
- Mean rank per ranked photo: `=AVERAGE(Responses!AA2:AA)`.
- Number of participants who gave each photo rank 1, 2, 3 and 4: `=COUNTIF(Responses!AA2:AA, 1)`, and so on.
- Charts: a bar chart of mean ratings per photo, and a stacked bar chart of rank counts per photo.

(Column letters above are examples. Generate the real references from the header.)

---

## 10. Design Requirements

- Clean, calm, professional look suited to a scientific study. Plenty of white space.
- **Mobile first.** Many participants will use phones. Everything must work from 360 px wide up to desktop.
- Photos are the focus: large, sharp, never cropped (use `contain`), and never stretched.
- Preload the photos of the next page so images do not pop in slowly.
- Large tap targets (at least 44 x 44 px).
- High-contrast selected states and rank badges.
- Clear visual error state for unanswered required questions.
- Keyboard accessible, with visible focus states.

---

## 11. Suggested Project Structure

```
survey-app/
├─ public/
│  └─ survey-photos/            # all photos, unique file names
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx               # survey shell
│  │  └─ api/submit/route.ts    # Google Sheets append
│  ├─ components/
│  │  ├─ LanguageModal.tsx
│  │  ├─ ProgressBar.tsx        # fixed bottom
│  │  ├─ SurveyPage.tsx
│  │  ├─ ThankYou.tsx
│  │  └─ questions/
│  │     ├─ ShortText.tsx
│  │     ├─ SingleChoice.tsx
│  │     ├─ NumberInput.tsx
│  │     ├─ PhotoRating.tsx
│  │     └─ PhotoRanking.tsx    # click-to-rank logic
│  ├─ data/
│  │  └─ survey.json            # the owner edits this
│  ├─ lib/
│  │  ├─ types.ts
│  │  ├─ validate.ts            # shared client + server validation
│  │  ├─ buildRow.ts            # answers -> sheet row
│  │  ├─ sheets.ts              # Google client
│  │  └─ i18n.ts                # UI strings
│  └─ scripts/
│     └─ init-sheet.ts          # writes the header row from the JSON
├─ .env.example
└─ README.md
```

---

## 12. Build Order

1. Create the Next.js project (TypeScript, Tailwind) and the types for the JSON.
2. Add `survey.json` with all page 1 questions plus placeholder rating and ranking questions.
3. Language modal, i18n strings and RTL switching.
4. Page shell, navigation, validation, and the fixed bottom progress bar.
5. Question components: short text, single choice, conditional number input, photo rating.
6. `PhotoRanking` click-to-rank component (2 x 2 grid, badges, un-rank with automatic renumbering).
7. Thank-you page.
8. `/api/submit` with server-side validation and the Google Sheets append.
9. `init-sheet` script and the README setup guide.
10. End-to-end test (section 13), then deploy.

---

## 13. Acceptance Checklist

- [ ] The language popup appears on load and blocks the survey until a language is chosen.
- [ ] Choosing Arabic gives full RTL, Arabic text everywhere, and Western digits in the scale and badges.
- [ ] The survey has exactly 7 pages, with the content split exactly as in section 3, all driven by `survey.json`.
- [ ] Changing or adding a question in `survey.json` changes the survey with no code changes.
- [ ] Name is limited to 30 characters. All questions are required except work experience.
- [ ] Work experience appears only for orthodontists and dentists, and clears if the occupation changes.
- [ ] Next is blocked until all required, visible questions on the page are answered.
- [ ] Rating photos are large and clear, and rating uses the 10 to 100 scale in steps of 10.
- [ ] Click-to-rank: badges 1 to 4 appear in click order; clicking a ranked photo removes it and renumbers the rest; the question counts as answered only when all 4 are ranked.
- [ ] Ranking photos are shown big in a 2 x 2 grid, on mobile too.
- [ ] The progress bar is fixed at the bottom and updates on every page.
- [ ] Back keeps previous answers; a page refresh does not lose progress.
- [ ] Page 7 shows Submit instead of Next; after success, the thank-you page appears.
- [ ] Each submission creates exactly one new row in the `Responses` tab with the columns in section 9.
- [ ] Ranking columns hold 1 to 4 per photo; rating columns hold 10 to 100; values are English canonical.
- [ ] Double-clicking Submit does not create two rows. A failed submit keeps answers and allows retry.
- [ ] No Google credentials appear in browser code or network responses.

---

## 14. Assumptions and Open Items for the Owner

1. **Work experience format:** a whole number of years (0 to 60). Easy to switch to ranges.
2. **Arabic translations** of the instructions, buttons and personal-question options were drafted and need the owner's review. The two rating/ranking instruction sentences should be confirmed.
3. **Progress bar** is page-based (see section 7).
4. **Photo order:** photos appear in the order written in the JSON. Randomizing the position of ranking photos (`shuffle: true`) is available if the study design needs it.
5. **Privacy:** the survey collects participants' names. Keep the Google Sheet private and share it only with the research team.
6. **Question count:** the current plan has 32 questions. If the final survey needs about 40, add the extra questions to `survey.json` (and extra pages if needed).
