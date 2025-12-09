# Amadeo Marketplace - Deployment Instructions

## ✅ Changes Completed

### 1. **Fixed Image Upload Issue**
- Replaced `DriveApp.getFolderById()` with `DriveApp.createFile()` in the backend
- Images are now uploaded directly without folder access issues
- All uploaded images are automatically set to public sharing

### 2. **Product Variants Feature**
- Added support for products with multiple variants (sizes, weights, etc.)
- Example: Eggs can have "Dozen (516g) - ₱132", "Dozen (600g) - ₱144", "Tray (1290g) - ₱270"
- New database columns: `HasVariants`, `Variants`, `StockLevel`

### 3. **Frontend Updates**
- **Dashboard (dashboard.html)**: 
  - Image upload with preview
  - Variant management UI
  - Image validation (required for all products)
- **Storefront (index.html)**:
  - Variant selector modal
  - Cart support for product variants

---

## 🚀 Deployment Steps

### Step 1: Deploy Google Apps Script Backend

1. **Open Google Apps Script**
   - Go to: https://script.google.com/home/projects/1Qh_vCyqRXxPqcqJGYJLHwGcVnKxGHQHPQrFHwjJZLQQHQHQHQHQHQ (or your Apps Script project)
   - Or create a new project if needed

2. **Copy the Backend Code**
   - Open the file `Code.gs` from this repository
   - Copy the entire contents
   - Paste into your Apps Script editor (replace all existing code)

3. **Run Schema Setup (ONE TIME ONLY)**
   - In the Apps Script editor, select the function `setupCompleteSchema` from the dropdown
   - Click "Run" (▶️ button)
   - Authorize the script when prompted
   - Check the execution log to verify columns were added successfully

4. **Deploy as Web App**
   - Click "Deploy" → "New deployment"
   - Click the gear icon ⚙️ next to "Select type"
   - Choose "Web app"
   - Configure:
     - **Description**: "v3.2 - Image upload fix + Variants"
     - **Execute as**: Me (your email)
     - **Who has access**: Anyone
   - Click "Deploy"
   - **IMPORTANT**: Copy the Web App URL (looks like: `https://script.google.com/macros/s/AKfycbw.../exec`)

5. **Update Frontend API URL**
   - The current API URL in the code is:
     ```
     https://script.google.com/macros/s/AKfycbwgHmmK1j8a6rqx_Zfk5nPGqdUIRSo1oIUNgGoVr2-in988F3K8Kyp8PN15zHS3InIUgw/exec
     ```
   - If you deployed a new version, update this URL in:
     - `dashboard.html` (search for `const API=`)
     - `index.html` (search for `const API_BASE=`)

---

### Step 2: Verify Vercel Deployment

The frontend has been automatically deployed to Vercel via GitHub integration.

**Latest Deployment:**
- **Status**: ✅ READY
- **URL**: https://amadeo-n92e90r6i-maldipias-projects.vercel.app
- **Production URL**: https://amadeomarketplace.com (if custom domain is configured)
- **Commit**: `edd332a` - "Fix image upload & add product variants feature"

**To check deployment:**
1. Visit: https://vercel.com/maldipias-projects/amadeo-tyg
2. Verify the latest deployment shows "READY" status
3. Click the deployment URL to test the site

---

### Step 3: Test the Features

#### Test Image Upload
1. Log in to merchant dashboard: https://amadeomarketplace.com/dashboard
2. Click "Add Product"
3. Upload an image using the file picker
4. Verify image preview appears
5. Save the product
6. Check that the image displays on the storefront

#### Test Product Variants
1. In merchant dashboard, click "Add Product"
2. Check the "This product has variants" checkbox
3. Click "+ Add Variant"
4. Add variants like:
   - Name: "Dozen (600g)", Price: 144
   - Name: "Tray (1290g)", Price: 270
5. Save the product
6. Go to storefront and click the product
7. Verify variant selector modal appears
8. Select a variant and add to cart
9. Check cart shows the correct variant name and price

---

## 📋 Database Schema Changes

The `setupCompleteSchema()` function adds these columns:

### Products Sheet
- `HasVariants` (TRUE/FALSE) - Whether product has multiple variants
- `Variants` (JSON string) - Array of variant objects: `[{name:"Dozen 600g", price:144}]`
- `StockLevel` (number) - Inventory count

### Existing Columns (Preserved)
- All existing columns remain unchanged
- No data is deleted or truncated

---

## 🔐 Security Notes

1. **Image Upload**
   - Images are uploaded to your Google Drive
   - Automatically set to "Anyone with link can view"
   - Uses Google's CDN for fast delivery

2. **API Access**
   - Web App is set to "Anyone" access (required for public storefront)
   - Customer data is filtered server-side (phone number required)
   - No sensitive merchant data exposed to public endpoints

---

## 🐛 Troubleshooting

### Image Upload Fails
- **Error**: "Exception: Unexpected error while getting the method or property getFolderById"
- **Solution**: Make sure you deployed the NEW `Code.gs` file (v3.2)

### Variants Not Showing
- **Issue**: Variants don't appear on storefront
- **Check**: 
  1. Run `setupCompleteSchema()` in Apps Script
  2. Verify `HasVariants` column exists in Products sheet
  3. Check browser console for JSON parse errors

### Deployment Not Live
- **Issue**: Changes not visible on website
- **Solution**:
  1. Check Vercel deployment status
  2. Clear browser cache (Ctrl+Shift+R)
  3. Verify correct API URL in frontend files

---

## 📞 Support

If you encounter issues:
1. Check the Apps Script execution logs
2. Check Vercel deployment logs
3. Check browser console for errors
4. Verify Google Sheet has all required columns

---

## 🎯 Next Steps

1. ✅ Deploy backend (Code.gs)
2. ✅ Run setupCompleteSchema()
3. ✅ Verify Vercel deployment
4. ✅ Test image upload
5. ✅ Test product variants
6. 📢 Notify merchants about new features!

---

**Deployment Date**: December 9, 2025  
**Version**: 3.2  
**Commit**: edd332a
