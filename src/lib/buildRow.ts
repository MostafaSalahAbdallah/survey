import {
  SurveyConfig,
  SubmitPayload,
  PhotoRatingQuestion,
  PhotoRankingQuestion,
} from './types';

/**
 * Computes the canonical Google Sheets header columns based on survey.json.
 */
export function getSurveyHeaders(survey: SurveyConfig): string[] {
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

  for (const page of survey.pages) {
    for (const q of page.questions) {
      if (q.type === 'photo_rating') {
        const ratingQ = q as PhotoRatingQuestion;
        headers.push(ratingQ.photo.id);
      } else if (q.type === 'photo_ranking') {
        const rankingQ = q as PhotoRankingQuestion;
        for (const photo of rankingQ.photos) {
          headers.push(`${rankingQ.id}-${photo.id}`);
        }
      }
    }
  }

  return headers;
}

/**
 * Builds a single Google Sheets row from the submission payload.
 * Values are stored strictly in canonical English with numeric types.
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

  // Photo ratings and Photo rankings
  for (const page of survey.pages) {
    for (const q of page.questions) {
      if (q.type === 'photo_rating') {
        const ratingQ = q as PhotoRatingQuestion;
        const ratingVal = answers[ratingQ.id];
        row.push(ratingVal !== undefined && ratingVal !== '' ? Number(ratingVal) : '');
      } else if (q.type === 'photo_ranking') {
        const rankingQ = q as PhotoRankingQuestion;
        const rankingArr = (answers[rankingQ.id] as string[]) || [];

        for (const photo of rankingQ.photos) {
          const rankIndex = rankingArr.indexOf(photo.id);
          // If found in array: rank is 1-indexed (1 to 4)
          if (rankIndex >= 0) {
            row.push(rankIndex + 1);
          } else {
            row.push('');
          }
        }
      }
    }
  }

  return row;
}
