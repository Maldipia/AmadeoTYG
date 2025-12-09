# Force Authorization Steps

## Problem
The Google Apps Script needs authorization to access your Google Sheets and Drive before it can work as a web app.

## Solution: Run the forceAuthorization Function

### Step 1: Copy Updated Code
1. Go to: https://raw.githubusercontent.com/Maldipia/AmadeoTYG/main/Code.gs
2. Select All (Ctrl+A) and Copy (Ctrl+C)
3. Go to your Apps Script editor
4. Delete ALL existing code
5. Paste the new code (Ctrl+V)
6. Click **Save** (💾)

### Step 2: Run Authorization Function
1. In the function dropdown at the top, select **`forceAuthorization`**
2. Click the **Run** button (▶️)
3. A dialog will appear: **"Authorization required"**
4. Click **"Review permissions"**

5. Choose your Google account (tygfsb@gmail.com)
6. You'll see: **"Google hasn't verified this app"**
7. Click **"Advanced"** (at the bottom left)
8. Click **"Go to AMbyTYG (unsafe)"**
9. Review the permissions:
   - See, edit, create, and delete all your Google Sheets spreadsheets
   - See, edit, create, and delete all your Google Drive files
10. Click **"Allow"**
11. Wait for the function to complete
12. Check the **Execution log** - you should see:
    ```
    Authorization successful!
    Spreadsheet ID: 1GXl6tPmofpgdnpEIuts8gSLYAw9roTQegKrgSjYaErA
    Sheet name: Merchants
    Rows: [number]
    ```

### Step 3: Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Type: **Web app**
3. Description: "Amadeo API Authorized"
4. Execute as: **Me**
5. Who has access: **Anyone**
6. Click **Deploy**
7. Copy the Web App URL
8. Send it to me

---

## Why This Is Needed

Google Apps Script requires explicit authorization before it can:
- Access your Google Sheets data
- Upload files to Google Drive
- Run as a public web app

The `forceAuthorization` function triggers all these permissions at once, making the authorization process easier.

---

## Troubleshooting

### "Authorization required" doesn't appear
- Make sure you saved the code first
- Try refreshing the Apps Script page

### "This app isn't verified" warning
- This is normal for personal scripts
- Click "Advanced" → "Go to [project] (unsafe)"
- It's safe because you own the script

### Function fails with error
- Check that CONFIG.SPREADSHEET_ID matches your sheet
- Make sure you have edit access to the spreadsheet
- Try running the function again

---

## After Authorization

Once authorized, your web app deployment will work correctly and the login page will be able to authenticate users!
