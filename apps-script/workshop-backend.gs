// ============================================================
//  SPIN PROJECT — Workshop Registration & Attendance System
//  Google Apps Script Backend
//  
//  DEPLOYMENT INSTRUCTIONS:
//  1. Create a new Google Sheet with two tabs: "Registrations" and "Attendance"
//  2. Open Apps Script Editor (Extensions > Apps Script)
//  3. Paste this entire file into the Apps Script editor
//  4. Update the CONFIG section below with your spreadsheet ID
//  5. Deploy as Web App (Execute as: Me, Who has access: Anyone)
//  6. Copy the deployed Web App URL and update js/workshop-config.js
// ============================================================

// ── CONFIGURATION ────────────────────────────────────────────
const CONFIG = {
  // Your Google Spreadsheet ID (from the URL: /d/SPREADSHEET_ID/edit)
  // IMPORTANT: Do not commit the actual spreadsheet ID to public repositories
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',
  
  // Sheet names
  REGISTRATION_SHEET: 'Registrations',
  ATTENDANCE_SHEET: 'Attendance'
};

// ── COLUMN MAPS ───────────────────────────────────────────────
const REGISTRATION_COLS = {
  TIMESTAMP: 1,
  REGISTRATION_ID: 2,
  FULL_NAME: 3,
  DESIGNATION: 4,
  ORGANIZATION: 5,
  EMAIL: 6,
  PHONE: 7
};

const ATTENDANCE_COLS = {
  TIMESTAMP: 1,
  ATTENDANCE_ID: 2,
  FULL_NAME: 3,
  DESIGNATION: 4,
  ORGANIZATION: 5,
  EMAIL: 6,
  PHONE: 7,
  ATTENDANCE_ACKNOWLEDGED: 8
};

// ── HELPERS ──────────────────────────────────────────────────

function getSheet(sheetName) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  // Always ensure headers exist (even if sheet was created manually)
  ensureHeaders(sheet, sheetName);
  
  return sheet;
}

function ensureHeaders(sheet, sheetName) {
  // Check if sheet is completely empty
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  
  // If sheet is empty, add headers
  if (lastRow === 0 && lastCol === 0) {
    addHeaders(sheet, sheetName);
    return;
  }
  
  // Check if first row has content
  if (lastRow > 0) {
    const firstRow = sheet.getRange(1, 1, 1, Math.max(lastCol, 1)).getValues()[0];
    const hasHeaders = firstRow.some(cell => cell !== '');
    
    if (!hasHeaders) {
      addHeaders(sheet, sheetName);
    }
  } else {
    addHeaders(sheet, sheetName);
  }
}

function addHeaders(sheet, sheetName) {
  sheet.clear(); // Clear any existing content
  
  // Create header row based on sheet type
  if (sheetName === CONFIG.REGISTRATION_SHEET) {
    sheet.appendRow([
      'Timestamp',
      'Registration ID',
      'Full Name',
      'Designation / Job Title',
      'Organization / Ministry / Department',
      'Email Address',
      'Phone Number'
    ]);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  } else if (sheetName === CONFIG.ATTENDANCE_SHEET) {
    sheet.appendRow([
      'Timestamp',
      'Attendance ID',
      'Full Name',
      'Designation / Job Title',
      'Organization / Ministry / Department',
      'Email Address',
      'Phone Number',
      'Attendance Acknowledged'
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
  }
}

function generateRegistrationId(sheet) {
  const lastRow = sheet.getLastRow();
  const sn = lastRow > 0 ? lastRow : 0;
  const now = new Date();
  const yr = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, '0');
  return 'SPIN-REG-' + yr + mo + '-' + String(sn).padStart(4, '0');
}

function generateAttendanceId(sheet) {
  const lastRow = sheet.getLastRow();
  const sn = lastRow > 0 ? lastRow : 0;
  const now = new Date();
  const yr = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, '0');
  return 'SPIN-ATT-' + yr + mo + '-' + String(sn).padStart(4, '0');
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function checkDuplicateRegistration(sheet, email) {
  const data = sheet.getDataRange().getValues();
  // Skip header row (index 0)
  for (let i = 1; i < data.length; i++) {
    if (data[i][REGISTRATION_COLS.EMAIL - 1] === email) {
      return true;
    }
  }
  return false;
}

function checkDuplicateAttendance(sheet, email) {
  const data = sheet.getDataRange().getValues();
  // Skip header row (index 0)
  for (let i = 1; i < data.length; i++) {
    if (data[i][ATTENDANCE_COLS.EMAIL - 1] === email) {
      return true;
    }
  }
  return false;
}

// ── HANDLE POST (form submissions) ────────────────────────────

function doPost(e) {
  try {
    // Check if request exists and has data
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ 
        success: false, 
        message: 'Invalid request: No data received' 
      });
    }

    const params = JSON.parse(e.postData.contents);
    const type = params.type;

    // Validate form type
    if (!type || (type !== 'pre_workshop' && type !== 'attendance')) {
      return jsonResponse({ 
        success: false, 
        message: 'Invalid form type' 
      });
    }

    // Handle pre-workshop registration
    if (type === 'pre_workshop') {
      return handleRegistration(params);
    }

    // Handle attendance
    if (type === 'attendance') {
      return handleAttendance(params);
    }

    return jsonResponse({ 
      success: false, 
      message: 'Unknown form type' 
    });

  } catch (error) {
    return jsonResponse({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
}

function handleRegistration(params) {
  // Validate required fields
  const requiredFields = ['fullName', 'designation', 'organization', 'email', 'phone'];
  for (const field of requiredFields) {
    if (!params[field] || params[field].trim() === '') {
      return jsonResponse({ 
        success: false, 
        message: 'Required fields are missing' 
      });
    }
  }

  // Validate email format
  if (!isValidEmail(params.email)) {
    return jsonResponse({ 
      success: false, 
      message: 'Invalid email format' 
    });
  }

  const sheet = getSheet(CONFIG.REGISTRATION_SHEET);

  // Check for duplicate registration by email
  if (checkDuplicateRegistration(sheet, params.email)) {
    return jsonResponse({ 
      success: false, 
      message: 'This email has already been registered for the workshop' 
    });
  }

  // Generate registration ID
  const registrationId = generateRegistrationId(sheet);
  const now = new Date();
  const timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  // Append to sheet
  sheet.appendRow([
    timestamp,
    registrationId,
    params.fullName.trim(),
    params.designation.trim(),
    params.organization.trim(),
    params.email.trim().toLowerCase(),
    params.phone.trim()
  ]);

  return jsonResponse({ 
    success: true, 
    message: 'Registration submitted successfully',
    id: registrationId
  });
}

function handleAttendance(params) {
  // Validate required fields
  const requiredFields = ['fullName', 'designation', 'organization', 'email', 'phone', 'acknowledgedAttendance'];
  for (const field of requiredFields) {
    if (!params[field] || (typeof params[field] === 'string' && params[field].trim() === '')) {
      return jsonResponse({ 
        success: false, 
        message: 'Required fields are missing' 
      });
    }
  }

  // Validate email format
  if (!isValidEmail(params.email)) {
    return jsonResponse({ 
      success: false, 
      message: 'Invalid email format' 
    });
  }

  // Validate attendance acknowledgment
  if (!params.acknowledgedAttendance || params.acknowledgedAttendance !== true) {
    return jsonResponse({ 
      success: false, 
      message: 'Attendance acknowledgment is required' 
    });
  }

  const sheet = getSheet(CONFIG.ATTENDANCE_SHEET);

  // Check for duplicate attendance by email
  if (checkDuplicateAttendance(sheet, params.email)) {
    return jsonResponse({ 
      success: false, 
      message: 'This email has already recorded attendance for this workshop' 
    });
  }

  // Generate attendance ID
  const attendanceId = generateAttendanceId(sheet);
  const now = new Date();
  const timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  // Append to sheet
  sheet.appendRow([
    timestamp,
    attendanceId,
    params.fullName.trim(),
    params.designation.trim(),
    params.organization.trim(),
    params.email.trim().toLowerCase(),
    params.phone.trim(),
    'Yes'
  ]);

  return jsonResponse({ 
    success: true, 
    message: 'Attendance recorded successfully',
    id: attendanceId
  });
}

// ── HANDLE GET (for testing) ───────────────────────────────

function doGet(e) {
  return jsonResponse({ 
    success: true, 
    message: 'SPIN Workshop System API is running',
    timestamp: new Date().toISOString()
  });
}

// ── ONE-TIME SETUP (run manually once) ───────────────────────
// Open Apps Script editor → Run → initializeSheets
// This creates the required sheets with headers if they don't exist

function initializeSheets() {
  getSheet(CONFIG.REGISTRATION_SHEET);
  getSheet(CONFIG.ATTENDANCE_SHEET);
  Logger.log('✅ Workshop sheets initialized successfully.');
}