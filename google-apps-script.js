// Google Apps Script for handling Cicada Challenge submissions
// Deploy this as a Web App to get the URL for GOOGLE_SHEETS_CONFIG.WEBAPP_URL

// IMPORTANT: Replace 'YOUR_SPREADSHEET_ID' with your actual Google Sheets ID
// You can find this in your Google Sheets URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
const SPREADSHEET_ID = "1vYdPWA9aVj554Z27LWOgE9eGLnQ4RzxBRMKUi95d5Fo"; // Updated to match index.html
const SHEET_NAME = "Submissions";

function doPost(e) {
  console.log("Received POST request");
  console.log("Post data:", e.postData);
  console.log("Parameters:", e.parameter);

  return handleRequest(e);
}

function doGet(e) {
  console.log("Received GET request");
  console.log("Parameters:", e.parameter);

  return handleRequest(e);
}

function handleRequest(e) {
  // Enhanced logging for debugging
  console.log("=== HANDLING REQUEST ===");
  console.log("Request object:", JSON.stringify(e, null, 2));
  console.log("Spreadsheet ID being used:", SPREADSHEET_ID);
  console.log("Sheet name being used:", SHEET_NAME);

  try {
    let data;

    // Handle different types of data
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      // URL parameters (GET) or form data (POST)
      console.log("Using URL parameters");
      data = e.parameter;
    } else if (e.postData && e.postData.contents) {
      // JSON POST data
      console.log("Parsing JSON data");
      data = JSON.parse(e.postData.contents);
    } else {
      console.error("No data received in request");
      throw new Error("No data received");
    }

    console.log("Processing data:", JSON.stringify(data, null, 2));

    // Ensure we have required fields
    if (!data.userId) {
      console.error("Missing userId in submission data");
      throw new Error("Missing userId in submission data");
    }

    console.log("Attempting to open spreadsheet...");
    // Open the spreadsheet
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      console.log("✅ Successfully opened spreadsheet");

      let sheet = spreadsheet.getSheetByName(SHEET_NAME);
      console.log("Looking for sheet:", SHEET_NAME);

      // Create the sheet if it doesn't exist
      if (!sheet) {
        console.log("Sheet not found, creating new sheet:", SHEET_NAME);
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
        console.log("✅ Created new sheet with headers");
      } else {
        console.log("✅ Found existing sheet");
      }

      // Add the new submission
      const rowData = [
        data.userId || "MISSING",
        data.completionTime || "MISSING",
        data.timeTaken || "MISSING",
        data.timestamp || "MISSING",
        data.date || "MISSING",
        data.timeOfDay || "MISSING",
      ];

      console.log("Adding row data:", JSON.stringify(rowData));
      sheet.appendRow(rowData);
      console.log("✅ Successfully added row to sheet");

      // Get the current row count for verification
      const rowCount = sheet.getLastRow();
      console.log("Current sheet has", rowCount, "rows");

      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          message: "Submission recorded successfully",
          rowCount: rowCount,
          data: rowData,
        })
      ).setMimeType(ContentService.MimeType.JSON);
    } catch (spreadsheetError) {
      console.error("❌ Spreadsheet error:", spreadsheetError.toString());
      console.error("Stack trace:", spreadsheetError.stack);
      throw new Error(
        "Spreadsheet access failed: " + spreadsheetError.toString()
      );
    }
  } catch (error) {
    console.error("Error in handleRequest:", error);
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
