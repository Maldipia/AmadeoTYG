# Customer Accounts & Login - Testing Checklist

## Test Environment
- **Live Site:** https://www.amadeomarketplace.com
- **API Endpoint:** https://script.google.com/macros/s/AKfycbzBw-bLMAooXcWvcCo0VHsndaC_RpaZz-xKNpGn-nljZ4H4fyKAerf7u12-SUFfOG2nAQ/exec
- **Test Date:** January 28, 2026

---

## ✅ Phase 6: Testing Customer Account Features

### 1. Customer Registration (signup.html)

**Test Cases:**
- [ ] **TC-REG-001:** Register new customer with valid data
  - Navigate to `/signup`
  - Fill all required fields (Name, Email, Phone, Address, Barangay, Password)
  - Submit form
  - **Expected:** Success message, auto-login, redirect to `/account`
  - **Verify:** Session token stored in localStorage
  - **Verify:** Customer data stored in localStorage

- [ ] **TC-REG-002:** Duplicate email validation
  - Try to register with existing email
  - **Expected:** Error message "Email already registered"

- [ ] **TC-REG-003:** Password mismatch validation
  - Enter different passwords in password fields
  - **Expected:** Error message "Passwords do not match"

- [ ] **TC-REG-004:** Password length validation
  - Enter password less than 6 characters
  - **Expected:** Error message "Password must be at least 6 characters"

- [ ] **TC-REG-005:** Required field validation
  - Leave required fields empty
  - **Expected:** Browser validation prevents submission

- [ ] **TC-REG-006:** Auto-login after registration
  - Complete registration
  - **Expected:** Automatically logged in and redirected to `/account`
  - **Verify:** No need to login again

---

### 2. Customer Login (customer-login.html)

**Test Cases:**
- [ ] **TC-LOGIN-001:** Login with valid credentials
  - Navigate to `/customer-login`
  - Enter registered email and password
  - **Expected:** Success message, redirect to `/account`
  - **Verify:** Session token stored in localStorage

- [ ] **TC-LOGIN-002:** Login with invalid email
  - Enter non-existent email
  - **Expected:** Error message "Invalid email or password"

- [ ] **TC-LOGIN-003:** Login with wrong password
  - Enter correct email but wrong password
  - **Expected:** Error message "Invalid email or password"

- [ ] **TC-LOGIN-004:** Already logged in redirect
  - Login successfully
  - Try to access `/customer-login` again
  - **Expected:** Auto-redirect to `/account`

- [ ] **TC-LOGIN-005:** Password hashing verification
  - Check backend: Passwords should be hashed in Customers sheet
  - **Expected:** No plain text passwords in database

---

### 3. Customer Account Dashboard (account.html)

**Test Cases:**
- [ ] **TC-DASH-001:** Access without login
  - Clear localStorage
  - Navigate to `/account`
  - **Expected:** Redirect to `/customer-login`

- [ ] **TC-DASH-002:** Profile display
  - Login and access `/account`
  - **Expected:** Profile card shows customer name, email
  - **Expected:** Avatar shows first letter of name

- [ ] **TC-DASH-003:** Order history display
  - Place test orders (or use existing orders with same phone)
  - Access `/account`
  - **Expected:** Orders displayed with correct details
  - **Expected:** Order statistics updated (Total, Active, Completed, Total Spent)

- [ ] **TC-DASH-004:** Empty order state
  - Login with account that has no orders
  - **Expected:** Empty state message with "Start Shopping" button

- [ ] **TC-DASH-005:** Order history filtering
  - **Expected:** Only shows orders matching customer's phone number
  - **Expected:** Does NOT show other customers' orders

---

### 4. Profile Editing (account.html)

**Test Cases:**
- [ ] **TC-PROF-001:** Update profile information
  - Navigate to Profile section
  - Update Name, Phone, Barangay, Address
  - Click "Save Changes"
  - **Expected:** Success toast notification
  - **Expected:** Changes saved to backend
  - **Expected:** localStorage updated

- [ ] **TC-PROF-002:** Email field disabled
  - Try to edit email field
  - **Expected:** Field is disabled (cannot be changed)

- [ ] **TC-PROF-003:** Profile changes persist
  - Update profile
  - Logout and login again
  - **Expected:** Updated information displayed

- [ ] **TC-PROF-004:** Change password
  - Navigate to Change Password section
  - Enter new password (min 6 chars) and confirm
  - Click "Update Password"
  - **Expected:** Success toast notification
  - **Expected:** Can login with new password

- [ ] **TC-PROF-005:** Password mismatch validation
  - Enter different passwords in new password fields
  - **Expected:** Error message "Passwords do not match"

---

### 5. Checkout Integration (index.html)

**Test Cases:**
- [ ] **TC-CHECKOUT-001:** Guest checkout (not logged in)
  - Clear localStorage
  - Add items to cart
  - Proceed to checkout
  - **Expected:** Empty form fields
  - **Expected:** Can complete order as guest

- [ ] **TC-CHECKOUT-002:** Logged-in checkout auto-fill
  - Login as customer
  - Add items to cart
  - Proceed to checkout
  - **Expected:** Form pre-filled with customer data
  - **Expected:** Can edit pre-filled fields if needed

- [ ] **TC-CHECKOUT-003:** Order linking to account
  - Login as customer
  - Place order
  - Check account dashboard
  - **Expected:** New order appears in order history

- [ ] **TC-CHECKOUT-004:** Existing orders linked on signup
  - Place guest order with phone number
  - Register account with same phone number
  - Check account dashboard
  - **Expected:** Previous guest orders now linked to account

---

### 6. Header Navigation (index.html)

**Test Cases:**
- [ ] **TC-NAV-001:** Header shows "Login" when not logged in
  - Clear localStorage
  - Visit homepage
  - **Expected:** Header shows "Login" link to `/login`

- [ ] **TC-NAV-002:** Header shows name when logged in
  - Login as customer
  - Visit homepage
  - **Expected:** Header shows customer's first name
  - **Expected:** Clicking name goes to `/account`

- [ ] **TC-NAV-003:** Header updates after login
  - Start on homepage (not logged in)
  - Login via `/customer-login`
  - Return to homepage
  - **Expected:** Header now shows customer name

---

### 7. Session Management

**Test Cases:**
- [ ] **TC-SESSION-001:** Session token creation
  - Login or register
  - Check backend: CustomerSessions sheet
  - **Expected:** New session token created
  - **Expected:** Token has 24-hour expiry

- [ ] **TC-SESSION-002:** Session validation
  - Login and access protected endpoints
  - **Expected:** API calls include session token
  - **Expected:** Backend validates token

- [ ] **TC-SESSION-003:** Logout functionality
  - Login and access `/account`
  - Click Logout button
  - **Expected:** Redirect to `/customer-login`
  - **Expected:** localStorage cleared
  - **Expected:** Session token revoked in backend

- [ ] **TC-SESSION-004:** Session expiry handling
  - Manually set session expiry in past (backend)
  - Try to access `/account`
  - **Expected:** Error message "Session expired"
  - **Expected:** Redirect to login

- [ ] **TC-SESSION-005:** Session isolation
  - Check backend: CustomerSessions separate from Sessions (merchant)
  - **Expected:** Customer and merchant sessions don't interfere

---

### 8. Security Testing

**Test Cases:**
- [ ] **SEC-001:** Password hashing
  - Register new customer
  - Check Customers sheet in Google Sheets
  - **Expected:** Password column shows hashed value (not plain text)

- [ ] **SEC-002:** Session token security
  - Check CustomerSessions sheet
  - **Expected:** Tokens are UUIDs (not predictable)

- [ ] **SEC-003:** Order history isolation
  - Login as Customer A
  - **Expected:** Cannot see Customer B's orders
  - **Expected:** API filters by authenticated customer's phone

- [ ] **SEC-004:** Protected endpoint authentication
  - Try to call `getCustomerProfile` without session token
  - **Expected:** Error "Authentication required"

- [ ] **SEC-005:** SQL injection prevention
  - Try entering special characters in form fields
  - **Expected:** No errors, data handled safely

---

### 9. Backend API Testing

**Test Cases:**
- [ ] **API-001:** customerSignup endpoint
  - POST to API with action: `customerSignup`
  - **Expected:** Returns `{ success: true, customerId, sessionToken }`

- [ ] **API-002:** customerLogin endpoint
  - GET to API with action: `customerLogin&email=...&password=...`
  - **Expected:** Returns `{ success: true, data: {...}, sessionToken }`

- [ ] **API-003:** getCustomerProfile endpoint
  - POST with action: `getCustomerProfile` and sessionToken
  - **Expected:** Returns customer data (without password)

- [ ] **API-004:** updateCustomerProfile endpoint
  - POST with action: `updateCustomerProfile`, sessionToken, and updated fields
  - **Expected:** Returns `{ success: true, message: 'Profile updated successfully' }`

- [ ] **API-005:** getCustomerOrderHistory endpoint
  - POST with action: `getCustomerOrderHistory` and sessionToken
  - **Expected:** Returns `{ success: true, data: [...], count: n }`

- [ ] **API-006:** customerLogout endpoint
  - POST with action: `customerLogout` and sessionToken
  - **Expected:** Returns `{ success: true, message: 'Logged out successfully' }`

---

### 10. Database Schema Verification

**Check Google Sheets:**
- [ ] **DB-001:** Customers sheet exists with columns:
  - CustomerId, Name, Email, Password, Phone, Barangay, Address, CreatedAt, Status, LastLogin

- [ ] **DB-002:** CustomerSessions sheet exists with columns:
  - Token, CustomerId, CreatedAt, ExpiresAt, Status

- [ ] **DB-003:** Orders sheet has CustomerId column
  - Check if CustomerId column added
  - **Expected:** Existing orders can be linked to customers

---

### 11. User Experience Testing

**Test Cases:**
- [ ] **UX-001:** Loading states
  - Check for loading spinners during API calls
  - **Expected:** User sees feedback while waiting

- [ ] **UX-002:** Error messages
  - Trigger various errors (wrong password, network error)
  - **Expected:** Clear, user-friendly error messages

- [ ] **UX-003:** Success notifications
  - Complete successful actions (update profile, change password)
  - **Expected:** Toast notifications confirm success

- [ ] **UX-004:** Mobile responsiveness
  - Test on mobile device or browser dev tools
  - **Expected:** All pages responsive and usable

- [ ] **UX-005:** Form validation feedback
  - Enter invalid data in forms
  - **Expected:** Immediate validation feedback

---

### 12. Integration Testing

**Test Cases:**
- [ ] **INT-001:** End-to-end customer journey
  1. Register new account
  2. Browse products
  3. Add to cart
  4. Checkout (auto-filled)
  5. View order in account dashboard
  6. Update profile
  7. Logout
  8. Login again
  - **Expected:** All steps work seamlessly

- [ ] **INT-002:** Guest to registered customer conversion
  1. Place order as guest
  2. Register account with same phone
  3. Check order history
  - **Expected:** Guest order now appears in account

- [ ] **INT-003:** Multiple orders tracking
  1. Place multiple orders over time
  2. Check order history
  - **Expected:** All orders displayed, sorted by date (newest first)

---

## 🐛 Known Issues / Bugs Found

*(Document any bugs discovered during testing)*

| ID | Description | Severity | Status |
|----|-------------|----------|--------|
| - | - | - | - |

---

## 📝 Testing Notes

*(Add any additional observations or notes during testing)*

---

## ✅ Testing Sign-Off

- **Tester:** _________________
- **Date:** _________________
- **Overall Status:** [ ] Pass [ ] Fail [ ] Pass with Issues
- **Ready for Production:** [ ] Yes [ ] No

---

## 🚀 Deployment Checklist

Before deploying to production:
- [ ] All critical test cases passed
- [ ] Backend Code.gs updated in Google Apps Script
- [ ] Frontend files pushed to GitHub
- [ ] Vercel auto-deployed from GitHub
- [ ] Live site tested (https://www.amadeomarketplace.com)
- [ ] Database schema verified in Google Sheets
- [ ] Documentation updated
