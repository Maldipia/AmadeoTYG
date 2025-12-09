# 📝 How to Deploy Google Apps Script Backend

## Step-by-Step Instructions

### Step 1: Open Your Google Apps Script Project

1. Go to your Google Sheets spreadsheet: 
   - Spreadsheet ID: `1GXl6tPmofpgdnpEIuts8gSLYAw9roTQegKrgSjYaErA`
   - Or visit: https://docs.google.com/spreadsheets/d/1GXl6tPmofpgdnpEIuts8gSLYAw9roTQegKrgSjYaErA/edit

2. Click **Extensions** → **Apps Script**

3. This will open the Apps Script editor in a new tab

---

### Step 2: Copy the Backend Code

**Option A: From GitHub**
1. Go to: https://github.com/Maldipia/AmadeoTYG/blob/main/Code.gs
2. Click the "Copy raw file" button (top right of code view)
3. The entire code is now in your clipboard

**Option B: From the file**
1. Open the file `Code.gs` from the repository
2. Select all text (Ctrl+A or Cmd+A)
3. Copy (Ctrl+C or Cmd+C)

---

### Step 3: Paste into Apps Script Editor

1. In the Apps Script editor, you should see a file called `Code.gs` in the left sidebar
2. Click on `Code.gs` to open it
3. **Select ALL existing code** (Ctrl+A or Cmd+A)
4. **Delete it** (press Delete or Backspace)
5. **Paste the new code** (Ctrl+V or Cmd+V)
6. Click the **Save** icon (💾) or press Ctrl+S

---

### Step 4: Run Setup Function (ONE TIME ONLY)

1. At the top of the editor, find the function dropdown (it might say "Select function")
2. Click the dropdown and select: **`setupCompleteSchema`**
3. Click the **Run** button (▶️ play icon)
4. **First time only**: You'll see "Authorization required"
   - Click "Review permissions"
   - Select your Google account
   - Click "Advanced" (if you see a warning)
   - Click "Go to [Your Project Name] (unsafe)" 
   - Click "Allow"
5. Wait for the execution to complete
6. Check the "Execution log" at the bottom - you should see:
   ```
   ✅ Added "HasVariants" to Products
   ✅ Added "Variants" to Products
   ✅ Added "StockLevel" to Products
   ```

---

### Step 5: Deploy as Web App

1. Click the **Deploy** button (top right, looks like a rocket 🚀)
2. Select **"New deployment"**
3. Click the gear icon ⚙️ next to "Select type"
4. Choose **"Web app"**
5. Fill in the settings:
   - **Description**: `v3.2 - Image upload fix + Product variants`
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
6. Click **Deploy**
7. You'll see a success message with the Web App URL
8. **IMPORTANT**: Copy the entire URL (it looks like this):
   ```
   https://script.google.com/macros/s/AKfycbw.../exec
   ```

---

### Step 6: Update Frontend (If Needed)

**You already did this!** The frontend is already updated with your deployment URL:
```
https://script.google.com/macros/s/AKfycbwCKdfyB8Zy5jBDPGq00WnuxSV4tgOqvSI0QUruW-LTNh1vmkM2mmVoVfTed5aqdGhu8A/exec
```

If you deployed a NEW version and got a DIFFERENT URL, you would need to update:
- `dashboard.html` (line 596)
- `index.html` (line 1267)

But since you already deployed and we updated the URLs, **you're all set!**

---

## ✅ Verification

After deployment, test that it works:

1. Open browser console (F12)
2. Run this command:
```javascript
fetch('https://script.google.com/macros/s/AKfycbwCKdfyB8Zy5jBDPGq00WnuxSV4tgOqvSI0QUruW-LTNh1vmkM2mmVoVfTed5aqdGhu8A/exec?action=getAllInventory')
  .then(r => r.json())
  .then(d => console.log(d))
```

3. You should see a JSON response with `success: true`

---

## 🎯 What This Code Does

### Fixed Image Upload
- **Old code** (broken): `DriveApp.getFolderById(folderId).createFile(blob)`
- **New code** (working): `DriveApp.createFile(blob)`
- Images are uploaded directly to your Google Drive
- Automatically shared publicly for website display

### Product Variants
- Merchants can add multiple variants per product
- Example: Eggs with "Dozen (600g) - ₱144" and "Tray (1290g) - ₱270"
- Stored as JSON in the Products sheet
- Customers select variants before adding to cart

### New Database Columns
The `setupCompleteSchema()` function adds these columns to your Products sheet:
- `HasVariants` - TRUE/FALSE
- `Variants` - JSON array like `[{"name":"Dozen 600g","price":144}]`
- `StockLevel` - Number for inventory tracking

---

## 🐛 Troubleshooting

### "Script not authorized"
- Click "Review Permissions"
- Select your Google account
- Click "Advanced" → "Go to [Project] (unsafe)" → "Allow"

### "setupCompleteSchema is not defined"
- Make sure you pasted the ENTIRE Code.gs file
- Check that you saved the file (Ctrl+S)

### "Execution error"
- Check the execution log for details
- Make sure you're connected to the correct spreadsheet
- Verify the spreadsheet ID in the CONFIG section (line 7)

---

## 📞 Need Help?

If you get stuck:
1. Check the Apps Script execution logs (View → Logs)
2. Verify the spreadsheet ID matches: `1GXl6tPmofpgdnpEIuts8gSLYAw9roTQegKrgSjYaErA`
3. Make sure you're logged into the correct Google account
4. Try refreshing the Apps Script editor

---

**Your backend is already deployed!** This guide is just for reference if you need to redeploy or make changes in the future.
