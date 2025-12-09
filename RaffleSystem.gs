// ============================================
// RAFFLE SYSTEM - Apps Script Code
// ============================================
// Add this code to your Google Apps Script project
// File: RaffleSystem.gs

// ============================================
// 1. AUTO-CREATE RAFFLE ENTRY ON ORDER
// ============================================

/**
 * Creates a raffle entry when order is placed with online payment
 * Called automatically from createOrder function
 */
function createRaffleEntry(orderId, orderData) {
  try {
    // Only create entry for online payments (not COD)
    if (!orderData.paymentMethod || orderData.paymentMethod.toLowerCase() === 'cod') {
      Logger.log('COD payment - no raffle entry created');
      return null;
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RaffleEntries');
    if (!sheet) {
      Logger.log('ERROR: RaffleEntries sheet not found');
      return null;
    }
    
    // Generate Entry ID
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const lastRow = sheet.getLastRow();
    const entryNumber = String(lastRow).padStart(3, '0');
    const entryId = `RAFFLE-${year}-${month}-${entryNumber}`;
    
    // Generate Draw Month
    const drawMonth = `${year}-${month}`;
    
    // Prepare entry data
    const entryData = [
      entryId,                                    // EntryId
      orderId,                                    // OrderId
      orderData.customerPhone || '',              // CustomerId (using phone)
      orderData.customerName || '',               // CustomerName
      orderData.customerPhone || '',              // CustomerPhone
      orderData.customerEmail || '',              // CustomerEmail
      orderData.total || 0,                       // OrderAmount
      orderData.paymentMethod || '',              // PaymentMethod
      now.toISOString(),                          // EntryDate
      drawMonth,                                  // DrawMonth
      'Active',                                   // Status
      '',                                         // WonPrize (empty initially)
      ''                                          // DrawDate (empty initially)
    ];
    
    // Append to sheet
    sheet.appendRow(entryData);
    
    Logger.log(`Raffle entry created: ${entryId} for order ${orderId}`);
    return entryId;
    
  } catch (error) {
    Logger.log('ERROR creating raffle entry: ' + error.toString());
    return null;
  }
}


// ============================================
// 2. GET CUSTOMER'S RAFFLE ENTRIES
// ============================================

/**
 * Get all raffle entries for a specific customer
 * @param {string} customerPhone - Customer's phone number
 * @return {Array} Array of entry objects
 */
function getCustomerRaffleEntries(customerPhone) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RaffleEntries');
    if (!sheet) {
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return []; // No entries (only header row)
    }
    
    const headers = data[0];
    const entries = [];
    
    // Find column indices
    const phoneCol = headers.indexOf('CustomerPhone');
    const statusCol = headers.indexOf('Status');
    
    // Loop through data rows
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Match customer phone and active status
      if (row[phoneCol] === customerPhone && row[statusCol] === 'Active') {
        const entry = {};
        headers.forEach((header, index) => {
          entry[header] = row[index];
        });
        entries.push(entry);
      }
    }
    
    return entries;
    
  } catch (error) {
    Logger.log('ERROR getting customer raffle entries: ' + error.toString());
    return [];
  }
}


// ============================================
// 3. GET MONTHLY DRAW INFO
// ============================================

/**
 * Get information about current month's raffle draw
 * @return {Object} Draw information including entries count and prizes
 */
function getMonthlyDrawInfo() {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Get total entries this month
    const entriesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RaffleEntries');
    let totalEntries = 0;
    
    if (entriesSheet) {
      const entriesData = entriesSheet.getDataRange().getValues();
      const headers = entriesData[0];
      const monthCol = headers.indexOf('DrawMonth');
      const statusCol = headers.indexOf('Status');
      
      for (let i = 1; i < entriesData.length; i++) {
        if (entriesData[i][monthCol] === currentMonth && 
            entriesData[i][statusCol] === 'Active') {
          totalEntries++;
        }
      }
    }
    
    // Get prizes for this month
    const prizesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RafflePrizes');
    const prizes = [];
    
    if (prizesSheet) {
      const prizesData = prizesSheet.getDataRange().getValues();
      const headers = prizesData[0];
      const monthCol = headers.indexOf('DrawMonth');
      const statusCol = headers.indexOf('Status');
      const nameCol = headers.indexOf('PrizeName');
      const descCol = headers.indexOf('PrizeDescription');
      const valueCol = headers.indexOf('PrizeValue');
      const imageCol = headers.indexOf('PrizeImage');
      
      for (let i = 1; i < prizesData.length; i++) {
        if (prizesData[i][monthCol] === currentMonth && 
            prizesData[i][statusCol] === 'Available') {
          prizes.push({
            name: prizesData[i][nameCol],
            description: prizesData[i][descCol],
            value: prizesData[i][valueCol],
            image: prizesData[i][imageCol]
          });
        }
      }
    }
    
    // Get draw date (last day of month)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const drawDate = lastDay.toISOString().split('T')[0];
    
    return {
      month: currentMonth,
      totalEntries: totalEntries,
      prizes: prizes,
      drawDate: drawDate,
      prizeCount: prizes.length
    };
    
  } catch (error) {
    Logger.log('ERROR getting monthly draw info: ' + error.toString());
    return {
      month: '',
      totalEntries: 0,
      prizes: [],
      drawDate: '',
      prizeCount: 0
    };
  }
}


// ============================================
// 4. CONDUCT MONTHLY DRAW (ADMIN ONLY)
// ============================================

/**
 * Conduct the monthly raffle draw
 * Randomly selects winners for all available prizes
 * @param {string} drawMonth - Month to conduct draw for (YYYY-MM format)
 * @return {Object} Result with success status and winners array
 */
function conductMonthlyDraw(drawMonth) {
  try {
    // Get all active entries for the month
    const entriesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RaffleEntries');
    if (!entriesSheet) {
      return { success: false, error: 'RaffleEntries sheet not found' };
    }
    
    const entriesData = entriesSheet.getDataRange().getValues();
    const entriesHeaders = entriesData[0];
    
    // Find column indices
    const entryIdCol = entriesHeaders.indexOf('EntryId');
    const customerNameCol = entriesHeaders.indexOf('CustomerName');
    const customerPhoneCol = entriesHeaders.indexOf('CustomerPhone');
    const monthCol = entriesHeaders.indexOf('DrawMonth');
    const statusCol = entriesHeaders.indexOf('Status');
    const wonPrizeCol = entriesHeaders.indexOf('WonPrize');
    const drawDateCol = entriesHeaders.indexOf('DrawDate');
    
    // Collect eligible entries
    const eligibleEntries = [];
    for (let i = 1; i < entriesData.length; i++) {
      if (entriesData[i][monthCol] === drawMonth && 
          entriesData[i][statusCol] === 'Active') {
        eligibleEntries.push({
          row: i + 1, // 1-indexed for sheet
          entryId: entriesData[i][entryIdCol],
          customerName: entriesData[i][customerNameCol],
          customerPhone: entriesData[i][customerPhoneCol]
        });
      }
    }
    
    if (eligibleEntries.length === 0) {
      return { success: false, error: 'No eligible entries for this month' };
    }
    
    // Get available prizes
    const prizesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RafflePrizes');
    if (!prizesSheet) {
      return { success: false, error: 'RafflePrizes sheet not found' };
    }
    
    const prizesData = prizesSheet.getDataRange().getValues();
    const prizesHeaders = prizesData[0];
    
    // Find column indices
    const prizeIdCol = prizesHeaders.indexOf('PrizeId');
    const prizeNameCol = prizesHeaders.indexOf('PrizeName');
    const prizeMonthCol = prizesHeaders.indexOf('DrawMonth');
    const prizeStatusCol = prizesHeaders.indexOf('Status');
    const winnerIdCol = prizesHeaders.indexOf('WinnerId');
    const winnerNameCol = prizesHeaders.indexOf('WinnerName');
    const winnerPhoneCol = prizesHeaders.indexOf('WinnerPhone');
    const drawnDateCol = prizesHeaders.indexOf('DrawnDate');
    
    // Collect available prizes
    const availablePrizes = [];
    for (let i = 1; i < prizesData.length; i++) {
      if (prizesData[i][prizeMonthCol] === drawMonth && 
          prizesData[i][prizeStatusCol] === 'Available') {
        availablePrizes.push({
          row: i + 1, // 1-indexed for sheet
          prizeId: prizesData[i][prizeIdCol],
          prizeName: prizesData[i][prizeNameCol]
        });
      }
    }
    
    if (availablePrizes.length === 0) {
      return { success: false, error: 'No available prizes for this month' };
    }
    
    // Draw winners
    const winners = [];
    const now = new Date().toISOString();
    
    for (let prize of availablePrizes) {
      if (eligibleEntries.length === 0) {
        break; // No more entries to draw from
      }
      
      // Random selection
      const winnerIndex = Math.floor(Math.random() * eligibleEntries.length);
      const winner = eligibleEntries[winnerIndex];
      
      // Update entry in RaffleEntries sheet
      entriesSheet.getRange(winner.row, wonPrizeCol + 1).setValue(prize.prizeName);
      entriesSheet.getRange(winner.row, drawDateCol + 1).setValue(now);
      entriesSheet.getRange(winner.row, statusCol + 1).setValue('Used');
      
      // Update prize in RafflePrizes sheet
      prizesSheet.getRange(prize.row, prizeStatusCol + 1).setValue('Drawn');
      prizesSheet.getRange(prize.row, winnerIdCol + 1).setValue(winner.entryId);
      prizesSheet.getRange(prize.row, winnerNameCol + 1).setValue(winner.customerName);
      prizesSheet.getRange(prize.row, winnerPhoneCol + 1).setValue(winner.customerPhone);
      prizesSheet.getRange(prize.row, drawnDateCol + 1).setValue(now);
      
      winners.push({
        prize: prize.prizeName,
        winner: winner.customerName,
        phone: winner.customerPhone,
        entryId: winner.entryId
      });
      
      // Remove winner from eligible entries
      eligibleEntries.splice(winnerIndex, 1);
    }
    
    // Record draw in RaffleDraws sheet
    const drawsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RaffleDraws');
    if (drawsSheet) {
      const drawId = `DRAW-${drawMonth}`;
      const totalEntriesCount = eligibleEntries.length + winners.length;
      
      drawsSheet.appendRow([
        drawId,
        drawMonth,
        now,
        totalEntriesCount,
        winners.length,
        JSON.stringify(winners),
        'Completed',
        `Draw conducted on ${new Date().toLocaleDateString()}`
      ]);
    }
    
    return { 
      success: true, 
      winners: winners,
      totalEntries: eligibleEntries.length + winners.length,
      prizesDrawn: winners.length
    };
    
  } catch (error) {
    Logger.log('ERROR conducting monthly draw: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}


// ============================================
// 5. INTEGRATION WITH EXISTING createOrder
// ============================================

/**
 * MODIFY YOUR EXISTING createOrder FUNCTION
 * Add this code at the end, before returning success
 */

/*
function createOrder(data) {
  // ... your existing order creation code ...
  
  // ADD THIS SECTION:
  // Create raffle entry for online payments
  try {
    if (data.paymentMethod && data.paymentMethod.toLowerCase() !== 'cod') {
      const raffleEntryId = createRaffleEntry(orderId, data);
      if (raffleEntryId) {
        Logger.log('Raffle entry created: ' + raffleEntryId);
        // Optionally return raffle entry ID in response
        return { 
          success: true, 
          orderId: orderId,
          raffleEntry: raffleEntryId,
          message: 'Order placed! You received 1 raffle entry 🎁'
        };
      }
    }
  } catch (error) {
    Logger.log('Raffle entry creation failed: ' + error.toString());
    // Don't fail the order if raffle entry fails
  }
  
  return { success: true, orderId: orderId };
}
*/


// ============================================
// 6. WEB APP doGet/doPost HANDLERS
// ============================================

/**
 * ADD THESE CASES TO YOUR EXISTING doGet FUNCTION
 */

/*
function doGet(e) {
  const action = e.parameter.action;
  
  // ... your existing actions ...
  
  // ADD THESE NEW ACTIONS:
  
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
  
  // ... rest of your code ...
}
*/


// ============================================
// 7. UTILITY FUNCTIONS
// ============================================

/**
 * Get raffle statistics for admin dashboard
 */
function getRaffleStats() {
  try {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const entriesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RaffleEntries');
    const prizesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RafflePrizes');
    
    let totalEntries = 0;
    let activeEntries = 0;
    let winnersCount = 0;
    
    if (entriesSheet) {
      const data = entriesSheet.getDataRange().getValues();
      const headers = data[0];
      const monthCol = headers.indexOf('DrawMonth');
      const statusCol = headers.indexOf('Status');
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][monthCol] === currentMonth) {
          totalEntries++;
          if (data[i][statusCol] === 'Active') {
            activeEntries++;
          } else if (data[i][statusCol] === 'Used') {
            winnersCount++;
          }
        }
      }
    }
    
    let availablePrizes = 0;
    let drawnPrizes = 0;
    
    if (prizesSheet) {
      const data = prizesSheet.getDataRange().getValues();
      const headers = data[0];
      const monthCol = headers.indexOf('DrawMonth');
      const statusCol = headers.indexOf('Status');
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][monthCol] === currentMonth) {
          if (data[i][statusCol] === 'Available') {
            availablePrizes++;
          } else if (data[i][statusCol] === 'Drawn') {
            drawnPrizes++;
          }
        }
      }
    }
    
    return {
      month: currentMonth,
      totalEntries: totalEntries,
      activeEntries: activeEntries,
      winnersCount: winnersCount,
      availablePrizes: availablePrizes,
      drawnPrizes: drawnPrizes
    };
    
  } catch (error) {
    Logger.log('ERROR getting raffle stats: ' + error.toString());
    return null;
  }
}


/**
 * Test function to verify raffle system is working
 */
function testRaffleSystem() {
  Logger.log('=== Testing Raffle System ===');
  
  // Test 1: Create test entry
  Logger.log('\n1. Testing createRaffleEntry...');
  const testOrder = {
    customerName: 'Test Customer',
    customerPhone: '09999999999',
    customerEmail: 'test@test.com',
    paymentMethod: 'GCash',
    total: 1000
  };
  const entryId = createRaffleEntry('TEST-ORDER-001', testOrder);
  Logger.log('Created entry: ' + entryId);
  
  // Test 2: Get customer entries
  Logger.log('\n2. Testing getCustomerRaffleEntries...');
  const entries = getCustomerRaffleEntries('09999999999');
  Logger.log('Found ' + entries.length + ' entries');
  
  // Test 3: Get monthly draw info
  Logger.log('\n3. Testing getMonthlyDrawInfo...');
  const drawInfo = getMonthlyDrawInfo();
  Logger.log('Total entries: ' + drawInfo.totalEntries);
  Logger.log('Prizes: ' + drawInfo.prizeCount);
  
  // Test 4: Get stats
  Logger.log('\n4. Testing getRaffleStats...');
  const stats = getRaffleStats();
  Logger.log('Stats: ' + JSON.stringify(stats));
  
  Logger.log('\n=== Test Complete ===');
}
