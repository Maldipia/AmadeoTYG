# Amadeo Marketplace - Feature Roadmap

## 🎯 Current Status (December 9, 2024)

### ✅ Completed Features
- [x] Homepage with product/store listings
- [x] Shopping cart functionality
- [x] Checkout process
- [x] Merchant dashboard (product management)
- [x] Customer registration and login
- [x] Order tracking system
- [x] Admin panel for merchant management
- [x] Product variants support
- [x] Image upload to Google Drive
- [x] Delivery/Pickup badges on stores and products
- [x] Case-insensitive status filtering
- [x] Separate login pages (merchant/customer/admin)

---

## 🚀 Priority 1: Critical for Launch (Next 1-2 weeks)

### 1. **Order Management for Merchants** ⭐⭐⭐
**Why:** Merchants need to see and manage incoming orders
**Impact:** HIGH - Core business functionality
**Effort:** Medium (2-3 days)

**Features:**
- View all orders for their store
- Update order status (Pending → Processing → Out for Delivery → Completed)
- View customer contact information
- Print order receipts
- Order notifications

**Implementation:**
- Add "Orders" tab in merchant dashboard
- Create `getOrdersByMerchant` API endpoint
- Add order status update functionality
- Email/SMS notifications (optional)

---

### 2. **Customer Order History** ⭐⭐⭐
**Why:** Customers need to track their purchases
**Impact:** HIGH - Essential for customer experience
**Effort:** Low (1 day)

**Features:**
- View past orders in customer account
- Reorder previous items
- Cancel pending orders
- Rate completed orders

**Implementation:**
- Enhance account.html with order history
- Filter orders by customer phone number
- Add reorder button functionality

---

### 3. **Real-Time Stock Management** ⭐⭐⭐
**Why:** Prevent overselling and show accurate availability
**Impact:** HIGH - Prevents customer frustration
**Effort:** Medium (2 days)

**Features:**
- Reduce stock when order is placed
- Show "Out of Stock" badge on products
- Disable "Add to Cart" for out-of-stock items
- Low stock alerts for merchants (< 5 items)
- Automatic stock restoration if order is cancelled

**Implementation:**
- Update `placeOrder` to reduce stock levels
- Add stock validation before checkout
- Create low stock notification system

---

## 🎨 Priority 2: Enhanced User Experience (Weeks 3-4)

### 4. **Search Functionality** ⭐⭐
**Why:** Users need to find products quickly
**Impact:** MEDIUM - Improves usability
**Effort:** Low (1 day)

**Features:**
- Search by product name
- Search by merchant name
- Search by category
- Auto-suggestions as user types
- Recent searches

**Implementation:**
- Implement search in existing search bar
- Add fuzzy matching for typos
- Store recent searches in localStorage

---

### 5. **Product Reviews & Ratings** ⭐⭐
**Why:** Build trust and help customers make decisions
**Impact:** MEDIUM - Increases conversion
**Effort:** High (3-4 days)

**Features:**
- 5-star rating system
- Written reviews with photos
- Verified purchase badge
- Merchant responses to reviews
- Sort by rating/date
- Report inappropriate reviews

**Implementation:**
- Create "Reviews" sheet in Google Sheets
- Add review form after order completion
- Display average rating on product cards
- Add review moderation in admin panel

---

### 6. **Wishlist/Favorites** ⭐⭐
**Why:** Let customers save items for later
**Impact:** MEDIUM - Increases return visits
**Effort:** Low (1 day)

**Features:**
- Heart icon on product cards
- Save to wishlist (localStorage or database)
- View all wishlist items
- Move wishlist items to cart
- Share wishlist via link

**Implementation:**
- Add heart icon to product cards
- Store wishlist in localStorage (guest) or database (logged-in)
- Create wishlist page

---

## 💰 Priority 3: Revenue & Growth (Month 2)

### 7. **Payment Gateway Integration** ⭐⭐⭐
**Why:** Enable online payments (not just COD)
**Impact:** HIGH - Increases sales
**Effort:** High (5-7 days)

**Options:**
- **GCash** - Most popular in Philippines
- **Maya (PayMaya)** - Second most popular
- **PayPal** - For international customers
- **Xendit** - Payment aggregator (supports all above)

**Features:**
- Multiple payment methods
- Payment confirmation
- Refund processing
- Transaction history

**Implementation:**
- Integrate Xendit or Paymongo API
- Add payment method selection in checkout
- Handle payment callbacks
- Store transaction records

---

### 8. **Promo Codes & Discounts** ⭐⭐
**Why:** Marketing tool to attract customers
**Impact:** MEDIUM - Increases conversions
**Effort:** Medium (2-3 days)

**Features:**
- Percentage discounts (e.g., 10% off)
- Fixed amount discounts (e.g., ₱50 off)
- Free delivery codes
- Minimum order requirements
- Expiration dates
- Usage limits (one-time, per customer, total uses)

**Implementation:**
- Create "PromoCodes" sheet
- Add promo code input in checkout
- Validate and apply discounts
- Track promo code usage

---

### 9. **Merchant Subscription Plans** ⭐⭐
**Why:** Monetize the platform
**Impact:** HIGH - Revenue generation
**Effort:** High (4-5 days)

**Plans:**
- **Free**: 5 products, 5% commission
- **Basic (₱299/month)**: 20 products, 3% commission
- **Pro (₱799/month)**: Unlimited products, 1% commission, featured placement

**Features:**
- Subscription management in merchant dashboard
- Payment via GCash/Bank transfer
- Auto-downgrade on payment failure
- Featured store badge for Pro members

---

## 📱 Priority 4: Mobile & Notifications (Month 3)

### 10. **SMS Notifications** ⭐⭐⭐
**Why:** Keep customers and merchants informed
**Impact:** HIGH - Reduces support inquiries
**Effort:** Medium (2-3 days)

**Notifications:**
- Order confirmation (customer)
- New order alert (merchant)
- Order status updates (customer)
- Delivery updates (customer)
- Low stock alerts (merchant)

**Implementation:**
- Integrate Semaphore or Twilio SMS API
- Create notification templates
- Add notification preferences in settings

---

### 11. **Progressive Web App (PWA)** ⭐⭐
**Why:** App-like experience without app store
**Impact:** MEDIUM - Better mobile experience
**Effort:** Medium (2-3 days)

**Features:**
- Add to home screen
- Offline browsing
- Push notifications
- App icon and splash screen

**Implementation:**
- Add service worker
- Create manifest.json
- Enable offline caching
- Register for push notifications

---

### 12. **Email Notifications** ⭐
**Why:** Professional communication channel
**Impact:** LOW - Nice to have
**Effort:** Low (1 day)

**Emails:**
- Order confirmation with receipt
- Password reset
- Welcome email for new users
- Weekly sales summary (merchants)

**Implementation:**
- Use SendGrid or Mailgun API
- Create HTML email templates
- Add email preferences in settings

---

## 🛡️ Priority 5: Security & Optimization (Ongoing)

### 13. **Enhanced Security** ⭐⭐⭐
**Why:** Protect user data and prevent fraud
**Impact:** HIGH - Critical for trust
**Effort:** Medium (3-4 days)

**Features:**
- Password hashing (bcrypt)
- Rate limiting on API endpoints
- CAPTCHA on registration/login
- Input sanitization
- SQL injection prevention (already using Sheets, but validate inputs)
- XSS protection
- HTTPS enforcement

---

### 14. **Performance Optimization** ⭐⭐
**Why:** Faster loading = better user experience
**Impact:** MEDIUM - Reduces bounce rate
**Effort:** Medium (2-3 days)

**Optimizations:**
- Image lazy loading
- Image compression and WebP format
- CDN for static assets
- Minify CSS/JS
- Database query optimization
- Caching API responses
- Reduce API calls (batch requests)

---

### 15. **Analytics Dashboard** ⭐⭐
**Why:** Data-driven decisions for merchants and admin
**Impact:** MEDIUM - Business insights
**Effort:** High (4-5 days)

**Metrics:**
- Total sales (daily/weekly/monthly)
- Order count and average order value
- Top-selling products
- Customer demographics (barangay distribution)
- Conversion rate
- Traffic sources
- Revenue by merchant

**Implementation:**
- Create analytics sheet with aggregated data
- Build charts using Chart.js
- Add date range filters
- Export reports to PDF/Excel

---

## 🎁 Priority 6: Advanced Features (Month 4+)

### 16. **Multi-Vendor Cart Optimization**
- Split cart by merchant
- Show separate delivery fees per merchant
- Coordinate delivery times

### 17. **Delivery Tracking**
- GPS tracking for delivery riders
- Real-time map view
- Estimated delivery time

### 18. **Loyalty Program**
- Points for purchases
- Redeem points for discounts
- Referral bonuses

### 19. **Social Features**
- Share products on Facebook/Messenger
- Follow favorite stores
- Product recommendations

### 20. **Bulk Order Management**
- Wholesale pricing
- Minimum order quantities
- Custom quotes for large orders

---

## 📊 Recommended Implementation Order

### **Week 1-2: Core Business Features**
1. Order Management for Merchants
2. Customer Order History
3. Real-Time Stock Management

### **Week 3-4: User Experience**
4. Search Functionality
5. Wishlist/Favorites
6. Product Reviews & Ratings

### **Month 2: Revenue Generation**
7. Payment Gateway Integration
8. Promo Codes & Discounts
9. Merchant Subscription Plans

### **Month 3: Engagement**
10. SMS Notifications
11. PWA Features
12. Email Notifications

### **Ongoing: Foundation**
13. Enhanced Security
14. Performance Optimization
15. Analytics Dashboard

---

## 🎯 My Top 3 Recommendations for Next Sprint

### **#1: Order Management for Merchants** 
**Why First:** Merchants can't operate without seeing their orders. This is blocking real business use.
**Estimated Time:** 2-3 days
**Impact:** Enables actual business transactions

### **#2: Real-Time Stock Management**
**Why Second:** Prevents overselling and customer complaints. Critical for trust.
**Estimated Time:** 2 days
**Impact:** Prevents operational issues

### **#3: Search Functionality**
**Why Third:** As you add more products, customers need to find items quickly.
**Estimated Time:** 1 day
**Impact:** Improves usability significantly

---

## 💡 Quick Wins (Can be done in 1 day each)

- [ ] Add "New" badge for products added in last 7 days
- [ ] Add "Sale" badge for discounted products
- [ ] Add merchant operating hours display
- [ ] Add "Call" button with merchant phone number
- [ ] Add social media links in footer
- [ ] Add breadcrumb navigation
- [ ] Add back-to-top button
- [ ] Add loading skeletons instead of "Loading..."
- [ ] Add empty state illustrations
- [ ] Add 404 error page

---

**Last Updated:** December 9, 2024  
**Next Review:** December 16, 2024
