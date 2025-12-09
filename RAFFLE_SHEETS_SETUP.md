# Google Sheets Setup for Raffle System

## Step-by-Step Instructions

### 1. Open Your Google Sheet

Go to: https://docs.google.com/spreadsheets/d/1GXl6tPmofpgdnpEIuts8gSLYAw9roTQegKrgSjYaErA

---

## Sheet 1: RaffleEntries

### Create New Sheet
1. Click the **+** button at bottom left
2. Rename to: **RaffleEntries**

### Add Column Headers (Row 1)

Copy and paste this EXACT row into A1:

```
EntryId	OrderId	CustomerId	CustomerName	CustomerPhone	CustomerEmail	OrderAmount	PaymentMethod	EntryDate	DrawMonth	Status	WonPrize	DrawDate
```

**Or manually type each column:**

| Column | Header Name |
|--------|-------------|
| A | EntryId |
| B | OrderId |
| C | CustomerId |
| D | CustomerName |
| E | CustomerPhone |
| F | CustomerEmail |
| G | OrderAmount |
| H | PaymentMethod |
| I | EntryDate |
| J | DrawMonth |
| K | Status |
| L | WonPrize |
| M | DrawDate |

### Format the Sheet
1. Select Row 1 (header row)
2. Make it **bold**
3. Background color: Light blue (#E3F2FD)
4. Freeze row: View → Freeze → 1 row

### Sample Data (Optional - for testing)

Add this in Row 2:

```
RAFFLE-2024-12-001	ORD-2024-001	09123456789	Juan Dela Cruz	09123456789	juan@email.com	1000	GCash	2024-12-09 10:30:00	2024-12	Active		
```

---

## Sheet 2: RafflePrizes

### Create New Sheet
1. Click the **+** button
2. Rename to: **RafflePrizes**

### Add Column Headers (Row 1)

Copy and paste this EXACT row into A1:

```
PrizeId	PrizeName	PrizeDescription	PrizeValue	PrizeImage	DrawMonth	Status	WinnerId	WinnerName	WinnerPhone	DrawnDate	ClaimedDate
```

**Or manually type each column:**

| Column | Header Name |
|--------|-------------|
| A | PrizeId |
| B | PrizeName |
| C | PrizeDescription |
| D | PrizeValue |
| E | PrizeImage |
| F | DrawMonth |
| G | Status |
| H | WinnerId |
| I | WinnerName |
| J | WinnerPhone |
| K | DrawnDate |
| L | ClaimedDate |

### Format the Sheet
1. Select Row 1 (header row)
2. Make it **bold**
3. Background color: Light green (#E8F5E9)
4. Freeze row: View → Freeze → 1 row

### Add December 2024 Prizes

Add these rows starting from Row 2:

**Row 2:**
```
PRIZE-2024-12-001	Tagaytay Staycation	2D1N stay for 2 pax at Taal Vista Hotel	3000	https://via.placeholder.com/400x300?text=Staycation	2024-12	Available				
```

**Row 3:**
```
PRIZE-2024-12-002	Nike Air Max Shoes	Original Nike Air Max - Size 9	1500	https://via.placeholder.com/400x300?text=Nike+Shoes	2024-12	Available				
```

**Row 4:**
```
PRIZE-2024-12-003	Uniqlo Gift Certificate	₱500 Uniqlo Shopping Voucher	500	https://via.placeholder.com/400x300?text=Uniqlo+GC	2024-12	Available				
```

---

## Sheet 3: RaffleDraws

### Create New Sheet
1. Click the **+** button
2. Rename to: **RaffleDraws**

### Add Column Headers (Row 1)

Copy and paste this EXACT row into A1:

```
DrawId	DrawMonth	DrawDate	TotalEntries	TotalPrizes	Winners	Status	Notes
```

**Or manually type each column:**

| Column | Header Name |
|--------|-------------|
| A | DrawId |
| B | DrawMonth |
| C | DrawDate |
| D | TotalEntries |
| E | TotalPrizes |
| F | Winners |
| G | Status |
| H | Notes |

### Format the Sheet
1. Select Row 1 (header row)
2. Make it **bold**
3. Background color: Light yellow (#FFF9C4)
4. Freeze row: View → Freeze → 1 row

### Sample Data (Optional)

Add this in Row 2 (for December 2024 scheduled draw):

```
DRAW-2024-12	December 2024	2024-12-31 18:00:00	0	3	[]	Scheduled	Draw will be conducted live on Facebook
```

---

## Verification Checklist

After setup, verify:

- [ ] RaffleEntries sheet exists with 13 columns
- [ ] RafflePrizes sheet exists with 12 columns
- [ ] RaffleDraws sheet exists with 8 columns
- [ ] All header rows are bold and colored
- [ ] All header rows are frozen
- [ ] December 2024 prizes are added (3 prizes)
- [ ] December 2024 draw is scheduled

---

## Sheet Protection (Optional but Recommended)

### Protect RaffleDraws Sheet
1. Right-click on "RaffleDraws" tab
2. Click "Protect sheet"
3. Check "Except certain cells"
4. Select only the data rows (not headers)
5. Click "Set permissions"
6. Choose "Only you"

This prevents accidental editing of draw results.

---

## Quick Copy-Paste Setup

If you want to set up quickly, here's the complete data for each sheet:

### RaffleEntries (Copy all 2 rows)
```
EntryId	OrderId	CustomerId	CustomerName	CustomerPhone	CustomerEmail	OrderAmount	PaymentMethod	EntryDate	DrawMonth	Status	WonPrize	DrawDate
RAFFLE-2024-12-001	ORD-2024-001	09123456789	Juan Dela Cruz	09123456789	juan@email.com	1000	GCash	2024-12-09 10:30:00	2024-12	Active		
```

### RafflePrizes (Copy all 4 rows)
```
PrizeId	PrizeName	PrizeDescription	PrizeValue	PrizeImage	DrawMonth	Status	WinnerId	WinnerName	WinnerPhone	DrawnDate	ClaimedDate
PRIZE-2024-12-001	Tagaytay Staycation	2D1N stay for 2 pax at Taal Vista Hotel	3000	https://via.placeholder.com/400x300?text=Staycation	2024-12	Available				
PRIZE-2024-12-002	Nike Air Max Shoes	Original Nike Air Max - Size 9	1500	https://via.placeholder.com/400x300?text=Nike+Shoes	2024-12	Available				
PRIZE-2024-12-003	Uniqlo Gift Certificate	₱500 Uniqlo Shopping Voucher	500	https://via.placeholder.com/400x300?text=Uniqlo+GC	2024-12	Available				
```

### RaffleDraws (Copy all 2 rows)
```
DrawId	DrawMonth	DrawDate	TotalEntries	TotalPrizes	Winners	Status	Notes
DRAW-2024-12	December 2024	2024-12-31 18:00:00	0	3	[]	Scheduled	Draw will be conducted live on Facebook
```

---

## Notes

- **Tab-separated**: When copying, make sure columns are separated by TABS (not spaces)
- **Date format**: Use YYYY-MM-DD HH:MM:SS format
- **DrawMonth format**: Use YYYY-MM format (e.g., 2024-12)
- **Status values**: 
  - RaffleEntries: Active, Used, Void
  - RafflePrizes: Available, Drawn, Claimed
  - RaffleDraws: Scheduled, Completed

---

**Next Step:** After sheets are set up, proceed to Apps Script installation.
