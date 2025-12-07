// ============================================================
// AMADEO MARKETPLACE v3.1 - COMPLETE BACKEND
// TASK 1: Database Schema + All API Functions
// ============================================================

const CONFIG = {
  SPREADSHEET_ID: '1GXl6tPmofpgdnpEIuts8gSLYAw9roTQegKrgSjYaErA',
  MERCHANTS_FOLDER: '174aqufKO2WY5PMS4DgI0sk4tywCn7pQ8',
  PAYMENTS_FOLDER: '1_wGFHri8lcvhiD31Y1TGnDKe1b7DEqHV',
  PRODUCTS_FOLDER: '1YgKpxGg27aEsb1v6Xf2oow-LNbNyYN8s'
};

// ============================================================
// TASK 1: SCHEMA SETUP - Run this ONCE
// ============================================================

function setupCompleteSchema() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const log = [];
  
  // ========== MERCHANTS SHEET ==========
  const merchantsSheet = ss.getSheetByName('Merchants');
  if (merchantsSheet) {
    let headers = merchantsSheet.getRange(1, 1, 1, merchantsSheet.getLastColumn()).getValues()[0];
    
    // Columns to ADD
    const merchantColumns = [
      { name: 'OffersPickup', defaultValue: 'Yes' },
      { name: 'OffersCourier', defaultValue: 'Yes' },
      { name: 'IsOpen', defaultValue: 'TRUE' },
      { name: 'PickupInstructions', defaultValue: '' }
    ];
    
    merchantColumns.forEach(col => {
      if (!headers.includes(col.name)) {
        const newCol = merchantsSheet.getLastColumn() + 1;
        merchantsSheet.getRange(1, newCol).setValue(col.name);
        if (merchantsSheet.getLastRow() > 1 && col.defaultValue) {
          merchantsSheet.getRange(2, newCol, merchantsSheet.getLastRow() - 1, 1).setValue(col.defaultValue);
        }
        log.push(`✅ Added "${col.name}" to Merchants`);
        headers.push(col.name);
      }
    });
    
    // Columns to REMOVE
    const removeColumns = ['DeliveryFee', 'DeliveryPrice', 'DeliveryRate', 'DistanceMatrix', 'DeliveryZones'];
    headers = merchantsSheet.getRange(1, 1, 1, merchantsSheet.getLastColumn()).getValues()[0];
    for (let i = headers.length - 1; i >= 0; i--) {
      if (removeColumns.includes(headers[i])) {
        merchantsSheet.deleteColumn(i + 1);
        log.push(`🗑️ Removed "${headers[i]}" from Merchants`);
      }
    }
  }
  
  // ========== ORDERS SHEET ==========
  const ordersSheet = ss.getSheetByName('Orders');
  if (ordersSheet) {
    let headers = ordersSheet.getRange(1, 1, 1, ordersSheet.getLastColumn()).getValues()[0];
    
    const orderColumns = [
      { name: 'FulfillmentType', defaultValue: 'pickup' },
      { name: 'ScheduledTime', defaultValue: '' },
      { name: 'CourierStatus', defaultValue: '' }
    ];
    
    orderColumns.forEach(col => {
      if (!headers.includes(col.name)) {
        const newCol = ordersSheet.getLastColumn() + 1;
        ordersSheet.getRange(1, newCol).setValue(col.name);
        log.push(`✅ Added "${col.name}" to Orders`);
        headers.push(col.name);
      }
    });
  }
  
  // ========== PRODUCTS SHEET ==========
  const productsSheet = ss.getSheetByName('Products');
  if (productsSheet) {
    let headers = productsSheet.getRange(1, 1, 1, productsSheet.getLastColumn()).getValues()[0];
    
    const productColumns = [
      { name: 'SalePrice', defaultValue: '' },
      { name: 'SaleEndsAt', defaultValue: '' }
    ];
    
    productColumns.forEach(col => {
      if (!headers.includes(col.name)) {
        const newCol = productsSheet.getLastColumn() + 1;
        productsSheet.getRange(1, newCol).setValue(col.name);
        log.push(`✅ Added "${col.name}" to Products`);
        headers.push(col.name);
      }
    });
  }
  
  Logger.log(log.join('\n'));
  return { success: true, message: 'Schema updated successfully', changes: log };
}


// ============================================================
// MERCHANT LOGIN
// ============================================================

function merchantLogin(email, password) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Merchants');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const merchant = {};
      headers.forEach((h, idx) => merchant[h] = row[idx]);
      
      if (merchant.Email === email && merchant.Password === password) {
        // Don't send password back
        delete merchant.Password;
        
        return {
          success: true,
          merchant: merchant,
          message: 'Login successful'
        };
      }
    }
    
    return { success: false, error: 'Invalid email or password' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


// ============================================================
// UPDATE STORE STATUS (IsOpen)
// ============================================================

function updateStoreStatus(merchantId, isOpen) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Merchants');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const idCol = headers.indexOf('MerchantId');
    const isOpenCol = headers.indexOf('IsOpen');
    
    if (isOpenCol === -1) {
      return { success: false, error: 'IsOpen column not found. Run setupCompleteSchema() first.' };
    }
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idCol] === merchantId) {
        sheet.getRange(i + 1, isOpenCol + 1).setValue(isOpen ? 'TRUE' : 'FALSE');
        clearCache();
        return { 
          success: true, 
          isOpen: isOpen,
          message: isOpen ? 'Store is now OPEN' : 'Store is now CLOSED'
        };
      }
    }
    
    return { success: false, error: 'Merchant not found' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


// ============================================================
// UPDATE MERCHANT FULFILLMENT SETTINGS
// ============================================================

function updateMerchantSettings(merchantId, settings) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Merchants');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const idCol = headers.indexOf('MerchantId');
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idCol] === merchantId) {
        // Update each setting if provided
        Object.keys(settings).forEach(key => {
          const col = headers.indexOf(key);
          if (col !== -1) {
            sheet.getRange(i + 1, col + 1).setValue(settings[key]);
          }
        });
        
        clearCache();
        return { success: true, message: 'Settings updated' };
      }
    }
    
    return { success: false, error: 'Merchant not found' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


// ============================================================
// GET MERCHANT ORDERS
// ============================================================

function getMerchantOrders(merchantId) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Orders');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const orders = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const order = {};
      headers.forEach((h, idx) => order[h] = row[idx]);
      
      if (order.MerchantId === merchantId) {
        // Parse items if JSON string
        if (typeof order.Items === 'string') {
          try { order.Items = JSON.parse(order.Items); } catch (e) { order.Items = []; }
        }
        orders.push(order);
      }
    }
    
    // Sort by date descending
    orders.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
    
    return { success: true, orders: orders, count: orders.length };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


// ============================================================
// CREATE ORDER (Buyer-Booked Courier)
// ============================================================

function createOrder(data) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const ordersSheet = ss.getSheetByName('Orders');
    
    // Generate Order ID
    const now = new Date();
    const dateStr = Utilities.formatDate(now, 'Asia/Manila', 'yyyyMMdd');
    const uniqueId = now.getTime().toString().slice(-4);
    const orderId = data.orderId || `AMV-${dateStr}-${uniqueId}`;
    
    // Get merchant details for confirmation
    const merchant = getMerchantById(data.merchantId);
    
    // Upload payment screenshot if provided
    let screenshotUrl = '';
    if (data.paymentScreenshot && data.paymentScreenshot.startsWith('data:')) {
      screenshotUrl = uploadToFolder(data.paymentScreenshot, `payment-${orderId}.jpg`, CONFIG.PAYMENTS_FOLDER);
    }
    
    // BUYER-BOOKED COURIER: Delivery Fee is ALWAYS ₱0
    const deliveryFee = 0;
    const subtotal = parseFloat(data.subtotal) || 0;
    const platformFee = parseFloat(data.platformFee) || 0;
    const total = subtotal + platformFee;
    
    // Get headers
    const headers = ordersSheet.getRange(1, 1, 1, ordersSheet.getLastColumn()).getValues()[0];
    
    // Build row data
    const rowData = headers.map(header => {
      switch(header) {
        case 'OrderId': return orderId;
        case 'MerchantId': return data.merchantId || '';
        case 'CustomerName': return data.customerName || '';
        case 'CustomerPhone': return data.customerPhone || '';
        case 'CustomerEmail': return data.customerEmail || '';
        case 'Barangay': return data.barangay || '';
        case 'DeliveryAddress': return data.deliveryAddress || '';
        case 'Items': return JSON.stringify(data.items || []);
        case 'Subtotal': return subtotal;
        case 'DeliveryFee': return 0;
        case 'PlatformFee': return platformFee;
        case 'Total': return total;
        case 'PaymentMethod': return data.paymentMethod || 'cod';
        case 'PaymentScreenshot': return screenshotUrl;
        case 'Status': return 'pending';
        case 'FulfillmentType': return data.fulfillmentType || 'pickup';
        case 'ScheduledTime': return data.scheduledTime || '';
        case 'CourierStatus': return data.fulfillmentType === 'courier' ? 'pending' : '';
        case 'CreatedAt': return now;
        case 'UpdatedAt': return now;
        default: return '';
      }
    });
    
    ordersSheet.appendRow(rowData);
    clearCache();
    
    return {
      success: true,
      orderId: orderId,
      total: total,
      fulfillmentType: data.fulfillmentType || 'pickup',
      scheduledTime: data.scheduledTime || '',
      merchant: merchant ? {
        name: merchant.BusinessName,
        address: merchant.Address || '',
        barangay: merchant.Barangay || '',
        phone: merchant.Phone || '',
        pickupInstructions: merchant.PickupInstructions || '',
        fullAddress: `${merchant.Address || ''}, ${merchant.Barangay || ''}, Amadeo, Cavite`
      } : null
    };
    
  } catch (error) {
    Logger.log('createOrder error: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}


// ============================================================
// ADD/UPDATE PRODUCT (with Flash Sale support)
// ============================================================

function addProduct(data) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Products');
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Generate Product ID
    const productId = data.productId || `PRD-${Date.now()}`;
    
    // Upload product image if provided
    let imageUrl = data.Image || '';
    if (data.imageData && data.imageData.startsWith('data:')) {
      imageUrl = uploadToFolder(data.imageData, `product-${productId}.jpg`, CONFIG.PRODUCTS_FOLDER);
    }
    
    // Build row data
    const rowData = headers.map(header => {
      switch(header) {
        case 'ProductId': return productId;
        case 'MerchantId': return data.merchantId || '';
        case 'Name': return data.name || '';
        case 'Description': return data.description || '';
        case 'Category': return data.category || '';
        case 'Price': return parseFloat(data.price) || 0;
        case 'SalePrice': return data.salePrice ? parseFloat(data.salePrice) : '';
        case 'SaleEndsAt': return data.saleEndsAt || '';
        case 'Image': return imageUrl;
        case 'Status': return 'active';
        case 'CreatedAt': return new Date();
        default: return '';
      }
    });
    
    sheet.appendRow(rowData);
    clearCache();
    
    return { success: true, productId: productId, message: 'Product added successfully' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


function updateProduct(productId, data) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Products');
    const sheetData = sheet.getDataRange().getValues();
    const headers = sheetData[0];
    
    const idCol = headers.indexOf('ProductId');
    
    for (let i = 1; i < sheetData.length; i++) {
      if (sheetData[i][idCol] === productId) {
        // Update each field if provided
        Object.keys(data).forEach(key => {
          const col = headers.indexOf(key);
          if (col !== -1 && data[key] !== undefined) {
            sheet.getRange(i + 1, col + 1).setValue(data[key]);
          }
        });
        
        clearCache();
        return { success: true, message: 'Product updated' };
      }
    }
    
    return { success: false, error: 'Product not found' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


// ============================================================
// GET ALL INVENTORY (with Flash Sale info)
// ============================================================

function getAllInventory() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get('allInventory');
    if (cached) {
      const result = JSON.parse(cached);
      result.fromCache = true;
      return result;
    }
    
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    
    // Load merchants
    const merchantsSheet = ss.getSheetByName('Merchants');
    const merchantsData = merchantsSheet.getDataRange().getValues();
    const merchantHeaders = merchantsData[0];
    const merchants = {};
    
    for (let i = 1; i < merchantsData.length; i++) {
      const row = merchantsData[i];
      const m = {};
      merchantHeaders.forEach((h, idx) => m[h] = row[idx]);
      if (m.Status === 'approved') {
        merchants[m.MerchantId] = m;
      }
    }
    
    // Load products
    const productsSheet = ss.getSheetByName('Products');
    const productsData = productsSheet.getDataRange().getValues();
    const productHeaders = productsData[0];
    
    // Build products array
    const products = [];
    const now = new Date();
    
    for (let i = 1; i < productsData.length; i++) {
      const row = productsData[i];
      const p = {};
      productHeaders.forEach((h, idx) => p[h] = row[idx]);
      
      const merchant = merchants[p.MerchantId];
      if (merchant && p.Status === 'active') {
        // Check if sale is active
        let isOnSale = false;
        let salePrice = null;
        let saleEndsAt = null;
        
        if (p.SalePrice && p.SalePrice > 0) {
          if (p.SaleEndsAt) {
            const saleEnd = new Date(p.SaleEndsAt);
            if (saleEnd > now) {
              isOnSale = true;
              salePrice = p.SalePrice;
              saleEndsAt = p.SaleEndsAt;
            }
          } else {
            // No end date = always on sale
            isOnSale = true;
            salePrice = p.SalePrice;
          }
        }
        
        products.push({
          ...p,
          // Sale info
          isOnSale: isOnSale,
          salePrice: salePrice,
          saleEndsAt: saleEndsAt,
          displayPrice: isOnSale ? salePrice : p.Price,
          // Merchant info
          merchantName: merchant.BusinessName,
          merchantPhone: merchant.Phone || '',
          merchantAddress: merchant.Address || '',
          merchantBarangay: merchant.Barangay || '',
          merchantFullAddress: `${merchant.Address || ''}, ${merchant.Barangay || ''}, Amadeo, Cavite`,
          pickupInstructions: merchant.PickupInstructions || '',
          // Store status
          isStoreOpen: String(merchant.IsOpen).toUpperCase() === 'TRUE',
          // Fulfillment flags
          offersPickup: String(merchant.OffersPickup || 'Yes').toLowerCase() === 'yes',
          offersCourier: String(merchant.OffersCourier || 'Yes').toLowerCase() === 'yes'
        });
      }
    }
    
    const result = { success: true, data: products, count: products.length, fromCache: false };
    cache.put('allInventory', JSON.stringify(result), 300);
    return result;
    
  } catch (error) {
    Logger.log('getAllInventory error: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}


// ============================================================
// UPDATE ORDER STATUS
// ============================================================

function updateOrderStatus(orderId, status, courierStatus) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Orders');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const orderIdCol = headers.indexOf('OrderId');
    const statusCol = headers.indexOf('Status');
    const courierStatusCol = headers.indexOf('CourierStatus');
    const updatedAtCol = headers.indexOf('UpdatedAt');
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][orderIdCol] === orderId) {
        if (status && statusCol !== -1) {
          sheet.getRange(i + 1, statusCol + 1).setValue(status);
        }
        if (courierStatus && courierStatusCol !== -1) {
          sheet.getRange(i + 1, courierStatusCol + 1).setValue(courierStatus);
        }
        if (updatedAtCol !== -1) {
          sheet.getRange(i + 1, updatedAtCol + 1).setValue(new Date());
        }
        
        clearCache();
        return { success: true, message: 'Order updated' };
      }
    }
    
    return { success: false, error: 'Order not found' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getMerchantById(merchantId) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Merchants');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const merchant = {};
    headers.forEach((h, idx) => merchant[h] = row[idx]);
    if (merchant.MerchantId === merchantId) {
      return merchant;
    }
  }
  return null;
}

function uploadToFolder(base64Data, filename, folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    const base64 = base64Data.split(',')[1];
    const blob = Utilities.newBlob(Utilities.base64Decode(base64), 'image/jpeg', filename);
    const file = folder.createFile(blob);
    return `https://lh3.googleusercontent.com/d/${file.getId()}`;
  } catch (e) {
    Logger.log('Upload error: ' + e);
    return '';
  }
}

function clearCache() {
  CacheService.getScriptCache().removeAll(['allInventory', 'merchants']);
  return { success: true };
}


// ============================================================
// WEB APP ENDPOINTS
// ============================================================

function doGet(e) {
  const action = e.parameter.action;
  let result;
  
  switch(action) {
    case 'getAllInventory': result = getAllInventory(); break;
    case 'getMerchantOrders': result = getMerchantOrders(e.parameter.merchantId); break;
    case 'trackOrder': result = trackOrder(e.parameter.orderId, e.parameter.phone); break;
    case 'clearCache': result = clearCache(); break;
    case 'setupSchema': result = setupCompleteSchema(); break;
    default: result = { error: 'Unknown action' };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    let result;
    
    switch(data.action) {
      case 'merchantLogin': result = merchantLogin(data.email, data.password); break;
      case 'updateStoreStatus': result = updateStoreStatus(data.merchantId, data.isOpen); break;
      case 'updateMerchantSettings': result = updateMerchantSettings(data.merchantId, data.settings); break;
      case 'createOrder': result = createOrder(data); break;
      case 'updateOrderStatus': result = updateOrderStatus(data.orderId, data.status, data.courierStatus); break;
      case 'addProduct': result = addProduct(data); break;
      case 'updateProduct': result = updateProduct(data.productId, data); break;
      case 'registerMerchant': result = registerMerchant(data); break;
      case 'customerLogin': result = customerLogin(data.email, data.password); break;
      case 'customerSignup': result = customerSignup(data); break;
      default: result = { error: 'Unknown action' };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// ============================================================
// DEPLOYMENT INSTRUCTIONS:
// 1. Copy this entire code to your Apps Script project
// 2. Run setupCompleteSchema() ONCE to add all new columns
// 3. Deploy > New deployment > Web app
// 4. Execute as: Me, Access: Anyone
// 5. Copy the new API URL
// ============================================================
