# Frontal Smile Assessment Survey Web Application

A bilingual (**English / عربي**) multi-page clinical questionnaire built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

Designed for dental and orthodontic research by Dr. Nehmedo. Participants evaluate frontal smile attractiveness through standardized demographic inputs, 10-to-100 photo ratings, and 4-photo sequential click-to-rank matrices. Responses are saved directly into **Google Sheets** (one row per participant) for statistical modeling and scientific publishing.

---

## 📁 Project Architecture & Subfolder Organization

The codebase is organized into modular, purpose-driven subfolders:

```
├── public/
│   └── survey-photos/               # Standardized smile images (smile_01.jpg .. setF_4.jpg)
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── api/
│   │   │   └── submit/
│   │   │       └── route.ts         # Server-side validation & Google Sheets appending
│   │   ├── globals.css              # Font definitions, Tailwind imports, scrollbar polish
│   │   ├── layout.tsx               # Root layout with Cairo & Inter Google Fonts
│   │   └── page.tsx                 # Entry page rendering SurveyShell
│   ├── components/
│   │   ├── common/                  # Reusable UI primitives
│   │   │   ├── Header.tsx           # Study branding, clinical trust badge, language indicator
│   │   │   ├── LanguageModal.tsx    # Mandatory English / عربي selection modal
│   │   │   ├── ProgressBar.tsx      # Fixed bottom progress bar with RTL inversion
│   │   │   └── ZoomModal.tsx        # High-res photo lightbox for rating & ranking photos
│   │   ├── questions/               # Data-driven question components
│   │   │   ├── NumberInput.tsx      # Conditional work experience stepper (0-60 yrs)
│   │   │   ├── PhotoRanking.tsx     # 2x2 grid sequential click-to-rank with continuous renumbering
│   │   │   ├── PhotoRating.tsx      # Standardized photo with 10-100 LTR rating buttons
│   │   │   ├── QuestionWrapper.tsx  # Unified card shell with numbering & error messaging
│   │   │   ├── ShortText.tsx        # Character-counted input (max 30 chars for Name)
│   │   │   └── SingleChoice.tsx     # Accessible radio card options
│   │   └── survey/                  # Top-level page controllers
│   │       ├── SurveyPage.tsx       # Dynamic page question renderer with nav buttons
│   │       ├── SurveyShell.tsx      # Coordinates state, modals, storage & progress bar
│   │       └── ThankYou.tsx         # Submission confirmation & participant ID display
│   ├── data/
│   │   └── survey.json              # Complete survey configuration (questions, pages, translations)
│   ├── hooks/
│   │   ├── useLanguage.ts           # Language state, dir="rtl" switching, and i18n
│   │   └── useSurvey.ts             # State machine, session autosave, validation & submit
│   └── lib/
│       ├── buildRow.ts              # Canonical column header & row builder for Google Sheets
│       ├── i18n.ts                  # Bilingual UI translation dictionary
│       ├── sheets.ts                # Server-side Google Sheets API JWT client
│       ├── storage.ts               # Safe sessionStorage persistence helpers
│       └── types.ts                 # Full TypeScript definitions for survey data & API
├── scripts/
│   ├── generate-photos.ts           # Utility generating clinical dental placeholder photos
│   └── init-sheet.ts                # Automates writing header row to Google Sheets
├── .env.example                     # Environment variables template
└── survey-implementation-plan.md    # Original specification document
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Google Sheets Integration Setup

Survey responses are recorded in a Google Spreadsheet. Each participant generates **one complete row** with canonical English values for statistical analysis.

### Step 1: Create a Google Cloud Service Account
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g. `frontal-smile-survey`).
3. Enable the **Google Sheets API**:
   - Go to **APIs & Services** > **Library**.
   - Search for **Google Sheets API** and click **Enable**.
4. Create a Service Account:
   - Go to **APIs & Services** > **Credentials**.
   - Click **Create Credentials** > **Service Account**.
   - Name it (e.g. `survey-collector`) and click **Done**.
5. Generate a Key:
   - Click on the created service account email.
   - Go to the **Keys** tab > **Add Key** > **Create new key**.
   - Select **JSON** and download the file.

### Step 2: Create and Share your Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Rename the first sheet tab to `Responses`.
3. Copy the **Spreadsheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`<YOUR_SPREADSHEET_ID>`**`/edit`
4. Click the **Share** button (top-right) and share the sheet with your **Service Account Email** (from step 1) with the **Editor** role.

### Step 3: Configure Environment Variables
Create a `.env.local` file in the project root:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID="your_google_sheet_id_here"
```

> **Note on Private Key:** Keep the double quotes and retain the `\n` linebreaks from the downloaded JSON key.

### Step 4: Initialize the Sheet Header Row
Run the automated script to generate and write all 39+ column headers derived directly from `src/data/survey.json`:

```bash
npm run init-sheet
```

---

## 🖼️ Managing Photos

### Standardized Format
Photos are stored in `public/survey-photos/`:
- **Rating Photos (Pages 2 to 4):** `smile_01.jpg` through `smile_21.jpg`
- **Ranking Sets (Pages 5 to 7):**
  - Set A: `setA_1.jpg` .. `setA_4.jpg`
  - Set B: `setB_1.jpg` .. `setB_4.jpg`
  - Set C: `setC_1.jpg` .. `setC_4.jpg`
  - Set D: `setD_1.jpg` .. `setD_4.jpg`
  - Set E: `setE_1.jpg` .. `setE_4.jpg`
  - Set F: `setF_1.jpg` .. `setF_4.jpg`

To replace with real clinical photos, simply copy your photographs into `/public/survey-photos/` matching the filenames above.

---

## 🛠️ Modifying Questions & Adding Extra Items

All survey questions, page splits, and labels are declared in **`src/data/survey.json`**.
- Add questions or pages as needed.
- No React code modifications are required when changing questions.
- If you add or remove questions, re-run `npm run init-sheet` on a fresh sheet tab to update column headers.

---

## 🔒 Security & Privacy

- **Server-Side Only Credentials:** Google Cloud Service Account credentials are executed exclusively on the server (`/api/submit`). They are never exposed to the client or browser bundle.
- **Double Submission Prevention:** Submit button enters a disabled loading state immediately upon dispatch.
- **Auto-Recovery:** If a network failure occurs, user answers remain stored in state so they can retry without losing their progress.
