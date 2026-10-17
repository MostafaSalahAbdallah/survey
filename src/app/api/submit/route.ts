import { NextRequest, NextResponse } from 'next/server';
import surveyData from '@/data/survey.json';
import { SurveyConfig, SubmitPayload } from '@/lib/types';
import { validateAllAnswers } from '@/lib/validate';
import { buildRowFromAnswers } from '@/lib/buildRow';
import { appendSurveyResponse } from '@/lib/sheets';

const survey = surveyData as unknown as SurveyConfig;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = body as SubmitPayload;

    if (!payload || !payload.answers || !payload.language) {
      return NextResponse.json(
        { ok: false, error: 'Invalid submission payload format.' },
        { status: 400 }
      );
    }

    // 1. Re-validate answers server-side
    const { isValid, errors } = validateAllAnswers(survey, payload.answers);
    if (!isValid) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Validation failed for one or more answers.',
          details: errors,
        },
        { status: 422 }
      );
    }

    // 2. Sanitize and ensure payload metadata
    const submissionId =
      payload.submission_id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : `sub_${Date.now()}`);
    const timestamp = payload.timestamp || new Date().toISOString();
    const duration = typeof payload.duration_seconds === 'number' ? payload.duration_seconds : 0;

    const normalizedPayload: SubmitPayload = {
      submission_id: submissionId,
      timestamp,
      language: payload.language,
      duration_seconds: duration,
      answers: payload.answers,
    };

    // 3. Build canonical row
    const row = buildRowFromAnswers(survey, normalizedPayload);

    // 4. Append to Google Sheets
    // Check if Google credentials are configured
    const hasGoogleEnv =
      Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) &&
      Boolean(process.env.GOOGLE_PRIVATE_KEY) &&
      Boolean(process.env.GOOGLE_SHEET_ID);

    if (!hasGoogleEnv) {
      console.warn(
        '[Dr. Nehmedo Survey API] GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, or GOOGLE_SHEET_ID is not configured in environment variables. Set them in .env.local for production sheet appending.'
      );
      // For local testing without credentials, we log the row and still return success
      // so testing the survey flow works without requiring Google credentials immediately.
      console.log('[Dr. Nehmedo Survey API] Submission received (Demo Mode):', {
        submissionId,
        rowLength: row.length,
        rowPreview: row.slice(0, 9),
      });

      return NextResponse.json({
        ok: true,
        submission_id: submissionId,
        note: 'Saved in demo mode (configure Google Sheets credentials in .env.local to write to actual spreadsheet)',
      });
    }

    await appendSurveyResponse(row);

    return NextResponse.json({
      ok: true,
      submission_id: submissionId,
    });
  } catch (error: any) {
    console.error('[Dr. Nehmedo Survey API] Error appending to sheet:', error?.message || error);
    return NextResponse.json(
      {
        ok: false,
        error:
          'Failed to record survey response to Google Sheets. Please ensure service account permissions are configured.',
      },
      { status: 500 }
    );
  }
}
