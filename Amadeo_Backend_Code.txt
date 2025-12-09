// ============================================================
// AMADEO MARKETPLACE v3.2 - COMPLETE BACKEND
// UPDATED: Fixed image upload + Product Variants support
// ============================================================

const CONFIG = {
  SPREADSHEET_ID: '1GXl6tPmofpgdnpEIuts8gSLYAw9roTQegKrgSjYaErA',
  MERCHANTS_FOLDER: '174aqufKO2WY5PMS4DgI0sk4tywCn7pQ8',
  PAYMENTS_FOLDER: '1_wGFHri8lcvhiD31Y1TGnDKe1b7DEqHV',
  PRODUCTS_FOLDER: '1YgKpxGg27aEsb1v6Xf2oow-LNbNyYN8s'
};

// ============================================================
// SCHEMA SETUP - Run this ONCE after deployment
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
  
  // ========== PRODUCTS SHEET (WITH VARIANTS SUPPORT) ==========
  const productsSheet = ss.getSheetByName('Products');
  if (productsSheet) {
    let headers = productsSheet.getRange(1, 1, 1, productsSheet.getLastColumn()).getValues()[0];
    
    const productColumns = [
      { name: 'SalePrice', defaultValue: '' },
      { name: 'SaleEndsAt', defaultValue: '' },
      { name: 'HasVariants', defaultValue: 'FALSE' },
      { name: 'Variants', defaultValue: '' },
      { name: 'StockLevel', defaultValue: '0' }
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
          data: merchant,
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
// CUSTOMER LOGIN & SIGNUP
// ============================================================

function customerLogin(email, password) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Customers');
    
    if (!sheet) {
      return { success: false, error: 'Customers sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const customer = {};
      headers.forEach((h, idx) => customer[h] = row[idx]);
      
      if (customer.Email === email && customer.Password === password) {
        delete customer.Password;
        return {
          success: true,
          data: customer,
          message: 'Login successful'
        };
      }
    }
    
    return { success: false, error: 'Invalid email or password' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function customerSignup(data) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = ss.getSheetByName('Customers');
    
    // Create Customers sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet('Customers');
      sheet.appendRow(['CustomerId', 'Name', 'Email', 'Password', 'Phone', 'Barangay', 'Address', 'CreatedAt']);
    }
    
    const existingData = sheet.getDataRange().getValues();
    const headers = existingData[0];
    
    // Check if email already exists
    for (let i = 1; i < existingData.length; i++) {
      const emailCol = headers.indexOf('Email');
      if (existingData[i][emailCol] === data.email) {
        return { success: false, error: 'Email already registered' };
      }
    }
    
    const customerId = `CUST-${Date.now()}`;
    const now = new Date();
    
    const rowData = headers.map(header => {
      switch(header) {
        case 'CustomerId': return customerId;
        case 'Name': return data.name || '';
        case 'Email': return data.email || '';
        case 'Password': return data.password || '';
        case 'Phone': return data.phone || '';
        case 'Barangay': return data.barangay || '';
        case 'Address': return data.address || '';
        case 'CreatedAt': return now;
        default: return '';
      }
    });
    
    sheet.appendRow(rowData);
    
    return {
      success: true,
      customerId: customerId,
      message: 'Account created successfully'
    };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


// ============================================================
// MERCHANT REGISTRATION
// ============================================================

function registerMerchant(data) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Merchants');
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    const merchantId = `MER-${Date.now()}`;
    const now = new Date();
    
    // DEBUG: Log headers and incoming data
    Logger.log('=== REGISTER MERCHANT DEBUG ===');
    Logger.log('Headers: ' + JSON.stringify(headers));
    Logger.log('Incoming data: ' + JSON.stringify(data));
    
    const rowData = headers.map(header => {
      switch(header) {
        case 'MerchantId': return merchantId;
        case 'BusinessName': return data.businessName || '';
        case 'OwnerName': return data.ownerName || '';
        case 'Email': return data.email || '';
        case 'Password': return data.password || '';
        case 'Phone': return data.phone || '';
        case 'Category': return data.category || data.businessType || '';
        case 'Address': return data.address || '';
        case 'Barangay': return data.barangay || '';
        case 'Description': return data.description || '';
        case 'Services': return data.services || '';
        case 'OperatingHours': return data.operatingHours || '';
        case 'BusinessType': return data.businessType || data.category || '';
        case 'Status': return 'pending';
        case 'OffersPickup': return 'Yes';
        case 'OffersCourier': return 'Yes';
        case 'IsOpen': return 'TRUE';
        case 'CreatedAt': return now;
        case 'UpdatedAt': return now;
        default: return '';
      }
    });
    
    // DEBUG: Log the row data being appended
    Logger.log('Row data to append: ' + JSON.stringify(rowData));
    Logger.log('Row length: ' + rowData.length + ', Headers length: ' + headers.length);
    
    sheet.appendRow(rowData);
    
    return {
      success: true,
      merchantId: merchantId,
      message: 'Application submitted. Wait for admin approval.'
    };
    
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
// GET CUSTOMER ORDERS (SECURITY: Filter by phone)
// ============================================================

function getCustomerOrders(phone) {
  try {
    if (!phone) {
      return { success: false, error: 'Phone number required' };
    }
    
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Orders');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const phoneCol = headers.indexOf('CustomerPhone');
    const orders = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[phoneCol] === phone) {
        const order = {};
        headers.forEach((h, idx) => order[h] = row[idx]);
        
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
// TRACK ORDER (Public)
// ============================================================

function trackOrder(orderId, phone) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Orders');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const order = {};
      headers.forEach((h, idx) => order[h] = row[idx]);
      
      if (order.OrderId === orderId && order.CustomerPhone === phone) {
        // Parse items if JSON string
        if (typeof order.Items === 'string') {
          try { order.Items = JSON.parse(order.Items); } catch (e) { order.Items = []; }
        }
        return { success: true, order: order };
      }
    }
    
    return { success: false, error: 'Order not found or phone mismatch' };
    
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
      screenshotUrl = uploadImage({
        base64Data: data.paymentScreenshot.split(',')[1],
        fileName: `payment-${orderId}.jpg`,
        mimeType: 'image/jpeg'
      }).imageUrl || '';
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
        case 'Status': return 'pending';
        case 'PaymentMethod': return data.paymentMethod || 'gcash';
        case 'PaymentScreenshot': return screenshotUrl;
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
// ADD/UPDATE PRODUCT (with Variants & Flash Sale support)
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
      const uploadResult = uploadImage({
        base64Data: data.imageData.split(',')[1],
        fileName: `product-${productId}.jpg`,
        mimeType: 'image/jpeg',
        merchantId: data.merchantId
      });
      
      if (uploadResult.success) {
        imageUrl = uploadResult.imageUrl;
      }
    }
    
    // Handle variants
    const hasVariants = data.hasVariants || false;
    const variants = hasVariants && data.variants ? JSON.stringify(data.variants) : '';
    
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
        case 'HasVariants': return hasVariants ? 'TRUE' : 'FALSE';
        case 'Variants': return variants;
        case 'StockLevel': return parseInt(data.stockLevel) || 0;
        case 'Image': return imageUrl;
        case 'Status': return 'active';
        case 'CreatedAt': return new Date();
        default: return '';
      }
    });
    
    sheet.appendRow(rowData);
    clearCache();
    
    return { 
      success: true, 
      productId: productId, 
      imageUrl: imageUrl,
      message: 'Product added successfully' 
    };
    
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
        // Handle image upload if new image provided
        if (data.imageData && data.imageData.startsWith('data:')) {
          const uploadResult = uploadImage({
            base64Data: data.imageData.split(',')[1],
            fileName: `product-${productId}-updated.jpg`,
            mimeType: 'image/jpeg'
          });
          
          if (uploadResult.success) {
            data.Image = uploadResult.imageUrl;
          }
          delete data.imageData;
        }
        
        // Handle variants
        if (data.variants) {
          data.Variants = JSON.stringify(data.variants);
          delete data.variants;
        }
        if (data.hasVariants !== undefined) {
          data.HasVariants = data.hasVariants ? 'TRUE' : 'FALSE';
          delete data.hasVariants;
        }
        
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


function deleteProduct(productId) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Products');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const idCol = headers.indexOf('ProductId');
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idCol] === productId) {
        sheet.deleteRow(i + 1);
        clearCache();
        return { success: true, message: 'Product deleted' };
      }
    }
    
    return { success: false, error: 'Product not found' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


// ============================================================
// GET ALL INVENTORY (with Variants & Flash Sale info)
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
        
        // Parse variants if present
        let variants = [];
        const hasVariants = String(p.HasVariants).toUpperCase() === 'TRUE';
        if (hasVariants && p.Variants) {
          try {
            variants = JSON.parse(p.Variants);
          } catch (e) {
            variants = [];
          }
        }
        
        products.push({
          ...p,
          // Sale info
          isOnSale: isOnSale,
          salePrice: salePrice,
          saleEndsAt: saleEndsAt,
          displayPrice: isOnSale ? salePrice : p.Price,
          // Variants info
          hasVariants: hasVariants,
          variants: variants,
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
// IMAGE UPLOAD - FIXED VERSION (No getFolderById)
// ============================================================

function uploadImage(data) {
  try {
    var merchantId = data.merchantId || 'unknown';
    var fileName = data.fileName || 'product_' + Date.now() + '.jpg';
    var base64Data = data.base64Data;
    var mimeType = data.mimeType || 'image/jpeg';
    
    if (!base64Data) {
      return { success: false, error: 'No image data provided' };
    }
    
    // Decode base64 and create file directly (no folder access needed)
    var decodedData = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decodedData, mimeType, fileName);
    var file = DriveApp.createFile(blob);
    
    // Set sharing to public
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    var fileId = file.getId();
    var imageUrl = 'https://lh3.googleusercontent.com/d/' + fileId;
    
    return {
      success: true,
      imageUrl: imageUrl,
      fileId: fileId,
      fileName: fileName
    };
  } catch (e) {
    Logger.log('uploadImage error: ' + e.toString());
    return { success: false, error: e.toString() };
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
    case 'getCustomerOrders': result = getCustomerOrders(e.parameter.phone); break;
    case 'trackOrder': result = trackOrder(e.parameter.orderId, e.parameter.phone); break;
    case 'merchantLogin': result = merchantLogin(e.parameter.email, e.parameter.password); break;
    case 'customerLogin': result = customerLogin(e.parameter.phone, e.parameter.password); break;
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
      case 'deleteProduct': result = deleteProduct(data.productId); break;
      case 'uploadImage': result = uploadImage(data); break;
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
// 5. Copy the new API URL and update frontend
// ============================================================


// ============================================================
// FORCE AUTHORIZATION - Run this function to authorize the script
// ============================================================

function forceAuthorization() {
  try {
    // This function accesses all the services the script needs
    // Running it will trigger the authorization dialog
    
    // Access Spreadsheet
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Merchants');
    const data = sheet.getDataRange().getValues();
    
    // Access Drive (for image uploads)
    const files = DriveApp.getFiles();
    
    // Log success
    Logger.log('Authorization successful!');
    Logger.log('Spreadsheet ID: ' + CONFIG.SPREADSHEET_ID);
    Logger.log('Sheet name: ' + sheet.getName());
    Logger.log('Rows: ' + data.length);
    
    return {
      success: true,
      message: 'Authorization completed successfully!',
      spreadsheetId: CONFIG.SPREADSHEET_ID,
      rowCount: data.length
    };
    
  } catch (error) {
    Logger.log('Authorization failed: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}


// DEBUG FUNCTION - Run this to see merchant data
function debugMerchantData() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Merchants');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  Logger.log('=== HEADERS ===');
  Logger.log(headers);
  
  Logger.log('\n=== FIRST MERCHANT ROW ===');
  if (data.length > 1) {
    const row = data[1];
    const merchant = {};
    headers.forEach((h, idx) => {
      merchant[h] = row[idx];
      Logger.log(`${h}: "${row[idx]}" (type: ${typeof row[idx]})`);
    });
    
    Logger.log('\n=== LOGIN TEST ===');
    Logger.log(`Email match: ${merchant.Email === 'musthavecor@gmail.com'}`);
    Logger.log(`Password match: ${merchant.Password === 'amadeo123'}`);
    Logger.log(`Status: "${merchant.Status}"`);
  }
  
  return 'Check execution log for results';
}


// FIX SHIFTED DATA - Run this ONCE to correct misaligned columns
function fixShiftedData() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Merchants');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  Logger.log('=== FIXING SHIFTED DATA ===');
  
  // Expected column order based on headers
  const expectedOrder = [
    'MerchantId', 'BusinessName', 'OwnerName', 'Email', 'Phone', 'Category',
    'Address', 'Barangay', 'Description', 'Services', 'OperatingHours',
    'Status', 'Password', 'CreatedAt', 'UpdatedAt', 'LogoUrl', 'TotalOrders',
    'TotalSales', 'Rating', 'ReviewCount', 'DocumentUrls', 'DocumentFolderUrl',
    'OffersPickup', 'OffersDelivery', 'IsOpen', 'PickupInstructions', 'OffersCourier'
  ];
  
  // Create column index map
  const colMap = {};
  headers.forEach((h, idx) => {
    colMap[h] = idx;
  });
  
  Logger.log('Current headers: ' + headers.join(', '));
  
  // Process each merchant row
  let fixedCount = 0;
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    // Check if Email column contains an actual email
    const emailCol = colMap['Email'];
    const emailValue = row[emailCol];
    
    // If Email column doesn't contain @, data is shifted
    if (emailValue && !String(emailValue).includes('@')) {
      Logger.log(`Row ${i + 1}: Data is shifted. Fixing...`);
      
      // Find where the actual email is
      let actualEmailIdx = -1;
      for (let j = 0; j < row.length; j++) {
        if (row[j] && String(row[j]).includes('@')) {
          actualEmailIdx = j;
          break;
        }
      }
      
      if (actualEmailIdx !== -1) {
        // Calculate shift amount
        const shift = actualEmailIdx - emailCol;
        Logger.log(`  Shift detected: ${shift} columns to the right`);
        
        // Create corrected row
        const correctedRow = new Array(headers.length).fill('');
        
        // Map data to correct positions
        for (let j = 0; j < row.length; j++) {
          const newIdx = j - shift;
          if (newIdx >= 0 && newIdx < correctedRow.length) {
            correctedRow[newIdx] = row[j];
          }
        }
        
        // Write corrected row back
        sheet.getRange(i + 1, 1, 1, correctedRow.length).setValues([correctedRow]);
        fixedCount++;
        
        Logger.log(`  ✅ Fixed row ${i + 1}`);
        Logger.log(`  Email: ${correctedRow[colMap['Email']]}`);
        Logger.log(`  Password: ${correctedRow[colMap['Password']]}`);
      }
    } else {
      Logger.log(`Row ${i + 1}: Data looks correct`);
    }
  }
  
  Logger.log(`\n=== SUMMARY ===`);
  Logger.log(`Fixed ${fixedCount} row(s)`);
  
  return {
    success: true,
    message: `Fixed ${fixedCount} merchant row(s)`,
    fixedCount: fixedCount
  };
}
