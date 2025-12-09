# 🚀 Quick Start: Deploy Google Apps Script Backend

## Copy This Code to Apps Script

**Apps Script URL**: https://script.google.com/macros/s/AKfycbwgHmmK1j8a6rqx_Zfk5nPGqdUIRSo1oIUNgGoVr2-in988F3K8Kyp8PN15zHS3InIUgw/exec

### Step-by-Step:

1. **Open your Google Apps Script project** (linked to spreadsheet ID: `1GXl6tPmofpgdnpEIuts8gSLYAw9roTQegKrgSjYaErA`)

2. **Replace ALL code with the contents of `Code.gs`** from this repository

3. **Run the setup function ONCE**:
   - Select `setupCompleteSchema` from the function dropdown
   - Click Run ▶️
   - Authorize when prompted
   - Wait for "Execution completed" message

4. **Deploy as Web App**:
   - Click "Deploy" → "New deployment"
   - Select "Web app" type
   - Set:
     - Execute as: **Me**
     - Who has access: **Anyone**
   - Click "Deploy"
   - Copy the new Web App URL

5. **Update the frontend** (if URL changed):
   - Edit `dashboard.html` line ~580: `const API='YOUR_NEW_URL'`
   - Edit `index.html` line ~1200: `const API_BASE='YOUR_NEW_URL'`

---

## What's New in v3.2?

### ✅ Fixed Image Upload
```javascript
// OLD (broken):
DriveApp.getFolderById(folderId).createFile(blob)

// NEW (working):
DriveApp.createFile(blob)
file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
```

### ✅ Product Variants Support
```javascript
// Example variant data:
{
  "hasVariants": true,
  "variants": [
    {"name": "Dozen (516g)", "price": 132},
    {"name": "Dozen (600g)", "price": 144},
    {"name": "Tray (1290g)", "price": 270}
  ]
}
```

### ✅ New API Endpoints
- `uploadImage` - Upload product/payment images
- `getCustomerOrders` - Get orders filtered by phone (secure)
- `deleteProduct` - Remove products

### ✅ New Database Columns
- `Products.HasVariants` (TRUE/FALSE)
- `Products.Variants` (JSON string)
- `Products.StockLevel` (number)

---

## Test Checklist

After deployment, test these:

- [ ] Merchant can upload product image
- [ ] Image appears on storefront
- [ ] Merchant can add product variants
- [ ] Customer sees variant selector on storefront
- [ ] Customer can add variant to cart
- [ ] Cart shows correct variant name and price
- [ ] Order includes variant information

---

## Current Configuration

**Spreadsheet ID**: `1GXl6tPmofpgdnpEIuts8gSLYAw9roTQegKrgSjYaErA`

**Drive Folders**:
- Products: `1YgKpxGg27aEsb1v6Xf2oow-LNbNyYN8s`
- Merchants: `174aqufKO2WY5PMS4DgI0sk4tywCn7pQ8`
- Payments: `1_wGFHri8lcvhiD31Y1TGnDKe1b7DEqHV`

**Note**: Folder IDs are still in config but no longer used for image upload (images go to root Drive)

---

## Troubleshooting

**"Script not authorized"**
- Click "Review Permissions" → Select your Google account → "Allow"

**"setupCompleteSchema is not defined"**
- Make sure you copied the ENTIRE `Code.gs` file

**"Column already exists"**
- This is normal! The script checks before adding columns

**Images not uploading**
- Verify you deployed the NEW version (v3.2)
- Check Apps Script execution logs for errors

---

**Need Help?** Check `DEPLOYMENT_INSTRUCTIONS.md` for detailed troubleshooting.
