# Raffle System - Complete Deployment Guide

## 🎯 Overview

This guide will walk you through deploying the complete raffle system in **30 minutes**.

**What you'll accomplish:**
1. Set up 3 new Google Sheets tabs
2. Add raffle system code to Apps Script
3. Test the system
4. Deploy and verify

---

## 📋 Prerequisites

- [ ] Access to your Google Sheet: https://docs.google.com/spreadsheets/d/1GXl6tPmofpgdnpEIuts8gSLYAw9roTQegKrgSjYaErA
- [ ] Access to Apps Script (Extensions → Apps Script)
- [ ] 15-30 minutes of time

---

## Part 1: Set Up Google Sheets (10 minutes)

### Step 1: Create RaffleEntries Sheet

1. Open your Google Sheet
2. Click the **+** button at bottom left (next to existing sheets)
3. Rename the new sheet to: **RaffleEntries**
4. Click on cell A1
5. Copy and paste this entire row:

```
EntryId	OrderId	CustomerId	CustomerName	CustomerPhone	CustomerEmail	OrderAmount	PaymentMethod	EntryDate	DrawMonth	Status	WonPrize	DrawDate
```

6. Select Row 1 (click on the row number "1")
7. Make it **bold** (Ctrl+B or Cmd+B)
8. Set background color to light blue (#E3F2FD)
9. Go to: View → Freeze → 1 row

✅ **Checkpoint:** You should see 13 columns (A through M) with headers

---

### Step 2: Create RafflePrizes Sheet

1. Click the **+** button again
2. Rename to: **RafflePrizes**
3. Click on cell A1
4. Copy and paste this entire row:

```
PrizeId	PrizeName	PrizeDescription	PrizeValue	PrizeImage	DrawMonth	Status	WinnerId	WinnerName	WinnerPhone	DrawnDate	ClaimedDate
```

5. Select Row 1
6. Make it **bold**
7. Set background color to light green (#E8F5E9)
8. Freeze row 1

9. **Add December 2024 Prizes** - Copy and paste these 3 rows starting from A2:

```
PRIZE-2024-12-001	Tagaytay Staycation	2D1N stay for 2 pax at Taal Vista Hotel	3000	https://via.placeholder.com/400x300?text=Staycation	2024-12	Available				
PRIZE-2024-12-002	Nike Air Max Shoes	Original Nike Air Max - Size 9	1500	https://via.placeholder.com/400x300?text=Nike+Shoes	2024-12	Available				
PRIZE-2024-12-003	Uniqlo Gift Certificate	₱500 Uniqlo Shopping Voucher	500	https://via.placeholder.com/400x300?text=Uniqlo+GC	2024-12	Available				
```

✅ **Checkpoint:** You should see 12 columns with 3 prizes for December 2024

---

### Step 3: Create RaffleDraws Sheet

1. Click the **+** button again
2. Rename to: **RaffleDraws**
3. Click on cell A1
4. Copy and paste this entire row:

```
DrawId	DrawMonth	DrawDate	TotalEntries	TotalPrizes	Winners	Status	Notes
```

5. Select Row 1
6. Make it **bold**
7. Set background color to light yellow (#FFF9C4)
8. Freeze row 1

9. **Add December 2024 Draw Schedule** - Copy and paste this row starting from A2:

```
DRAW-2024-12	December 2024	2024-12-31 18:00:00	0	3	[]	Scheduled	Draw will be conducted live on Facebook
```

✅ **Checkpoint:** You should see 8 columns with December draw scheduled

---

### Step 4: Verify Sheets Setup

Check that you have these sheets (tabs at bottom):
- [ ] Merchants
- [ ] Products
- [ ] Orders
- [ ] **RaffleEntries** (new)
- [ ] **RafflePrizes** (new)
- [ ] **RaffleDraws** (new)

✅ **Part 1 Complete!** Sheets are ready.

---

## Part 2: Install Apps Script Code (10 minutes)

### Step 1: Open Apps Script Editor

1. In your Google Sheet, go to: **Extensions → Apps Script**
2. You should see your existing code (Code.gs file)

---

### Step 2: Create New Script File

1. Click the **+** button next to "Files"
2. Select "Script"
3. Name it: **RaffleSystem**
4. Click "OK"

---

### Step 3: Add Raffle Code

1. You should now see an empty RaffleSystem.gs file
2. Open the file: `/home/ubuntu/AmadeoTYG/RaffleSystem.gs`
3. Copy **ALL** the code from that file
4. Paste it into the RaffleSystem.gs file in Apps Script
5. Click the **Save** icon (💾) or press Ctrl+S

✅ **Checkpoint:** You should see ~400 lines of code in RaffleSystem.gs

---

### Step 4: Integrate with Existing Code

1. Click on **Code.gs** (your main file)
2. Find the `createOrder` function
3. Look for the line near the end that says: `return { success: true, orderId: orderId };`
4. **BEFORE** that return statement, add this code:

```javascript
  // Create raffle entry for online payments
  try {
    if (data.paymentMethod && data.paymentMethod.toLowerCase() !== 'cod') {
      const raffleEntryId = createRaffleEntry(orderId, data);
      if (raffleEntryId) {
        Logger.log('Raffle entry created: ' + raffleEntryId);
      }
    }
  } catch (error) {
    Logger.log('Raffle entry creation failed: ' + error.toString());
    // Don't fail the order if raffle entry fails
  }
```

5. Save the file (Ctrl+S)

---

### Step 5: Add API Endpoints

1. Still in **Code.gs**, find the `doGet` function
2. Look for where you handle different actions (like `if (action === 'getMerchants')`)
3. Add these new action handlers **before** the final return statement:

```javascript
  // Raffle system endpoints
  if (action === 'getCustomerRaffleEntries') {
    const phone = e.parameter.phone;
    const entries = getCustomerRaffleEntries(phone);
    return ContentService.createTextOutput(JSON.stringify(entries))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'getMonthlyDrawInfo') {
    const info = getMonthlyDrawInfo();
    return ContentService.createTextOutput(JSON.stringify(info))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'conductMonthlyDraw') {
    const month = e.parameter.month;
    const result = conductMonthlyDraw(month);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }
```

4. Save the file (Ctrl+S)

✅ **Checkpoint:** Code is integrated

---

### Step 6: Deploy New Version

1. Click the **Deploy** button (top right)
2. Select "Manage deployments"
3. Click the **Edit** icon (pencil) next to your active deployment
4. Under "Version", click "New version"
5. Add description: "Added raffle system"
6. Click **Deploy**
7. Copy the new Web App URL (you'll need this later)

✅ **Part 2 Complete!** Code is deployed.

---

## Part 3: Test the System (5 minutes)

### Step 1: Run Test Function

1. In Apps Script, make sure you're viewing **RaffleSystem.gs**
2. At the top, find the function dropdown (shows "Select function")
3. Select: **testRaffleSystem**
4. Click the **Run** button (▶️)
5. If prompted, click "Review permissions" and authorize
6. Wait for execution to complete

---

### Step 2: Check Execution Log

1. Click "Execution log" at the bottom
2. You should see output like:

```
=== Testing Raffle System ===
1. Testing createRaffleEntry...
Created entry: RAFFLE-2024-12-001
2. Testing getCustomerRaffleEntries...
Found 1 entries
3. Testing getMonthlyDrawInfo...
Total entries: 1
Prizes: 3
4. Testing getRaffleStats...
Stats: {...}
=== Test Complete ===
```

---

### Step 3: Verify in Sheets

1. Go back to your Google Sheet
2. Click on the **RaffleEntries** tab
3. You should see a new row with:
   - EntryId: RAFFLE-2024-12-001
   - CustomerName: Test Customer
   - PaymentMethod: GCash
   - Status: Active

✅ **If you see this, the system is working!**

---

### Step 4: Clean Up Test Data

1. In RaffleEntries sheet, delete Row 2 (the test entry)
2. This keeps your data clean for production

✅ **Part 3 Complete!** System is tested and working.

---

## Part 4: Verify End-to-End (5 minutes)

### Step 1: Test with Real Order

1. Go to your website: https://amadeomarketplace.com
2. Add a product to cart
3. Go to checkout
4. Fill in customer information
5. **Select GCash** as payment method
6. Place order

---

### Step 2: Check Raffle Entry Created

1. Go back to Google Sheet
2. Open **RaffleEntries** tab
3. You should see a new entry with:
   - Your customer name
   - PaymentMethod: GCash
   - Status: Active
   - Current month in DrawMonth

✅ **If entry appears, end-to-end flow is working!**

---

### Step 3: Test COD (Should NOT Create Entry)

1. Place another test order
2. This time select **COD** as payment
3. Check RaffleEntries sheet
4. **No new entry should appear** (COD doesn't get raffle entries)

✅ **If no entry for COD, system is correctly filtering!**

---

## Part 5: Monthly Draw Process (Future Use)

### When It's Time to Draw Winners (End of Month)

1. Open Apps Script
2. Select function: **conductMonthlyDraw**
3. Or create an admin page to trigger it
4. Winners will be automatically selected
5. Check **RaffleDraws** sheet for results
6. Contact winners via phone

---

## 🎉 Deployment Complete!

### What's Working Now:

✅ Raffle entries auto-created for online payments  
✅ COD orders don't get entries  
✅ Entries tracked in Google Sheets  
✅ December 2024 prizes configured  
✅ Draw scheduled for Dec 31, 2024  
✅ Ready to announce to customers!

---

## 📱 Next Steps: Marketing

### 1. Announce on Social Media

Post this:

```
🎉 BIG NEWS! 🎁

Pay online at Amadeo Marketplace and get:
✅ 3% instant discount
✅ 1 FREE raffle entry

Win this December:
🏖️ Tagaytay Staycation (2D1N)
👟 Nike Air Max Shoes
👕 Uniqlo Gift Certificate ₱500

Draw: December 31, 2024
Shop now: amadeomarketplace.com

#AmadeoMarketplace #Raffle #WinPrizes
```

### 2. Update Your Facebook Page

- Create a cover photo with raffle prizes
- Pin the announcement post
- Share daily reminders

### 3. Send SMS to Existing Customers

```
🎁 RAFFLE PROMO! Pay online at amadeomarketplace.com and win staycations, shoes & more! FREE raffle entry + 1 raffle entry per order. Draw Dec 31!
```

---

## 🐛 Troubleshooting

### Problem: No raffle entry created after order

**Solution:**
1. Check if payment method is online (not COD)
2. Check Apps Script execution log for errors
3. Verify RaffleEntries sheet exists with correct name
4. Check if createRaffleEntry code is in createOrder function

### Problem: "RaffleEntries sheet not found" error

**Solution:**
1. Make sure sheet name is exactly: **RaffleEntries** (case-sensitive)
2. No extra spaces in name
3. Sheet is in the same spreadsheet

### Problem: Test function won't run

**Solution:**
1. Make sure you authorized the script
2. Check if you have edit permissions on the sheet
3. Try refreshing the Apps Script page

---

## 📞 Support

If you encounter issues:
1. Check the execution log in Apps Script
2. Verify all sheet names match exactly
3. Ensure December prizes are added
4. Test with a simple order first

---

## 🎊 Congratulations!

Your raffle system is now live! Every online payment automatically enters customers into the monthly draw, incentivizing them to choose GCash/Maya/Bank Transfer over COD.

**This will significantly increase your online payment rate and revenue!**

---

**Last Updated:** December 9, 2024  
**Version:** 1.0  
**Status:** ✅ Ready for Production
