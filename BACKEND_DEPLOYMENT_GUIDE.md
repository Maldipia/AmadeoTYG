# Google Apps Script Backend Deployment Guide

## Problem
The login is failing because the backend deployment is not configured correctly. The API returns "Page not found" error.

## Solution: Deploy Backend Correctly

### Step 1: Open Apps Script Editor
1. Go to your Google Sheet: https://docs.google.com/spreadsheets/d/1GXl6tPmofpgdnpEIuts8gSLYAw9roTQegKrgSjYaErA/edit
2. Click **Extensions** → **Apps Script**

### Step 2: Replace Code
1. Delete ALL existing code in the editor
2. Go to: https://raw.githubusercontent.com/Maldipia/AmadeoTYG/main/Code.gs
3. Copy ALL the code (Ctrl+A, Ctrl+C)
4. Paste into Apps Script editor (Ctrl+V)
5. Click **Save** (💾 icon or Ctrl+S)

### Step 3: Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Fill in the settings:
   - **Description**: "Amadeo Marketplace API v1"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** ⚠️ IMPORTANT!
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to [project name] (unsafe)**
9. Click **Allow**
10. Copy the **Web app URL** (starts with `https://script.google.com/macros/s/...`)

### Step 4: Update Frontend
Send me the new Web app URL and I'll update the frontend files.

---

## Common Issues

### Issue: "Page not found" error
**Cause**: Deployment access is not set to "Anyone"
**Fix**: Redeploy and make sure "Who has access" is set to **Anyone**

### Issue: "Invalid email or password" even with correct credentials
**Cause**: Old version of code is deployed
**Fix**: Make sure you copied the latest Code.gs from GitHub before deploying

### Issue: Authorization popup keeps appearing
**Cause**: Script needs permissions
**Fix**: Click "Advanced" → "Go to project (unsafe)" → "Allow"

---

## Verification

After deploying, test the API with this command in your browser console (F12):

```javascript
fetch('YOUR_WEB_APP_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: JSON.stringify({
    action: 'merchantLogin',
    email: 'musthavecor@gmail.com',
    password: 'amadeo123'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "MerchantId": "M1765...",
    "BusinessName": "MustHaveCorner",
    "Email": "musthavecor@gmail.com",
    ...
  },
  "message": "Login successful"
}
```

If you see this response, the backend is working correctly!
