# Product Reviews & Ratings - Implementation Guide

## Overview
This document outlines how to add a complete product review and rating system to Amadeo Marketplace.

## Database Schema (Google Sheets)

### New Sheet: "Reviews"
Create a new sheet named "Reviews" with these columns:

| Column | Description | Example |
|--------|-------------|---------|
| ReviewId | Unique ID (timestamp-based) | REV-1733734800123 |
| ProductId | Product being reviewed | PROD-001 |
| MerchantId | Merchant who owns the product | MERCH-001 |
| CustomerId | Customer who left review | CUST-001 |
| CustomerName | Name of reviewer | Juan Dela Cruz |
| CustomerPhone | Phone for verification | 09123456789 |
| OrderId | Order ID (for verified purchase) | ORD-2024-001 |
| Rating | Star rating (1-5) | 5 |
| ReviewText | Written review | Great product! |
| ReviewImages | JSON array of image URLs | ["url1", "url2"] |
| Status | Review status | Active/Hidden/Reported |
| CreatedAt | Timestamp | 2024-12-09 10:30:00 |
| MerchantResponse | Merchant's reply | Thank you! |
| ResponseDate | When merchant replied | 2024-12-09 15:00:00 |

## Backend API Endpoints

### 1. Get Product Reviews
```javascript
// Apps Script function
function getProductReviews(productId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reviews');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const reviews = [];
  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = data[i][index];
    });
    
    if (row.ProductId === productId && row.Status === 'Active') {
      reviews.push(row);
    }
  }
  
  return reviews;
}
```

### 2. Submit Review
```javascript
function submitReview(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reviews');
  
  // Verify order exists and is delivered
  const ordersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  const orders = ordersSheet.getDataRange().getValues();
  const orderExists = orders.some((row, i) => 
    i > 0 && 
    row[0] === data.orderId && 
    row[2] === data.customerPhone &&
    row[6].toLowerCase() === 'delivered'
  );
  
  if (!orderExists) {
    return { success: false, error: 'Order not found or not delivered' };
  }
  
  // Check if already reviewed
  const reviews = sheet.getDataRange().getValues();
  const alreadyReviewed = reviews.some((row, i) => 
    i > 0 && 
    row[1] === data.productId && 
    row[3] === data.customerId
  );
  
  if (alreadyReviewed) {
    return { success: false, error: 'You have already reviewed this product' };
  }
  
  // Add review
  const reviewId = 'REV-' + Date.now();
  sheet.appendRow([
    reviewId,
    data.productId,
    data.merchantId,
    data.customerId,
    data.customerName,
    data.customerPhone,
    data.orderId,
    data.rating,
    data.reviewText,
    JSON.stringify(data.reviewImages || []),
    'Active',
    new Date().toISOString(),
    '',
    ''
  ]);
  
  return { success: true, reviewId: reviewId };
}
```

### 3. Get Average Rating
```javascript
function getProductRating(productId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reviews');
  const data = sheet.getDataRange().getValues();
  
  let totalRating = 0;
  let count = 0;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === productId && data[i][10] === 'Active') {
      totalRating += Number(data[i][7]);
      count++;
    }
  }
  
  return {
    average: count > 0 ? (totalRating / count).toFixed(1) : 0,
    count: count
  };
}
```

## Frontend Implementation

### 1. Display Rating on Product Cards

Add to `renderProducts()` function:

```javascript
// Get product rating
var rating = getProductRating(product.id);

html += '<div class="product-card-container">' +
    '<div class="product-card" onclick="viewProduct(\'' + product.id + '\')">' +
    '<img src="' + imageUrl + '" alt="' + escapeHtml(product.name) + '" class="product-image">' +
    '<div class="product-info">' +
    '<div class="product-name">' + escapeHtml(product.name) + '</div>' +
    '<div class="product-rating">' +
    '<span class="stars">' + renderStars(rating.average) + '</span>' +
    '<span class="rating-count">(' + rating.count + ')</span>' +
    '</div>' +
    '<div class="product-merchant"><i class="fas fa-store"></i> ' + escapeHtml(merchantName) + '</div>' +
    '<div class="product-price">₱' + formatNumber(product.price) + '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
```

### 2. Star Rating Helper Function

```javascript
function renderStars(rating) {
    var stars = '';
    var fullStars = Math.floor(rating);
    var hasHalfStar = rating % 1 >= 0.5;
    
    for (var i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    var emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (var i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}
```

### 3. Review Submission Form (in Order Details)

Add to customer account page after order is delivered:

```html
<div class="review-section" id="reviewSection-${orderId}">
    <h4>Rate this product</h4>
    <div class="star-rating-input">
        <i class="far fa-star" data-rating="1" onclick="selectRating(this, '${productId}')"></i>
        <i class="far fa-star" data-rating="2" onclick="selectRating(this, '${productId}')"></i>
        <i class="far fa-star" data-rating="3" onclick="selectRating(this, '${productId}')"></i>
        <i class="far fa-star" data-rating="4" onclick="selectRating(this, '${productId}')"></i>
        <i class="far fa-star" data-rating="5" onclick="selectRating(this, '${productId}')"></i>
    </div>
    <textarea id="reviewText-${productId}" placeholder="Share your experience..." rows="4"></textarea>
    <button onclick="submitReview('${productId}', '${orderId}')">Submit Review</button>
</div>
```

### 4. Review Submission JavaScript

```javascript
var selectedRatings = {};

function selectRating(star, productId) {
    var rating = parseInt(star.getAttribute('data-rating'));
    selectedRatings[productId] = rating;
    
    // Update star display
    var stars = star.parentElement.querySelectorAll('i');
    stars.forEach(function(s, index) {
        if (index < rating) {
            s.className = 'fas fa-star';
        } else {
            s.className = 'far fa-star';
        }
    });
}

async function submitReview(productId, orderId) {
    var rating = selectedRatings[productId];
    if (!rating) {
        alert('Please select a rating');
        return;
    }
    
    var reviewText = document.getElementById('reviewText-' + productId).value.trim();
    if (!reviewText) {
        alert('Please write a review');
        return;
    }
    
    try {
        var response = await fetch(API_BASE + '?action=submitReview', {
            method: 'POST',
            body: JSON.stringify({
                action: 'submitReview',
                productId: productId,
                orderId: orderId,
                customerId: user.CustomerId || user.Phone,
                customerName: user.Name || user.CustomerName,
                customerPhone: user.Phone || user.CustomerPhone,
                merchantId: getProductMerchantId(productId),
                rating: rating,
                reviewText: reviewText
            })
        });
        
        var data = await response.json();
        
        if (data.success) {
            alert('Thank you for your review!');
            document.getElementById('reviewSection-' + orderId).innerHTML = 
                '<p style="color: green;">✓ Review submitted</p>';
        } else {
            alert('Error: ' + data.error);
        }
    } catch (e) {
        alert('Failed to submit review: ' + e.message);
    }
}
```

### 5. CSS Styles

```css
/* Rating Stars */
.product-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.stars {
    color: #fbbf24;
    font-size: 0.9rem;
}

.stars i {
    margin-right: 2px;
}

.rating-count {
    font-size: 0.85rem;
    color: var(--text-secondary);
}

/* Review Input */
.star-rating-input {
    display: flex;
    gap: 0.5rem;
    font-size: 2rem;
    margin: 1rem 0;
}

.star-rating-input i {
    color: #d1d5db;
    cursor: pointer;
    transition: color 0.2s;
}

.star-rating-input i:hover,
.star-rating-input i.fas {
    color: #fbbf24;
}

.review-section textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-family: inherit;
    resize: vertical;
}

.review-section button {
    margin-top: 0.75rem;
    padding: 0.75rem 1.5rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}
```

## Deployment Steps

1. **Create Reviews Sheet**
   - Open Google Sheets
   - Add new sheet named "Reviews"
   - Add column headers as specified above

2. **Update Apps Script**
   - Add the three functions: `getProductReviews`, `submitReview`, `getProductRating`
   - Update `doGet` to handle review requests
   - Deploy new version

3. **Update Frontend**
   - Add rating display to product cards
   - Add review form to order details
   - Add CSS styles
   - Deploy to Vercel

4. **Test**
   - Place a test order
   - Mark it as delivered
   - Submit a review
   - Verify review appears on product card

## Future Enhancements

- Photo uploads with reviews
- Merchant responses to reviews
- Review moderation in admin panel
- Sort reviews by date/rating
- Helpful/Not helpful votes
- Report inappropriate reviews
- Review reminders via SMS/email

---

**Note:** This is a simplified implementation. For production, add:
- Input validation
- XSS protection
- Rate limiting
- Review verification
- Spam detection
