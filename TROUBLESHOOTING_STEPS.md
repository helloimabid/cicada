# Troubleshooting Google Sheets Integration

## Step 1: Get Your Spreadsheet ID

1. Open your "Cicada Challenge Submissions" Google Sheet
2. Look at the URL in your browser. It should look like:
   ```
   https://docs.google.com/spreadsheets/d/1QCKcCp3iWGYPFKIy2-3h_tkHdhN5H-7T6PzGjEOKrJw/edit#gid=0
   ```
3. Copy the long string between `/d/` and `/edit` - this is your spreadsheet ID
4. In this example, the ID is: `1QCKcCp3iWGYPFKIy2-3h_tkHdhN5H-7T6PzGjEOKrJw`

## Step 2: Update Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Find your "Cicada Submissions Handler" project
3. Replace this line:
   ```javascript
   const SPREADSHEET_ID = '1QCKcCp3iWGYPFKIy2-3h_tkHdhN5H-7T6PzGjEOKrJw';
   ```
   With your actual spreadsheet ID:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_ACTUAL_SPREADSHEET_ID_HERE';
   ```
4. Save the script (Ctrl+S)
5. **IMPORTANT**: Click "Deploy" > "Manage Deployments" > Click the edit icon (pencil) > "New Version" > "Deploy"

## Step 3: Test the Integration

1. Open your website
2. Complete a challenge (use CICADA-001 with solution "THEFIRSTKEY" for stage 1 and "the path found now" for stage 2)
3. Check the browser console (F12 > Console) for any error messages
4. Look for these messages:
   - "Attempting to submit to Google Sheets"
   - "Using Google Apps Script Web App"
   - "Google Apps Script response status"

## Step 4: Common Issues and Solutions

### Issue: "Google Apps Script response status: 0"
**Solution**: This is normal for Google Apps Script. The submission likely worked.

### Issue: Console shows errors about CORS
**Solution**: Google Apps Script handles CORS automatically, but you may need to redeploy your script.

### Issue: No data appears in the sheet
**Possible causes**:
1. Wrong spreadsheet ID in the Google Apps Script
2. Wrong sheet name (should be "Submissions")
3. Script not properly deployed
4. Script permissions not granted

### Issue: "Failed to record submission"
**Check**:
1. Browser console for detailed error messages
2. Google Apps Script execution logs (in Apps Script editor: Executions tab)
3. Verify the Web App URL is correct in `index.html`

## Step 5: Verify Google Apps Script Permissions

1. In Google Apps Script, go to your project
2. Click the execution log icon (looks like a play button with lines)
3. If you see permission errors, click on the function name and grant permissions
4. Make sure you allow access to Google Sheets

## Manual Testing

You can test your Google Apps Script directly:
1. In the Apps Script editor, select the `doPost` function
2. Click "Run" to test (it will fail but show you permission issues)
3. Or use the web app URL directly in a tool like Postman

## Still Not Working?

1. Check the Google Apps Script execution logs
2. Look at browser console for JavaScript errors
3. Verify the Web App URL is exactly correct
4. Make sure the sheet is named "Submissions" (case-sensitive)
5. Ensure you redeployed after making changes