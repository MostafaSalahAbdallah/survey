import 'dotenv/config';
import * as dotenv from 'dotenv';
import * as path from 'path';
import surveyData from '../src/data/survey.json';
import { SurveyConfig } from '../src/lib/types';
import { getSurveyHeaders } from '../src/lib/buildRow';
import { initializeSheetHeaders } from '../src/lib/sheets';

// Load .env.local as well if present
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('--- Dr. Nehmedo Frontal Smile Survey: Sheet Initializer ---');

  const survey = surveyData as unknown as SurveyConfig;
  const headers = getSurveyHeaders(survey);

  console.log(`\nGenerated ${headers.length} header columns from src/data/survey.json:`);
  headers.forEach((h, i) => console.log(`  ${i + 1}. ${h}`));

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !process.env.GOOGLE_PRIVATE_KEY || !sheetId) {
    console.error('\n❌ ERROR: Google Sheets credentials are not configured in .env.local or environment.');
    console.error('Please configure:');
    console.error('  GOOGLE_SERVICE_ACCOUNT_EMAIL');
    console.error('  GOOGLE_PRIVATE_KEY');
    console.error('  GOOGLE_SHEET_ID');
    console.error('\nSee README.md for instructions.\n');
    process.exit(1);
  }

  console.log(`\nConnecting to Google Sheet ID: ${sheetId}`);
  console.log(`Using Service Account: ${clientEmail}`);
  console.log('Writing header row to sheet tab: Responses...');

  try {
    await initializeSheetHeaders(headers, 'Responses');
    console.log('\n✅ Successfully wrote header row to "Responses" tab!');
  } catch (error: any) {
    console.error('\n❌ Failed to write to Google Sheets:', error?.message || error);
    process.exit(1);
  }
}

main();
