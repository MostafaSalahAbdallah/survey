import {
  SurveyConfig,
  SubmitPayload,
  PhotoRatingQuestion,
  PhotoRankingQuestion,
} from './types';

/**
 * Canonical order of the 21 photo rating columns in Google Sheets.
 * This order is preserved permanently so existing spreadsheet columns
 * and downstream analytics dashboards never shift or break.
 */
export const CANONICAL_RATING_PHOTO_IDS: string[] = [
  'straight-0',
  'slight-0',
  'banana-0',
  'straight-1-green',
  'straight-2-green',
  'straight-3-green',
  'slight-1-green',
  'slight-2-green',
  'slight-3-green',
  'banana-1-green',
  'banana-2-green',
  'banana-3-green',
  'straight-1-red',
  'straight-2-red',
  'straight-3-red',
  'slight-1-red',
  'slight-2-red',
  'slight-3-red',
  'banana-1-red',
  'banana-2-red',
  'banana-3-red',
];

/**
 * Canonical definition of the 6 ranking questions and their 4 photos.
 */
export const CANONICAL_RANKING_CONFIG: { id: string; photos: string[] }[] = [
  {
    id: 'Q1',
    photos: ['straight-0-green', 'straight-1-green', 'straight-2-green', 'straight-3-green'],
  },
  {
    id: 'Q2',
    photos: ['slight-0-green', 'slight-1-green', 'slight-2-green', 'slight-3-green'],
  },
  {
    id: 'Q3',
    photos: ['banana-0-green', 'banana-1-green', 'banana-2-green', 'banana-3-green'],
  },
  {
    id: 'Q4',
    photos: ['straight-0-red', 'straight-1-red', 'straight-2-red', 'straight-3-red'],
  },
  {
    id: 'Q5',
    photos: ['slight-0-red', 'slight-1-red', 'slight-2-red', 'slight-3-red'],
  },
  {
    id: 'Q6',
    photos: ['banana-0-red', 'banana-1-red', 'banana-2-red', 'banana-3-red'],
  },
];

/**
 * Computes the canonical Google Sheets header columns.
 */
export function getSurveyHeaders(survey?: SurveyConfig): string[] {
  const headers: string[] = [
    'submission_id',
    'timestamp',
    'language',
    'duration_seconds',
    'name',
    'gender',
    'age_group',
    'occupation',
    'work_experience',
  ];

  // 21 rating columns
  for (const photoId of CANONICAL_RATING_PHOTO_IDS) {
    headers.push(photoId);
  }

  // 24 ranking columns (4 photos per ranking question)
  for (const q of CANONICAL_RANKING_CONFIG) {
    for (const photoId of q.photos) {
      headers.push(`${q.id}-${photoId}`);
    }
  }

  return headers;
}

/**
 * Builds a single Google Sheets row from the submission payload.
 * Values are stored strictly in canonical English with numeric types.
 * Maps answers invariantly by photo ID to guarantee existing sheet alignment.
 */
export function buildRowFromAnswers(
  survey: SurveyConfig,
  payload: SubmitPayload
): (string | number)[] {
  const { submission_id, timestamp, language, duration_seconds, answers } = payload;

  const row: (string | number)[] = [
    submission_id,
    timestamp,
    language,
    Number(duration_seconds),
    String(answers['name'] ?? '').trim(),
    String(answers['gender'] ?? '').trim(),
    String(answers['age_group'] ?? '').trim(),
    String(answers['occupation'] ?? '').trim(),
  ];

  // Work experience is empty for non-dental
  const occupation = answers['occupation'];
  const workExp = answers['work_experience'];
  if (
    (occupation === 'orthodontist' || occupation === 'dentist') &&
    workExp !== undefined &&
    workExp !== '' &&
    workExp !== null
  ) {
    row.push(Number(workExp));
  } else {
    row.push('');
  }

  // Index answers by photo ID for rating questions across all pages
  const photoRatingAnswers: Record<string, any> = {};
  for (const page of survey.pages) {
    for (const q of page.questions) {
      if (q.type === 'photo_rating') {
        const ratingQ = q as PhotoRatingQuestion;
        if (answers[ratingQ.id] !== undefined) {
          photoRatingAnswers[ratingQ.photo.id] = answers[ratingQ.id];
        }
      }
    }
  }

  // Append 21 photo ratings in canonical sequence
  for (const photoId of CANONICAL_RATING_PHOTO_IDS) {
    const ratingVal = photoRatingAnswers[photoId];
    row.push(ratingVal !== undefined && ratingVal !== '' ? Number(ratingVal) : '');
  }

  // Append ranking questions in canonical sequence
  for (const q of CANONICAL_RANKING_CONFIG) {
    const rankingArr = (answers[q.id] as string[]) || [];
    for (const photoId of q.photos) {
      const rankIndex = rankingArr.indexOf(photoId);
      // If found in array: rank is 1-indexed (1 to 4)
      if (rankIndex >= 0) {
        row.push(rankIndex + 1);
      } else {
        row.push('');
      }
    }
  }

  return row;
}
