/**
 * Future-Life Diagnostics — Bookings logger (Google Apps Script).
 *
 * SETUP
 * 1. Create a Google Sheet (e.g. "Future-Life Bookings").
 * 2. Extensions -> Apps Script. Delete any code, paste this file in.
 * 3. Set TOKEN below to a long random string (your shared secret).
 * 4. Deploy -> New deployment -> type "Web app":
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Copy the Web app URL.
 * 5. In Netlify env vars set:
 *      SHEETS_WEBHOOK_URL = <the Web app URL>
 *      SHEETS_TOKEN       = <the same TOKEN value>
 *
 * The website logs each booking as "Pending Payment", then the payment
 * webhook upgrades the same row (matched by Booking Ref) to "Paid".
 */

const TOKEN = "CHANGE_ME_to_a_long_random_secret";
const SHEET_NAME = "Bookings";
const HEADERS = [
  "Timestamp", "Booking Ref", "Status", "Service", "Amount", "Currency",
  "First Name", "Last Name", "Email", "Phone", "Preferred Appointment", "Paid At",
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    if (body.token !== TOKEN) {
      return ContentService.createTextOutput("unauthorized");
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    const ref = String(body.tx_ref || "");
    const lastRow = sheet.getLastRow();

    // Find an existing row with the same Booking Ref (column 2).
    let targetRow = 0;
    if (ref && lastRow > 1) {
      const refs = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (let i = 0; i < refs.length; i++) {
        if (String(refs[i][0]) === ref) { targetRow = i + 2; break; }
      }
    }

    if (targetRow) {
      // Update status + paid-at on the existing row.
      if (body.status) sheet.getRange(targetRow, 3).setValue(body.status);
      if (body.paid_at) sheet.getRange(targetRow, 12).setValue(body.paid_at);
    } else {
      sheet.appendRow([
        body.created_at || new Date().toISOString(),
        ref,
        body.status || "",
        body.service || "",
        body.amount || "",
        body.currency || "",
        body.first_name || "",
        body.last_name || "",
        body.email || "",
        body.phone || "",
        body.appointment || "",
        body.paid_at || "",
      ]);
    }

    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error: " + err);
  }
}
