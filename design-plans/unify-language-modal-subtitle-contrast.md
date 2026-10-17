# Unify Language Modal Subtitle Contrast

Written against: unavailable (local workspace, not a git repository)

## Evidence chain

- Surface: `src/components/common/LanguageModal.tsx`, route `/` (when `language === null`)
- Problem: Inside the modal card, the English subtitle instruction renders in `text-slate-500` (inherited from the parent `<p>`), while the adjacent Arabic translation on the next line explicitly specifies `text-slate-600`. Both lines perform the identical semantic and informational role in the same paragraph, producing an unintentional contrast imbalance between the two languages.
- Design evidence: `src/components/common/LanguageModal.tsx` line 42 (`<p className="text-sm text-slate-500 mb-8 leading-relaxed">`), where `text-slate-500` is the canonical secondary neutral token, matching button subtext on lines 59 and 71 (`text-xs text-slate-500`) and the global secondary text contract in `src/components/common/Header.tsx` line 28 (`text-xs text-slate-500`).
- Owner: `src/components/common/LanguageModal.tsx`
- Scope and affected surfaces: `src/components/common/LanguageModal.tsx` line 45
- Uncertainty: None

## Design decision

Replace `text-slate-600` with `text-slate-500` on the Arabic subtitle `<span>` (`src/components/common/LanguageModal.tsx:45`). This restores typographic harmony and parity across English and Arabic within the initial modal dialog.

## Reuse

- Tailwind color token: `text-slate-500`
- Exemplar: `src/components/common/LanguageModal.tsx` line 42, 59, 71; `src/components/common/Header.tsx` line 28

## Changes

1. `src/components/common/LanguageModal.tsx`
   - Change: In line 45, change `<span className="font-arabic text-slate-600">` to `<span className="font-arabic text-slate-500">`.
   - Preserve: The `font-arabic` utility class, the preceding `<br />` tag, the Arabic text content, and all parent `<p>` typography and spacing classes.
   - Verify: Both English and Arabic subtitle lines render in consistent `text-slate-500` text color.

## Scope

- Inherit: `LanguageModal` rendered on route `/`
- Verify: Modal dialog presentation in both LTR and RTL contexts
- Exclude: Language action cards (`English` and `عربي` buttons) and survey pages

## Validation

- Product: Visit `/` in a fresh incognito session (no stored language in `sessionStorage`). The language modal opens with unified subtitle text color.
- Interface: Verify on mobile (360px) and desktop (1024px+) that the Arabic text `يرجى اختيار اللغة المفضلة للبدء بالاستبيان.` matches the optical contrast of `Please select your preferred language to begin the survey.`
- System: Confirm no conflicting utility classes or parallel contrast overrides remain in `LanguageModal.tsx`.
- Repository: Run `npm run build` → exit code 0, no errors.

## Stop conditions

- Stop if `LanguageModal.tsx` is refactored to use dynamic translations via `lib/i18n.ts` instead of inline bilingual strings.

## Design documentation

- After acceptance and validation: None required; brings component into alignment with the existing secondary text convention (`text-slate-500`).
