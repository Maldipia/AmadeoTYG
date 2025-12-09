# 🧪 Amadeo Marketplace - Testing Checklist

## ✅ Deployment Status

**Backend**: ✅ Deployed (Version 29, Dec 9, 2025, 2:37 PM)
- **URL**: `https://script.google.com/macros/s/AKfycbwCKdfyB8Zy5jBDPGq00WnuxSV4tgOqvSI0QUruW-LTNh1vmkM2mmVoVfTed5aqdGhu8A/exec`

**Frontend**: ✅ Deployed to Vercel
- **Latest Deployment**: `dpl_5FwnCkqMBTaKPTuEsBuwDUPu5hAa` (READY)
- **Commit**: `c40a292` - "Update API URLs to new backend deployment (v29)"
- **Production URL**: https://amadeomarketplace.com

---

## 🧪 Test Scenarios

### 1. Image Upload Feature

#### Test 1.1: Upload Product Image from Dashboard
- [ ] Navigate to: https://amadeomarketplace.com/dashboard
- [ ] Log in with merchant credentials
- [ ] Click "Add Product" button
- [ ] Fill in product details:
  - Name: "Test Product"
  - Price: 100
  - Stock: 10
  - Category: "Food & Beverages"
- [ ] Click "Choose File" and select an image (JPG/PNG)
- [ ] **Expected**: Image preview appears below the file input
- [ ] Click "Save Product"
- [ ] **Expected**: Success message "Product saved!"
- [ ] **Expected**: Product appears in products list with image

#### Test 1.2: Verify Image on Storefront
- [ ] Navigate to: https://amadeomarketplace.com
- [ ] Scroll to "Products" section
- [ ] **Expected**: Test product appears with uploaded image
- [ ] Click on the product card
- [ ] **Expected**: Image displays correctly in product view

#### Test 1.3: Image Upload Validation
- [ ] Go to dashboard → Add Product
- [ ] Fill in all fields EXCEPT image
- [ ] Click "Save Product"
- [ ] **Expected**: Alert "Product image is required!"
- [ ] **Expected**: Product is NOT saved

---

### 2. Product Variants Feature

#### Test 2.1: Create Product with Variants
- [ ] Dashboard → Add Product
- [ ] Fill in basic details:
  - Name: "Fresh Eggs"
  - Category: "Fresh Produce"
  - Upload an image
- [ ] Check the box "This product has variants"
- [ ] **Expected**: Variants section appears
- [ ] Click "+ Add Variant"
- [ ] **Expected**: Variant input fields appear
- [ ] Add first variant:
  - Name: "Dozen (600g)"
  - Price: 144
- [ ] Click "+ Add Variant" again
- [ ] Add second variant:
  - Name: "Tray (1290g)"
  - Price: 270
- [ ] Click "Save Product"
- [ ] **Expected**: Success message
- [ ] **Expected**: Product saved with variants

#### Test 2.2: View Variants on Storefront
- [ ] Navigate to: https://amadeomarketplace.com
- [ ] Find "Fresh Eggs" product
- [ ] Click on the product card
- [ ] **Expected**: Variant selector modal appears
- [ ] **Expected**: Shows both variants with names and prices:
  - "Dozen (600g) - ₱144.00"
  - "Tray (1290g) - ₱270.00"

#### Test 2.3: Add Variant to Cart
- [ ] In the variant selector modal, click on "Dozen (600g)"
- [ ] **Expected**: Alert "Added to cart: Fresh Eggs - Dozen (600g)"
- [ ] **Expected**: Modal closes
- [ ] **Expected**: Cart badge updates (shows 1 item)
- [ ] Click cart icon in header
- [ ] **Expected**: Cart shows "Fresh Eggs - Dozen (600g)" with price ₱144.00
- [ ] Close cart and click product again
- [ ] Select "Tray (1290g)" variant
- [ ] **Expected**: Cart now shows 2 items (both variants)

#### Test 2.4: Checkout with Variants
- [ ] Open cart
- [ ] Click "Checkout"
- [ ] Fill in customer details
- [ ] Complete checkout
- [ ] **Expected**: Order confirmation shows variant names
- [ ] Check merchant dashboard → Orders
- [ ] **Expected**: Order items show variant information

---

### 3. Edit Product with Variants

#### Test 3.1: Edit Existing Variant Product
- [ ] Dashboard → Products
- [ ] Find "Fresh Eggs" product
- [ ] Click "Edit"
- [ ] **Expected**: Variants section is checked and expanded
- [ ] **Expected**: Existing variants are displayed
- [ ] Modify first variant price to 150
- [ ] Click "+ Add Variant"
- [ ] Add third variant:
  - Name: "Half Dozen (300g)"
  - Price: 75
- [ ] Click "Save Product"
- [ ] **Expected**: Changes saved successfully
- [ ] Go to storefront and verify all 3 variants appear

#### Test 3.2: Remove Variant
- [ ] Dashboard → Edit "Fresh Eggs"
- [ ] Click "×" button next to "Half Dozen" variant
- [ ] **Expected**: Variant removed from list
- [ ] Save product
- [ ] **Expected**: Only 2 variants remain

---

### 4. Regular Product (No Variants)

#### Test 4.1: Create Regular Product
- [ ] Dashboard → Add Product
- [ ] Fill in details (do NOT check variants box)
- [ ] Upload image
- [ ] Save product
- [ ] **Expected**: Product saved without variants

#### Test 4.2: Regular Product on Storefront
- [ ] Find regular product on storefront
- [ ] Click product card
- [ ] **Expected**: Simple confirm dialog (not variant selector)
- [ ] Click OK
- [ ] **Expected**: Product added to cart directly

---

### 5. Backend API Tests

#### Test 5.1: Test getAllInventory Endpoint
- [ ] Open browser console
- [ ] Run:
```javascript
fetch('https://script.google.com/macros/s/AKfycbwCKdfyB8Zy5jBDPGq00WnuxSV4tgOqvSI0QUruW-LTNh1vmkM2mmVoVfTed5aqdGhu8A/exec?action=getAllInventory')
  .then(r => r.json())
  .then(d => console.log(d))
```
- [ ] **Expected**: JSON response with `success: true`
- [ ] **Expected**: Products array with `hasVariants` and `variants` fields

#### Test 5.2: Test Image Upload Endpoint
- [ ] Dashboard → Add Product with image
- [ ] Open browser Network tab
- [ ] Save product
- [ ] Find POST request to Apps Script URL
- [ ] Check request payload
- [ ] **Expected**: Contains `imageData` field with base64 string
- [ ] Check response
- [ ] **Expected**: Contains `imageUrl` with Google Drive link

---

### 6. Database Verification

#### Test 6.1: Check Products Sheet
- [ ] Open Google Sheet: `1GXl6tPmofpgdnpEIuts8gSLYAw9roTQegKrgSjYaErA`
- [ ] Go to "Products" sheet
- [ ] **Expected**: Columns exist:
  - HasVariants (TRUE/FALSE)
  - Variants (JSON string)
  - StockLevel (number)
- [ ] Find product with variants
- [ ] **Expected**: HasVariants = TRUE
- [ ] **Expected**: Variants = `[{"name":"Dozen (600g)","price":144}]`

#### Test 6.2: Check Image URLs
- [ ] In Products sheet, check Image column
- [ ] **Expected**: URLs start with `https://lh3.googleusercontent.com/d/`
- [ ] Copy an image URL and paste in browser
- [ ] **Expected**: Image loads successfully

---

## 🐛 Known Issues to Watch For

### Issue 1: Image Upload Fails
**Symptoms**: Error message when saving product with image
**Check**: 
- Browser console for errors
- Apps Script execution logs
- Verify backend deployment is v29

### Issue 2: Variants Not Showing
**Symptoms**: Variant selector doesn't appear on storefront
**Check**:
- Browser console for JSON parse errors
- Verify `HasVariants` column exists in sheet
- Check product data in sheet has valid JSON in Variants column

### Issue 3: Cart Shows Wrong Variant
**Symptoms**: Cart displays incorrect variant name or price
**Check**:
- Browser localStorage (clear if needed)
- Verify variant index is correct
- Check cart item ID format

---

## ✅ Success Criteria

All tests must pass:
- [x] Backend deployed successfully (v29)
- [x] Frontend deployed to Vercel (READY)
- [ ] Merchants can upload product images
- [ ] Images display on storefront
- [ ] Merchants can create products with variants
- [ ] Customers can select variants
- [ ] Cart handles variants correctly
- [ ] Orders include variant information
- [ ] Database schema updated correctly

---

## 📞 Troubleshooting

**If tests fail:**
1. Check browser console for JavaScript errors
2. Check Network tab for failed API calls
3. Verify Apps Script execution logs
4. Clear browser cache and localStorage
5. Try in incognito/private browsing mode
6. Check Google Sheet for data integrity

**Get Help:**
- Review `DEPLOYMENT_INSTRUCTIONS.md`
- Check `BACKEND_DEPLOYMENT_QUICKSTART.md`
- Verify API URLs match in frontend files

---

**Testing Date**: December 9, 2025  
**Version**: 3.2  
**Tester**: _________________  
**Status**: ⏳ Pending Testing
