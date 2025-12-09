# Complete Order Flow Test Plan

**Version:** 1.0  
**Date:** December 9, 2024  
**Tester:** ___________  
**Test Environment:** https://amadeomarketplace.com

---

## 📋 Test Overview

This test plan covers the complete customer journey from browsing products to receiving order confirmation, including all new features:
- Payment incentive system
- Raffle entry promotion
- Wishlist functionality
- Stock management badges
- Delivery/Pickup badges

**Estimated Test Time:** 30-45 minutes  
**Prerequisites:** Products must be displaying on homepage

---

## 🎯 Test Objectives

1. Verify complete order flow works end-to-end
2. Validate all payment options display correctly
3. Confirm raffle incentives are visible and compelling
4. Test new features (wishlist, stock badges, etc.)
5. Ensure order is created in Google Sheets
6. Verify raffle entry is created for online payments

---

## Test Case 1: Homepage Product Display

### Objective
Verify products and stores display correctly with all new features

### Prerequisites
- Clear browser cache
- Navigate to https://amadeomarketplace.com

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1.1 | Load homepage | Page loads within 3 seconds | ☐ Pass ☐ Fail | |
| 1.2 | Wait 5 seconds | "Loading products..." disappears | ☐ Pass ☐ Fail | |
| 1.3 | Check products section | 2 products display (MHC brown EGG, EJ rice) | ☐ Pass ☐ Fail | |
| 1.4 | Check store section | 1 store displays (MustHaveCorner) | ☐ Pass ☐ Fail | |
| 1.5 | Check stats | Shows "1 Verified Merchants, 2 Products" | ☐ Pass ☐ Fail | |
| 1.6 | Check product images | Both products show images | ☐ Pass ☐ Fail | |
| 1.7 | Check product prices | MHC EGG shows ₱167, EJ rice shows ₱1,499 | ☐ Pass ☐ Fail | |
| 1.8 | Check wishlist hearts | Heart icon visible on each product | ☐ Pass ☐ Fail | |
| 1.9 | Check stock badges | Shows "12 in stock" or no badge if > 5 | ☐ Pass ☐ Fail | |
| 1.10 | Check delivery badges | Store shows pickup/delivery badges if set | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 2: Wishlist Functionality

### Objective
Verify wishlist (favorites) feature works correctly

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 2.1 | Click heart icon on MHC EGG | Heart turns red/filled | ☐ Pass ☐ Fail | |
| 2.2 | Check toast notification | Shows "Added to wishlist ❤️" | ☐ Pass ☐ Fail | |
| 2.3 | Click heart again | Heart turns white/empty | ☐ Pass ☐ Fail | |
| 2.4 | Check toast notification | Shows "Removed from wishlist" | ☐ Pass ☐ Fail | |
| 2.5 | Add to wishlist again | Heart turns red | ☐ Pass ☐ Fail | |
| 2.6 | Refresh page (F5) | Heart remains red (localStorage works) | ☐ Pass ☐ Fail | |
| 2.7 | Click heart on EJ rice | Both products can be in wishlist | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 3: Product Search

### Objective
Verify search functionality works correctly

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 3.1 | Click search bar | Search bar is active | ☐ Pass ☐ Fail | |
| 3.2 | Type "egg" | MHC brown EGG displays | ☐ Pass ☐ Fail | |
| 3.3 | Check other products | EJ rice is hidden | ☐ Pass ☐ Fail | |
| 3.4 | Clear search | Both products display again | ☐ Pass ☐ Fail | |
| 3.5 | Type "rice" | EJ rice displays | ☐ Pass ☐ Fail | |
| 3.6 | Type "xyz" (no match) | Shows "No products found" | ☐ Pass ☐ Fail | |
| 3.7 | Clear search | All products return | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 4: Add to Cart

### Objective
Verify adding products to cart works correctly

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 4.1 | Click on MHC brown EGG product | Product details modal opens | ☐ Pass ☐ Fail | |
| 4.2 | Check product details | Shows name, price, description, image | ☐ Pass ☐ Fail | |
| 4.3 | Check quantity selector | Defaults to 1 | ☐ Pass ☐ Fail | |
| 4.4 | Click + button | Quantity increases to 2 | ☐ Pass ☐ Fail | |
| 4.5 | Click - button | Quantity decreases to 1 | ☐ Pass ☐ Fail | |
| 4.6 | Click "Add to Cart" | Modal closes | ☐ Pass ☐ Fail | |
| 4.7 | Check cart badge | Shows "1" in header | ☐ Pass ☐ Fail | |
| 4.8 | Check toast notification | Shows "Added to cart" | ☐ Pass ☐ Fail | |
| 4.9 | Click on EJ rice product | Product details modal opens | ☐ Pass ☐ Fail | |
| 4.10 | Set quantity to 3 | Quantity shows 3 | ☐ Pass ☐ Fail | |
| 4.11 | Click "Add to Cart" | Modal closes | ☐ Pass ☐ Fail | |
| 4.12 | Check cart badge | Shows "2" (2 items) | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 5: Cart Management

### Objective
Verify cart displays and can be modified

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 5.1 | Click "Cart" button in header | Cart modal opens | ☐ Pass ☐ Fail | |
| 5.2 | Check cart items | Shows 2 items (MHC EGG x1, EJ rice x3) | ☐ Pass ☐ Fail | |
| 5.3 | Check item details | Each shows image, name, price, quantity | ☐ Pass ☐ Fail | |
| 5.4 | Check subtotal | MHC: ₱167, EJ rice: ₱4,497 | ☐ Pass ☐ Fail | |
| 5.5 | Check total | ₱4,664 (167 + 4497) | ☐ Pass ☐ Fail | |
| 5.6 | Click + on MHC EGG | Quantity increases to 2 | ☐ Pass ☐ Fail | |
| 5.7 | Check updated subtotal | MHC: ₱334 (167 x 2) | ☐ Pass ☐ Fail | |
| 5.8 | Check updated total | ₱4,831 (334 + 4497) | ☐ Pass ☐ Fail | |
| 5.9 | Click - on EJ rice | Quantity decreases to 2 | ☐ Pass ☐ Fail | |
| 5.10 | Check updated total | ₱3,332 (334 + 2998) | ☐ Pass ☐ Fail | |
| 5.11 | Click remove icon on MHC EGG | Item removed from cart | ☐ Pass ☐ Fail | |
| 5.12 | Check cart badge | Shows "1" (1 item left) | ☐ Pass ☐ Fail | |
| 5.13 | Add MHC EGG back (qty 1) | Cart has 2 items again | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 6: Checkout - Delivery Information

### Objective
Verify checkout form displays and validates correctly

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 6.1 | Click "Proceed to Checkout" | Checkout modal opens | ☐ Pass ☐ Fail | |
| 6.2 | Check form fields | All fields present (name, phone, email, etc.) | ☐ Pass ☐ Fail | |
| 6.3 | Check barangay dropdown | Shows 26 barangays | ☐ Pass ☐ Fail | |
| 6.4 | Click "Place Order" (empty form) | Shows validation errors | ☐ Pass ☐ Fail | |
| 6.5 | Fill Full Name | "Juan Dela Cruz" | ☐ Pass ☐ Fail | |
| 6.6 | Fill Phone Number | "09123456789" | ☐ Pass ☐ Fail | |
| 6.7 | Fill Email (optional) | "juan@test.com" | ☐ Pass ☐ Fail | |
| 6.8 | Select Barangay | "Loma" | ☐ Pass ☐ Fail | |
| 6.9 | Fill Complete Address | "123 Main St, Loma" | ☐ Pass ☐ Fail | |
| 6.10 | Fill Delivery Notes | "Please call upon arrival" | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 7: Payment Options Display (CRITICAL)

### Objective
Verify all payment options display with correct incentives

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 7.1 | Check payment section | 4 payment options visible | ☐ Pass ☐ Fail | |
| 7.2 | Check COD option | Plain white background, no badge | ☐ Pass ☐ Fail | |
| 7.3 | Check COD text | Shows "Cash on Delivery (COD)" | ☐ Pass ☐ Fail | |
| 7.4 | Check GCash option | Green background (highlighted) | ☐ Pass ☐ Fail | |
| 7.5 | Check GCash badge | Shows "Save 3% + Raffle Entry" | ☐ Pass ☐ Fail | |
| 7.6 | Check GCash benefits | Shows "🎁 1 raffle entry • ✨ Instant confirmation" | ☐ Pass ☐ Fail | |
| 7.7 | Check Maya option | Green background (highlighted) | ☐ Pass ☐ Fail | |
| 7.8 | Check Maya badge | Shows "Save 3% + Raffle Entry" | ☐ Pass ☐ Fail | |
| 7.9 | Check Maya benefits | Shows "🎁 1 raffle entry • ✨ Instant confirmation" | ☐ Pass ☐ Fail | |
| 7.10 | Check Bank Transfer option | Green background (highlighted) | ☐ Pass ☐ Fail | |
| 7.11 | Check Bank Transfer badge | Shows "Save 3% + Raffle Entry" | ☐ Pass ☐ Fail | |
| 7.12 | Check Bank Transfer benefits | Shows "🎁 1 raffle entry • ✨ Instant confirmation" | ☐ Pass ☐ Fail | |
| 7.13 | Check info banner | Visible below payment options | ☐ Pass ☐ Fail | |
| 7.14 | Check banner icon | Shows 🎁 gift icon | ☐ Pass ☐ Fail | |
| 7.15 | Check banner title | "🎁 Pay Online & Get Rewards!" | ☐ Pass ☐ Fail | |
| 7.16 | Check banner line 1 | "✓ Save 3% on your order" | ☐ Pass ☐ Fail | |
| 7.17 | Check banner line 2 | "✓ Get 1 FREE raffle entry to our monthly draw" | ☐ Pass ☐ Fail | |
| 7.18 | Check banner line 3 | "Win staycations, original shoes, apparels & more exciting prizes!" | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

**Visual Comparison:**
- COD: Plain, no special styling
- Online payments: Green, badges, benefits, visually superior
- Info banner: Eye-catching, clear value proposition

---

## Test Case 8: Order Summary

### Objective
Verify order summary displays correct calculations

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 8.1 | Check order summary section | Visible on right side | ☐ Pass ☐ Fail | |
| 8.2 | Check items list | Shows all cart items | ☐ Pass ☐ Fail | |
| 8.3 | Check subtotal | Correct sum of items | ☐ Pass ☐ Fail | |
| 8.4 | Check delivery fee | Shows ₱50.00 | ☐ Pass ☐ Fail | |
| 8.5 | Check total (COD selected) | Subtotal + ₱50 | ☐ Pass ☐ Fail | |
| 8.6 | Select GCash | Total updates | ☐ Pass ☐ Fail | |
| 8.7 | Check discount (GCash) | Shows -3% discount line | ☐ Pass ☐ Fail | |
| 8.8 | Check new total (GCash) | (Subtotal × 0.97) + ₱50 | ☐ Pass ☐ Fail | |
| 8.9 | Switch to Maya | Total recalculates with 3% discount | ☐ Pass ☐ Fail | |
| 8.10 | Switch to Bank Transfer | Total recalculates with 3% discount | ☐ Pass ☐ Fail | |
| 8.11 | Switch back to COD | Discount removed, full price | ☐ Pass ☐ Fail | |

**Example Calculation (for ₱1,000 subtotal):**
- COD: ₱1,000 + ₱50 = ₱1,050
- GCash: (₱1,000 × 0.97) + ₱50 = ₱1,020 (saved ₱30)

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 9: Place Order - COD

### Objective
Verify order placement works with COD (no raffle entry)

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 9.1 | Ensure COD is selected | Radio button checked | ☐ Pass ☐ Fail | |
| 9.2 | Click "Place Order" | Processing indicator shows | ☐ Pass ☐ Fail | |
| 9.3 | Wait for response | Success message appears | ☐ Pass ☐ Fail | |
| 9.4 | Check order ID | Shows format "ORD-YYYY-XXX" | ☐ Pass ☐ Fail | |
| 9.5 | Check confirmation message | "Order placed successfully!" | ☐ Pass ☐ Fail | |
| 9.6 | Check raffle mention | NO raffle entry mentioned (COD) | ☐ Pass ☐ Fail | |
| 9.7 | Check cart badge | Resets to 0 | ☐ Pass ☐ Fail | |
| 9.8 | Check modal | Closes automatically or has close button | ☐ Pass ☐ Fail | |

**Record Order ID:** ORD-_______________

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 10: Verify Order in Google Sheets (COD)

### Objective
Verify order was created in backend

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 10.1 | Open Google Sheet | Navigate to Orders tab | ☐ Pass ☐ Fail | |
| 10.2 | Find order by ID | Order exists in sheet | ☐ Pass ☐ Fail | |
| 10.3 | Check customer name | "Juan Dela Cruz" | ☐ Pass ☐ Fail | |
| 10.4 | Check phone number | "09123456789" | ☐ Pass ☐ Fail | |
| 10.5 | Check payment method | "cod" or "COD" | ☐ Pass ☐ Fail | |
| 10.6 | Check order status | "Pending" | ☐ Pass ☐ Fail | |
| 10.7 | Check total amount | Matches checkout total | ☐ Pass ☐ Fail | |
| 10.8 | Check items | Correct products and quantities | ☐ Pass ☐ Fail | |
| 10.9 | Check barangay | "Loma" | ☐ Pass ☐ Fail | |
| 10.10 | Check timestamp | Recent (within last 5 minutes) | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 11: Verify NO Raffle Entry (COD)

### Objective
Verify raffle entry was NOT created for COD payment

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 11.1 | Open Google Sheet | Navigate to RaffleEntries tab | ☐ Pass ☐ Fail | |
| 11.2 | Search for order ID | No entry with this order ID | ☐ Pass ☐ Fail | |
| 11.3 | Search by phone number | No entry for 09123456789 (or only old entries) | ☐ Pass ☐ Fail | |

**Expected:** NO raffle entry for COD orders

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 12: Place Order - GCash (with Raffle)

### Objective
Verify order placement works with GCash and creates raffle entry

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 12.1 | Add products to cart again | Cart has items | ☐ Pass ☐ Fail | |
| 12.2 | Go to checkout | Checkout modal opens | ☐ Pass ☐ Fail | |
| 12.3 | Fill delivery info | Use different name: "Maria Santos" | ☐ Pass ☐ Fail | |
| 12.4 | Fill phone | "09987654321" | ☐ Pass ☐ Fail | |
| 12.5 | Select barangay | "Bucal" | ☐ Pass ☐ Fail | |
| 12.6 | Fill address | "456 Side St, Bucal" | ☐ Pass ☐ Fail | |
| 12.7 | Select GCash payment | Radio button checked, green highlight | ☐ Pass ☐ Fail | |
| 12.8 | Verify discount applied | Total shows 3% discount | ☐ Pass ☐ Fail | |
| 12.9 | Click "Place Order" | Processing indicator shows | ☐ Pass ☐ Fail | |
| 12.10 | Wait for response | Success message appears | ☐ Pass ☐ Fail | |
| 12.11 | Check order ID | Shows format "ORD-YYYY-XXX" | ☐ Pass ☐ Fail | |
| 12.12 | Check raffle mention | "You received 1 raffle entry 🎁" | ☐ Pass ☐ Fail | |
| 12.13 | Check full message | Mentions monthly draw and prizes | ☐ Pass ☐ Fail | |

**Record Order ID:** ORD-_______________

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 13: Verify Order in Google Sheets (GCash)

### Objective
Verify order was created with correct payment method

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 13.1 | Open Google Sheet | Navigate to Orders tab | ☐ Pass ☐ Fail | |
| 13.2 | Find order by ID | Order exists in sheet | ☐ Pass ☐ Fail | |
| 13.3 | Check customer name | "Maria Santos" | ☐ Pass ☐ Fail | |
| 13.4 | Check phone number | "09987654321" | ☐ Pass ☐ Fail | |
| 13.5 | Check payment method | "gcash" or "GCash" | ☐ Pass ☐ Fail | |
| 13.6 | Check total amount | Includes 3% discount | ☐ Pass ☐ Fail | |
| 13.7 | Check barangay | "Bucal" | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 14: Verify Raffle Entry Created (GCash)

### Objective
Verify raffle entry was automatically created for online payment

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 14.1 | Open Google Sheet | Navigate to RaffleEntries tab | ☐ Pass ☐ Fail | |
| 14.2 | Find latest entry | New entry exists | ☐ Pass ☐ Fail | |
| 14.3 | Check EntryId format | "RAFFLE-YYYY-MM-XXX" | ☐ Pass ☐ Fail | |
| 14.4 | Check OrderId | Matches GCash order ID | ☐ Pass ☐ Fail | |
| 14.5 | Check CustomerName | "Maria Santos" | ☐ Pass ☐ Fail | |
| 14.6 | Check CustomerPhone | "09987654321" | ☐ Pass ☐ Fail | |
| 14.7 | Check PaymentMethod | "GCash" or "gcash" | ☐ Pass ☐ Fail | |
| 14.8 | Check OrderAmount | Matches order total | ☐ Pass ☐ Fail | |
| 14.9 | Check DrawMonth | Current month (YYYY-MM format) | ☐ Pass ☐ Fail | |
| 14.10 | Check Status | "Active" | ☐ Pass ☐ Fail | |
| 14.11 | Check EntryDate | Recent timestamp | ☐ Pass ☐ Fail | |
| 14.12 | Check WonPrize | Empty (not drawn yet) | ☐ Pass ☐ Fail | |
| 14.13 | Check DrawDate | Empty (not drawn yet) | ☐ Pass ☐ Fail | |

**Record Entry ID:** RAFFLE-_______________

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 15: Place Order - Maya (with Raffle)

### Objective
Verify Maya payment also creates raffle entry

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 15.1 | Add products to cart | Cart has items | ☐ Pass ☐ Fail | |
| 15.2 | Go to checkout | Checkout modal opens | ☐ Pass ☐ Fail | |
| 15.3 | Fill delivery info | Use "Pedro Reyes", "09111222333" | ☐ Pass ☐ Fail | |
| 15.4 | Select Maya payment | Radio button checked, green highlight | ☐ Pass ☐ Fail | |
| 15.5 | Verify discount applied | Total shows 3% discount | ☐ Pass ☐ Fail | |
| 15.6 | Click "Place Order" | Success message with raffle mention | ☐ Pass ☐ Fail | |
| 15.7 | Record order ID | ORD-_______________ | ☐ Pass ☐ Fail | |
| 15.8 | Check RaffleEntries sheet | New entry created | ☐ Pass ☐ Fail | |
| 15.9 | Verify PaymentMethod | "Maya" or "maya" | ☐ Pass ☐ Fail | |
| 15.10 | Verify customer details | Matches order | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 16: Place Order - Bank Transfer (with Raffle)

### Objective
Verify Bank Transfer payment also creates raffle entry

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 16.1 | Add products to cart | Cart has items | ☐ Pass ☐ Fail | |
| 16.2 | Go to checkout | Checkout modal opens | ☐ Pass ☐ Fail | |
| 16.3 | Fill delivery info | Use "Ana Garcia", "09444555666" | ☐ Pass ☐ Fail | |
| 16.4 | Select Bank Transfer | Radio button checked, green highlight | ☐ Pass ☐ Fail | |
| 16.5 | Verify discount applied | Total shows 3% discount | ☐ Pass ☐ Fail | |
| 16.6 | Click "Place Order" | Success message with raffle mention | ☐ Pass ☐ Fail | |
| 16.7 | Record order ID | ORD-_______________ | ☐ Pass ☐ Fail | |
| 16.8 | Check RaffleEntries sheet | New entry created | ☐ Pass ☐ Fail | |
| 16.9 | Verify PaymentMethod | "Bank" or "bank" | ☐ Pass ☐ Fail | |
| 16.10 | Verify customer details | Matches order | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 17: Stock Management

### Objective
Verify stock levels update and display correctly

### Prerequisites
- Set a product's StockLevel to 3 in Google Sheets

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 17.1 | Refresh homepage | Products reload | ☐ Pass ☐ Fail | |
| 17.2 | Check product with stock = 3 | Shows "Only 3 left" badge | ☐ Pass ☐ Fail | |
| 17.3 | Check badge color | Orange/yellow warning color | ☐ Pass ☐ Fail | |
| 17.4 | Set stock to 0 in sheet | Update and save | ☐ Pass ☐ Fail | |
| 17.5 | Refresh homepage | Products reload | ☐ Pass ☐ Fail | |
| 17.6 | Check out-of-stock product | Shows "Out of Stock" overlay | ☐ Pass ☐ Fail | |
| 17.7 | Try to click product | Click is disabled or shows message | ☐ Pass ☐ Fail | |
| 17.8 | Restore stock to 12 | Update and save | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 18: Customer Account - Order History

### Objective
Verify customers can view their order history

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 18.1 | Click "Login" in header | Login page opens | ☐ Pass ☐ Fail | |
| 18.2 | Enter phone number | "09987654321" (Maria Santos) | ☐ Pass ☐ Fail | |
| 18.3 | Click "Login" | Account page opens | ☐ Pass ☐ Fail | |
| 18.4 | Check order history section | Displays recent orders | ☐ Pass ☐ Fail | |
| 18.5 | Find GCash order | Order appears in list | ☐ Pass ☐ Fail | |
| 18.6 | Check order details | Shows correct items, total, status | ☐ Pass ☐ Fail | |
| 18.7 | Check payment method | Shows "GCash" | ☐ Pass ☐ Fail | |
| 18.8 | Check raffle entries section | Shows raffle entries | ☐ Pass ☐ Fail | |
| 18.9 | Find raffle entry | Entry for GCash order appears | ☐ Pass ☐ Fail | |
| 18.10 | Check entry details | Shows entry ID, date, status "Active" | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 19: Order Tracking

### Objective
Verify order tracking page works

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 19.1 | Click "Track Order" in header | Track page opens | ☐ Pass ☐ Fail | |
| 19.2 | Enter order ID | Use one of the test order IDs | ☐ Pass ☐ Fail | |
| 19.3 | Click "Track" | Order details display | ☐ Pass ☐ Fail | |
| 19.4 | Check order status | Shows current status (Pending, etc.) | ☐ Pass ☐ Fail | |
| 19.5 | Check order items | Shows correct products | ☐ Pass ☐ Fail | |
| 19.6 | Check delivery info | Shows address and contact | ☐ Pass ☐ Fail | |
| 19.7 | Check payment method | Shows correct method | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## Test Case 20: Mobile Responsiveness

### Objective
Verify site works on mobile devices

### Test Steps

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 20.1 | Open on mobile device | Site loads correctly | ☐ Pass ☐ Fail | |
| 20.2 | Check layout | No horizontal scrolling | ☐ Pass ☐ Fail | |
| 20.3 | Check navigation | Menu accessible | ☐ Pass ☐ Fail | |
| 20.4 | Check products | Display in mobile-friendly grid | ☐ Pass ☐ Fail | |
| 20.5 | Add to cart | Works on mobile | ☐ Pass ☐ Fail | |
| 20.6 | Checkout | Form is usable on mobile | ☐ Pass ☐ Fail | |
| 20.7 | Payment options | Clearly visible and selectable | ☐ Pass ☐ Fail | |
| 20.8 | Place order | Completes successfully | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ Pass ☐ Fail

---

## 📊 Test Summary

### Overall Results

| Test Case | Title | Result | Critical? |
|-----------|-------|--------|-----------|
| TC-1 | Homepage Product Display | ☐ Pass ☐ Fail | Yes |
| TC-2 | Wishlist Functionality | ☐ Pass ☐ Fail | No |
| TC-3 | Product Search | ☐ Pass ☐ Fail | No |
| TC-4 | Add to Cart | ☐ Pass ☐ Fail | Yes |
| TC-5 | Cart Management | ☐ Pass ☐ Fail | Yes |
| TC-6 | Checkout - Delivery Info | ☐ Pass ☐ Fail | Yes |
| TC-7 | Payment Options Display | ☐ Pass ☐ Fail | **CRITICAL** |
| TC-8 | Order Summary | ☐ Pass ☐ Fail | Yes |
| TC-9 | Place Order - COD | ☐ Pass ☐ Fail | Yes |
| TC-10 | Verify Order (COD) | ☐ Pass ☐ Fail | Yes |
| TC-11 | Verify NO Raffle (COD) | ☐ Pass ☐ Fail | **CRITICAL** |
| TC-12 | Place Order - GCash | ☐ Pass ☐ Fail | **CRITICAL** |
| TC-13 | Verify Order (GCash) | ☐ Pass ☐ Fail | Yes |
| TC-14 | Verify Raffle Entry | ☐ Pass ☐ Fail | **CRITICAL** |
| TC-15 | Place Order - Maya | ☐ Pass ☐ Fail | Yes |
| TC-16 | Place Order - Bank Transfer | ☐ Pass ☐ Fail | Yes |
| TC-17 | Stock Management | ☐ Pass ☐ Fail | No |
| TC-18 | Customer Account | ☐ Pass ☐ Fail | No |
| TC-19 | Order Tracking | ☐ Pass ☐ Fail | No |
| TC-20 | Mobile Responsiveness | ☐ Pass ☐ Fail | No |

**Total Test Cases:** 20  
**Passed:** _____  
**Failed:** _____  
**Pass Rate:** _____%

---

## 🐛 Issues Found

| Issue # | Test Case | Severity | Description | Status |
|---------|-----------|----------|-------------|--------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Severity Levels:**
- **Critical:** Blocks core functionality
- **High:** Major feature broken
- **Medium:** Feature works but has issues
- **Low:** Minor cosmetic or UX issue

---

## ✅ Acceptance Criteria

### Must Pass (Critical)
- [ ] Products display on homepage
- [ ] Add to cart works
- [ ] Checkout form accepts input
- [ ] **Payment options display with raffle incentives**
- [ ] **COD orders do NOT create raffle entries**
- [ ] **GCash/Maya/Bank orders DO create raffle entries**
- [ ] Orders are created in Google Sheets
- [ ] 3% discount applies to online payments

### Should Pass (Important)
- [ ] Wishlist works
- [ ] Search works
- [ ] Cart management works
- [ ] Stock badges display
- [ ] Order tracking works

### Nice to Have
- [ ] Mobile responsive
- [ ] Delivery/Pickup badges
- [ ] Customer account features

---

## 📝 Test Notes

**Tester Name:** _______________  
**Date Completed:** _______________  
**Time Spent:** _______________  
**Browser Used:** _______________  
**Device:** _______________

**Additional Comments:**
```
[Add any observations, suggestions, or issues here]
```

---

## 🎯 Key Success Metrics

After completing this test plan, verify:

1. **Order Conversion Rate**
   - Can customers complete orders? ✅/❌

2. **Payment Incentive Effectiveness**
   - Are online payment options visually superior? ✅/❌
   - Is the raffle promotion clear and compelling? ✅/❌

3. **Raffle System Integration**
   - Do online payments create raffle entries? ✅/❌
   - Does COD correctly NOT create entries? ✅/❌

4. **User Experience**
   - Is the flow intuitive? ✅/❌
   - Are there any confusing steps? ✅/❌

---

**Test Plan Version:** 1.0  
**Last Updated:** December 9, 2024  
**Status:** Ready for Execution
