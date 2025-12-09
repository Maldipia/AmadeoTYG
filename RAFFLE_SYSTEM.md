# Monthly Raffle System - Implementation Guide

## Overview
Customers who pay online (GCash, Maya, Bank Transfer) automatically get **1 raffle entry** per order for the monthly prize draw.

## Prizes
- Staycations
- Original shoes
- Apparels
- And more exciting prizes!

---

## Google Sheets Setup

### New Sheet: "RaffleEntries"

Create a new sheet named "RaffleEntries" with these columns:

| Column | Description | Example |
|--------|-------------|---------|
| EntryId | Unique entry ID | RAFFLE-2024-12-001 |
| OrderId | Order that generated entry | ORD-2024-001 |
| CustomerId | Customer ID | CUST-001 |
| CustomerName | Customer name | Juan Dela Cruz |
| CustomerPhone | Phone number | 09123456789 |
| CustomerEmail | Email address | juan@email.com |
| OrderAmount | Order total | 1000 |
| PaymentMethod | Payment used | GCash |
| EntryDate | When entry was created | 2024-12-09 10:30:00 |
| DrawMonth | Month of draw | 2024-12 |
| Status | Entry status | Active/Used/Void |
| WonPrize | Prize won (if any) | Staycation Package |
| DrawDate | When draw happened | 2024-12-31 |

### New Sheet: "RafflePrizes"

Create a new sheet named "RafflePrizes" with these columns:

| Column | Description | Example |
|--------|-------------|---------|
| PrizeId | Unique prize ID | PRIZE-001 |
| PrizeName | Name of prize | Staycation at Tagaytay |
| PrizeDescription | Details | 2D1N stay for 2 pax |
| PrizeValue | Estimated value | 5000 |
| PrizeImage | Image URL | https://... |
| DrawMonth | Month to draw | 2024-12 |
| Status | Prize status | Available/Drawn/Claimed |
| WinnerId | Winner entry ID | RAFFLE-2024-12-042 |
| WinnerName | Winner name | Juan Dela Cruz |
| WinnerPhone | Winner phone | 09123456789 |
| DrawnDate | When drawn | 2024-12-31 |
| ClaimedDate | When claimed | 2025-01-05 |

### New Sheet: "RaffleDraws"

Track monthly draws:

| Column | Description | Example |
|--------|-------------|---------|
| DrawId | Unique draw ID | DRAW-2024-12 |
| DrawMonth | Month/year | December 2024 |
| DrawDate | When draw happened | 2024-12-31 18:00:00 |
| TotalEntries | Total entries | 156 |
| TotalPrizes | Prizes given | 5 |
| Winners | JSON of winners | [...] |
| Status | Draw status | Scheduled/Completed |
| Notes | Additional info | Live on Facebook |

---

## Backend Implementation (Apps Script)

### 1. Auto-Create Raffle Entry on Order

Update the `createOrder` function in Apps Script:

```javascript
function createOrder(data) {
  // ... existing order creation code ...
  
  // Check if payment method is online (not COD)
  if (data.paymentMethod !== 'cod') {
    createRaffleEntry(orderId, data);
  }
  
  return { success: true, orderId: orderId };
}

function createRaffleEntry(orderId, orderData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RaffleEntries');
  
  const entryId = 'RAFFLE-' + new Date().getFullYear() + '-' + 
                  String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                  String(sheet.getLastRow()).padStart(3, '0');
  
  const drawMonth = new Date().getFullYear() + '-' + 
                    String(new Date().getMonth() + 1).padStart(2, '0');
  
  sheet.appendRow([
    entryId,
    orderId,
    orderData.customerPhone, // Use as customer ID
    orderData.customerName,
    orderData.customerPhone,
    orderData.customerEmail || '',
    orderData.total,
    orderData.paymentMethod,
    new Date().toISOString(),
    drawMonth,
    'Active',
    '', // WonPrize
    ''  // DrawDate
  ]);
  
  Logger.log('Raffle entry created: ' + entryId);
  return entryId;
}
```

### 2. Get Customer's Raffle Entries

```javascript
function getCustomerRaffleEntries(customerPhone) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RaffleEntries');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const entries = [];
  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = data[i][index];
    });
    
    if (row.CustomerPhone === customerPhone && row.Status === 'Active') {
      entries.push(row);
    }
  }
  
  return entries;
}
```

### 3. Get Monthly Draw Info

```javascript
function getMonthlyDrawInfo() {
  const currentMonth = new Date().getFullYear() + '-' + 
                       String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Get total entries this month
  const entriesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RaffleEntries');
  const entriesData = entriesSheet.getDataRange().getValues();
  
  let totalEntries = 0;
  for (let i = 1; i < entriesData.length; i++) {
    if (entriesData[i][9] === currentMonth && entriesData[i][10] === 'Active') {
      totalEntries++;
    }
  }
  
  // Get prizes for this month
  const prizesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RafflePrizes');
  const prizesData = prizesSheet.getDataRange().getValues();
  
  const prizes = [];
  for (let i = 1; i < prizesData.length; i++) {
    if (prizesData[i][5] === currentMonth && prizesData[i][6] === 'Available') {
      prizes.push({
        name: prizesData[i][1],
        description: prizesData[i][2],
        value: prizesData[i][3],
        image: prizesData[i][4]
      });
    }
  }
  
  return {
    month: currentMonth,
    totalEntries: totalEntries,
    prizes: prizes,
    drawDate: getLastDayOfMonth()
  };
}

function getLastDayOfMonth() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.toISOString().split('T')[0];
}
```

### 4. Conduct Monthly Draw (Manual/Admin)

```javascript
function conductMonthlyDraw(drawMonth) {
  // Get all active entries for the month
  const entriesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RaffleEntries');
  const entriesData = entriesSheet.getDataRange().getValues();
  
  const eligibleEntries = [];
  for (let i = 1; i < entriesData.length; i++) {
    if (entriesData[i][9] === drawMonth && entriesData[i][10] === 'Active') {
      eligibleEntries.push({
        row: i + 1,
        entryId: entriesData[i][0],
        customerName: entriesData[i][3],
        customerPhone: entriesData[i][4]
      });
    }
  }
  
  if (eligibleEntries.length === 0) {
    return { success: false, error: 'No eligible entries' };
  }
  
  // Get available prizes
  const prizesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RafflePrizes');
  const prizesData = prizesSheet.getDataRange().getValues();
  
  const availablePrizes = [];
  for (let i = 1; i < prizesData.length; i++) {
    if (prizesData[i][5] === drawMonth && prizesData[i][6] === 'Available') {
      availablePrizes.push({
        row: i + 1,
        prizeId: prizesData[i][0],
        prizeName: prizesData[i][1]
      });
    }
  }
  
  if (availablePrizes.length === 0) {
    return { success: false, error: 'No prizes available' };
  }
  
  // Draw winners
  const winners = [];
  for (let prize of availablePrizes) {
    // Random pick
    const winnerIndex = Math.floor(Math.random() * eligibleEntries.length);
    const winner = eligibleEntries[winnerIndex];
    
    // Update entry
    entriesSheet.getRange(winner.row, 11).setValue(prize.prizeName); // WonPrize
    entriesSheet.getRange(winner.row, 12).setValue(new Date().toISOString()); // DrawDate
    entriesSheet.getRange(winner.row, 13).setValue('Used'); // Status
    
    // Update prize
    prizesSheet.getRange(prize.row, 7).setValue('Drawn'); // Status
    prizesSheet.getRange(prize.row, 8).setValue(winner.entryId); // WinnerId
    prizesSheet.getRange(prize.row, 9).setValue(winner.customerName); // WinnerName
    prizesSheet.getRange(prize.row, 10).setValue(winner.customerPhone); // WinnerPhone
    prizesSheet.getRange(prize.row, 11).setValue(new Date().toISOString()); // DrawnDate
    
    winners.push({
      prize: prize.prizeName,
      winner: winner.customerName,
      phone: winner.customerPhone
    });
    
    // Remove winner from eligible entries
    eligibleEntries.splice(winnerIndex, 1);
  }
  
  // Record draw
  const drawsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RaffleDraws');
  drawsSheet.appendRow([
    'DRAW-' + drawMonth,
    drawMonth,
    new Date().toISOString(),
    eligibleEntries.length + winners.length,
    winners.length,
    JSON.stringify(winners),
    'Completed',
    ''
  ]);
  
  return { success: true, winners: winners };
}
```

---

## Frontend Implementation

### 1. Show Raffle Info on Homepage

Add a raffle banner section:

```html
<section class="raffle-banner">
    <div class="container">
        <div class="raffle-content">
            <div class="raffle-icon">🎁</div>
            <div class="raffle-text">
                <h3>Monthly Raffle Draw!</h3>
                <p>Pay online and get <strong>1 FREE entry</strong> to win amazing prizes</p>
                <div class="raffle-prizes">
                    <span>🏖️ Staycations</span>
                    <span>👟 Original Shoes</span>
                    <span>👕 Apparels</span>
                    <span>✨ And More!</span>
                </div>
            </div>
            <button onclick="viewRafflePrizes()" class="raffle-btn">View Prizes</button>
        </div>
        <div class="raffle-stats">
            <div class="stat">
                <div class="stat-value" id="raffleEntries">0</div>
                <div class="stat-label">Entries This Month</div>
            </div>
            <div class="stat">
                <div class="stat-value" id="rafflePrizes">0</div>
                <div class="stat-label">Prizes to Win</div>
            </div>
            <div class="stat">
                <div class="stat-value" id="raffleDrawDate">Dec 31</div>
                <div class="stat-label">Next Draw</div>
            </div>
        </div>
    </div>
</section>
```

### 2. Show Customer's Entries in Account Page

```javascript
async function loadCustomerRaffleEntries(phone) {
    const response = await fetch(API_BASE + '?action=getCustomerRaffleEntries&phone=' + phone);
    const entries = await response.json();
    
    const container = document.getElementById('raffleEntriesContainer');
    if (entries.length === 0) {
        container.innerHTML = '<p>No raffle entries yet. Pay online to get entries!</p>';
        return;
    }
    
    let html = '<h3>Your Raffle Entries (' + entries.length + ')</h3>';
    html += '<div class="raffle-entries-list">';
    
    for (let entry of entries) {
        html += '<div class="raffle-entry-card">' +
            '<div class="entry-id">' + entry.EntryId + '</div>' +
            '<div class="entry-order">Order: ' + entry.OrderId + '</div>' +
            '<div class="entry-date">' + new Date(entry.EntryDate).toLocaleDateString() + '</div>' +
            '<div class="entry-status">✓ Active</div>' +
            '</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
}
```

### 3. Show Success Message After Online Payment

After successful order with online payment:

```javascript
if (paymentMethod !== 'cod') {
    alert('✅ Order placed successfully!\n\n' +
          '🎁 BONUS: You received 1 raffle entry for our monthly draw!\n' +
          'Win staycations, shoes, apparels & more!\n\n' +
          'Order ID: ' + orderId);
}
```

---

## Marketing Materials

### Social Media Posts

**Post 1: Announcement**
```
🎉 NEW! Monthly Raffle Draw at Amadeo Marketplace! 🎁

Pay online (GCash/Maya/Bank Transfer) and automatically get:
✅ 3% discount
✅ 1 FREE raffle entry

Win amazing prizes:
🏖️ Staycations
👟 Original Shoes
👕 Branded Apparels
✨ And more!

Draw every end of month!

Shop now: amadeomarketplace.com
```

**Post 2: Reminder**
```
⏰ 5 days left to enter this month's raffle!

Current prizes:
🏖️ 2D1N Staycation in Tagaytay
👟 Nike Air Max (Original)
👕 Uniqlo Gift Certificate ₱2,000

How to join:
1️⃣ Order from Amadeo Marketplace
2️⃣ Pay online (GCash/Maya/Bank)
3️⃣ Get automatic entry!

Every online order = 1 entry
More orders = More chances to win!

🛒 amadeomarketplace.com
```

**Post 3: Winner Announcement**
```
🎊 CONGRATULATIONS to our December Winners! 🎊

🏖️ Staycation: Juan D. - Loma
👟 Nike Shoes: Maria S. - San Agustin
👕 Uniqlo GC: Pedro R. - Bucal

Thank you to all 156 participants!

January raffle is now open!
Pay online and get your entry today!

🛒 amadeomarketplace.com
```

---

## Admin Panel Features

### Monthly Draw Page

Create `admin/raffle-draw.html`:

```html
<h2>Monthly Raffle Draw</h2>

<div class="draw-controls">
    <select id="drawMonth">
        <option value="2024-12">December 2024</option>
        <option value="2025-01">January 2025</option>
    </select>
    
    <button onclick="viewEntries()">View Entries</button>
    <button onclick="conductDraw()" class="primary">Conduct Draw</button>
</div>

<div id="drawResults"></div>

<script>
async function conductDraw() {
    const month = document.getElementById('drawMonth').value;
    
    if (!confirm('Conduct draw for ' + month + '?')) return;
    
    const response = await fetch(API_BASE + '?action=conductMonthlyDraw&month=' + month);
    const result = await response.json();
    
    if (result.success) {
        alert('Draw completed! ' + result.winners.length + ' winners selected.');
        displayWinners(result.winners);
    } else {
        alert('Error: ' + result.error);
    }
}

function displayWinners(winners) {
    let html = '<h3>Winners</h3><table><tr><th>Prize</th><th>Winner</th><th>Phone</th></tr>';
    for (let w of winners) {
        html += '<tr><td>' + w.prize + '</td><td>' + w.winner + '</td><td>' + w.phone + '</td></tr>';
    }
    html += '</table>';
    document.getElementById('drawResults').innerHTML = html;
}
</script>
```

---

## Legal & Terms

### Raffle Terms & Conditions

Create `/raffle-terms.html`:

1. **Eligibility**: Open to all customers who pay online
2. **Entry**: 1 entry per online payment order
3. **Draw**: Last day of each month at 6 PM
4. **Prizes**: As announced, subject to availability
5. **Winner Notification**: Via phone call/SMS within 3 days
6. **Claiming**: Winners have 30 days to claim
7. **Non-transferable**: Prizes cannot be exchanged for cash

---

## Implementation Checklist

### Phase 1: Setup (Day 1)
- [ ] Create RaffleEntries sheet
- [ ] Create RafflePrizes sheet
- [ ] Create RaffleDraws sheet
- [ ] Add sample prizes for current month

### Phase 2: Backend (Day 2)
- [ ] Update createOrder to create raffle entries
- [ ] Add getCustomerRaffleEntries function
- [ ] Add getMonthlyDrawInfo function
- [ ] Add conductMonthlyDraw function

### Phase 3: Frontend (Day 3)
- [ ] Add raffle banner to homepage
- [ ] Add raffle entries to account page
- [ ] Update order confirmation message
- [ ] Create raffle prizes modal

### Phase 4: Admin (Day 4)
- [ ] Create admin raffle draw page
- [ ] Test draw functionality
- [ ] Create winner notification template

### Phase 5: Marketing (Day 5)
- [ ] Create social media graphics
- [ ] Post announcement
- [ ] Add raffle terms page
- [ ] Send email to existing customers

---

**Last Updated:** December 9, 2024  
**Status:** Ready to implement  
**Estimated Time:** 5 days
