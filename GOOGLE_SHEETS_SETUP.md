# Google Sheets Integration Setup Guide

## Overview
Your Cicada Challenge app now records successful submissions to Google Sheets, including:
- User ID
- Completion time (formatted)
- Time taken (in seconds)
- Timestamp (ISO format)
- Date and time of submission

## Setup Instructions

### Option 1: Google Apps Script (Recommended)

1. **Create a Google Sheet:**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet
   - Name it "Cicada Challenge Submissions" (or any name you prefer)
   - Copy the spreadsheet ID from the URL (between `/d/` and `/edit`)

2. **Set up Google Apps Script:**
   - Go to [Google Apps Script](https://script.google.com)
   - Click "New Project"
   - Replace the default code with the contents of `google-apps-script.js`
   - Replace `YOUR_SPREADSHEET_ID` with your actual spreadsheet ID
   - Save the project (give it a name like "Cicada Submissions Handler")

3. **Deploy as Web App:**
   - Click "Deploy" > "New Deployment"
   - Choose type: "Web app"
   - Set execute as: "Me"
   - Set access: "Anyone" (required for your website to access it)
   - Click "Deploy"
   - Copy the web app URL

4. **Update your website:**
   - In `index.html`, replace `YOUR_SCRIPT_ID` in the WEBAPP_URL with your web app URL
   - Example: `https://script.google.com/macros/s/AKfycby.../exec`

### Option 2: Direct Google Sheets API (Alternative)

1. **Enable Google Sheets API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable the Google Sheets API
   - Create credentials (API Key)

2. **Set up your spreadsheet:**
   - Create a Google Sheet as in Option 1
   - Make it publicly accessible or set proper sharing permissions

3. **Update configuration:**
   - Replace `YOUR_API_KEY` with your API key
   - Replace `YOUR_SPREADSHEET_ID` with your spreadsheet ID

## Testing

1. Complete a challenge on your website
2. Check your Google Sheet - you should see a new row with the submission data
3. The website will show a status message indicating success or failure

## Data Structure

The Google Sheet will contain these columns:
- **User ID**: The CICADA identifier (e.g., CICADA-001)
- **Completion Time**: Formatted time (e.g., "05:23")
- **Time Taken (seconds)**: Raw seconds for calculations
- **Timestamp**: ISO timestamp for precise tracking
- **Date**: Human-readable date
- **Time of Day**: Human-readable time

## Troubleshooting

- **"Recording submission..." stays forever**: Check browser console for errors
- **"Could not record to Google Sheets"**: Verify your configuration settings
- **"Failed to record submission"**: Check Google Apps Script logs or API quotas
- **No data in sheets**: Verify spreadsheet ID and permissions

## Security Notes

- The Google Apps Script method is more secure as it doesn't expose API keys
- For production use, consider implementing authentication for the web app
- Monitor your Google Apps Script quotas and API usage

## Support

If you encounter issues:
1. Check browser developer console for JavaScript errors
2. Check Google Apps Script execution logs
3. Verify all IDs and URLs are correctly copied
4. Ensure proper permissions are set on Google Drive/Sheets