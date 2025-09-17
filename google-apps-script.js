// Google Apps Script for handling Cicada Challenge submissions
// Deploy this as a Web App to get the URL for GOOGLE_SHEETS_CONFIG.WEBAPP_URL

// IMPORTANT: Replace 'YOUR_SPREADSHEET_ID' with your actual Google Sheets ID
// You can find this in your Google Sheets URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
const SPREADSHEET_ID = "1QCKcCp3iWGYPFKIy2-3h_tkHdhN5H-7T6PzGjEOKrJw"; // Replace with your actual spreadsheet ID
const SHEET_NAME = "Submissions";

function doPost(e) {
  console.log("Received POST request");
  console.log("Request data:", e.postData);

  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    console.log("Parsed data:", data);

    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // Create the sheet if it doesn't exist
    if (!sheet) {
      console.log("Creating new sheet:", SHEET_NAME);
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Add headers
      sheet
        .getRange(1, 1, 1, 6)
        .setValues([
          [
            "User ID",
            "Completion Time",
            "Time Taken (seconds)",
            "Timestamp",
            "Date",
            "Time of Day",
          ],
        ]);
    }

    // Add the new submission
    const rowData = [
      data.userId,
      data.completionTime,
      data.timeTaken,
      data.timestamp,
      data.date,
      data.timeOfDay,
    ];

    console.log("Adding row:", rowData);
    sheet.appendRow(rowData);

    console.log("Successfully added submission");
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Submission recorded successfully",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Error in doPost:", error);
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Optional: Handle GET requests to retrieve data
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "Sheet not found" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, data: data })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
