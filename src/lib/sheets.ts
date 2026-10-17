import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Normalizes Google private key to handle newline characters and surrounding quotes.
 */
function getPrivateKey(): string {
  let key = process.env.GOOGLE_PRIVATE_KEY || '';
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, '\n');
}

/**
 * Creates an authorized Google Sheets API client.
 */
export function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getPrivateKey();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error(
      'Google Sheets credentials missing. Ensure GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID are set in environment variables.'
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return { sheets, spreadsheetId };
}

/**
 * Ensures that the target tab (e.g. 'Responses') exists in the spreadsheet.
 * Automatically creates it or renames the default sheet (such as 'Sheet1' or 'الورقة1').
 */
export async function ensureSheetTabExists(
  tabName: string = 'Responses'
): Promise<void> {
  const { sheets, spreadsheetId } = getSheetsClient();
  const res = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetList = res.data.sheets || [];
  const exists = sheetList.some((s) => s.properties?.title === tabName);

  if (exists) return;

  // If there's only one default sheet (like 'Sheet1' or 'الورقة1'), rename it directly
  if (sheetList.length === 1 && sheetList[0].properties?.sheetId !== undefined) {
    const firstSheetId = sheetList[0].properties.sheetId;
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId: firstSheetId,
                title: tabName,
              },
              fields: 'title',
            },
          },
        ],
      },
    });
    return;
  }

  // Otherwise, add a new tab with tabName
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: tabName,
            },
          },
        },
      ],
    },
  });
}

/**
 * Appends a new response row to the Responses sheet tab.
 */
export async function appendSurveyResponse(
  row: (string | number)[],
  tabName: string = 'Responses'
): Promise<void> {
  await ensureSheetTabExists(tabName);
  const { sheets, spreadsheetId } = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tabName}!A:A`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [row],
    },
  });
}

/**
 * Initializes the header row on the Responses tab.
 */
export async function initializeSheetHeaders(
  headers: string[],
  tabName: string = 'Responses'
): Promise<void> {
  await ensureSheetTabExists(tabName);
  const { sheets, spreadsheetId } = getSheetsClient();

  // Write headers to Row 1
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${tabName}!A1`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [headers],
    },
  });
}
