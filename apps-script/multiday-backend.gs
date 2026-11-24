// ============================================================
//  SPIN PROJECT — Capacity Building & Technical Training
//  Event Attendance & Check-In Backend
//  Dates: 23rd November – 5th December, 2026
//  
//  DEPLOYMENT INSTRUCTIONS:
//  1. Open Extensions > Apps Script in your Google Sheet
//  2. Paste this entire file into the Apps Script editor
//  3. Click Deploy > Manage deployments > Edit > New version > Deploy
// ============================================================

const CONFIG = {
  SPREADSHEET_ID: '11whXAd2PcEPpyV_mNzeQfWwSJpjifgraWT3UMBoQtf8',
  REGISTRATIONS_SHEET: 'Registrations',
  ATTENDANCE_LOG_SHEET: 'Attendance_Log',
  EVENT_NAME: 'SPIN Project Capacity Building & Technical Training',
  EVENT_DATES: '23rd November – 5th December, 2026',
  EVENT_VENUE: 'Main Auditorium, FMWRS Headquarters / Apo Training Center, Abuja',
  EVENT_TIME: '09:00 AM Daily'
};

// ── SHEET INITIALIZATION & COLUMN DEFINITIONS ────────────────

const REG_COLS = {
  TIMESTAMP: 1,
  REGISTRATION_ID: 2,
  FULL_NAME: 3,
  DESIGNATION: 4,
  ORGANIZATION: 5,
  EMAIL: 6,
  PHONE: 7,
  TOTAL_DAYS_ATTENDED: 8,
  LAST_CHECKIN: 9
};

const LOG_COLS = {
  TIMESTAMP: 1,
  REGISTRATION_ID: 2,
  FULL_NAME: 3,
  ORGANIZATION: 4,
  DAY_OR_DATE: 5,
  CHECKIN_TIME: 6,
  METHOD: 7
};

function getSheet(sheetName) {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  ensureHeaders(sheet, sheetName);
  return sheet;
}

function ensureHeaders(sheet, sheetName) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow === 0 && lastCol === 0) {
    setupSheetHeaders(sheet, sheetName);
    return;
  }
  if (lastRow > 0) {
    var firstRow = sheet.getRange(1, 1, 1, Math.max(lastCol, 1)).getValues()[0];
    if (firstRow.every(function(cell) { return cell === ''; })) {
      setupSheetHeaders(sheet, sheetName);
    }
  } else {
    setupSheetHeaders(sheet, sheetName);
  }
}

function setupSheetHeaders(sheet, sheetName) {
  sheet.clear();
  if (sheetName === CONFIG.REGISTRATIONS_SHEET) {
    sheet.appendRow([
      'Timestamp',
      'Registration ID',
      'Full Name',
      'Designation / Job Title',
      'Organization / Ministry / Department',
      'Email Address',
      'Phone Number',
      'Total Days Attended',
      'Last Check-in'
    ]);
    sheet.getRange(1, 1, 1, 9)
      .setFontWeight('bold')
      .setBackground('#008C5A')
      .setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  } else if (sheetName === CONFIG.ATTENDANCE_LOG_SHEET) {
    sheet.appendRow([
      'Timestamp',
      'Registration ID',
      'Full Name',
      'Organization',
      'Session / Date',
      'Check-in Time',
      'Method'
    ]);
    sheet.getRange(1, 1, 1, 7)
      .setFontWeight('bold')
      .setBackground('#006843')
      .setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
}

// ── UTILITY HELPERS ──────────────────────────────────────────

function generateRegistrationId(sheet) {
  var lastRow = sheet.getLastRow();
  var sn = lastRow > 0 ? lastRow : 1;
  var now = new Date();
  var yr = now.getFullYear();
  var mo = String(now.getMonth() + 1).padStart(2, '0');
  return 'SPIN-EVT-' + yr + mo + '-' + String(sn).padStart(4, '0');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function checkDuplicateRegistration(sheet, email) {
  var data = sheet.getDataRange().getValues();
  var normalizedEmail = String(email).trim().toLowerCase();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][REG_COLS.EMAIL - 1]).trim().toLowerCase() === normalizedEmail) {
      return {
        found: true,
        id: data[i][REG_COLS.REGISTRATION_ID - 1],
        name: data[i][REG_COLS.FULL_NAME - 1]
      };
    }
  }
  return { found: false };
}

function formatCellDay(val) {
  if (!val) return '';
  if (val instanceof Date || Object.prototype.toString.call(val) === '[object Date]') {
    return Utilities.formatDate(val, Session.getScriptTimeZone(), 'dd MMM').toLowerCase();
  }
  var str = String(val).trim();
  if (str.charAt(0) === "'") {
    str = str.substring(1).trim();
  }
  var lower = str.toLowerCase();
  if (lower.indexOf('t') !== -1 || (lower.indexOf('-') !== -1 && lower.length >= 10)) {
    try {
      var d = new Date(str);
      if (!isNaN(d.getTime())) {
        return Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd MMM').toLowerCase();
      }
    } catch (e) {}
  }
  return lower;
}

function normalizeDay(dayParam) {
  if (!dayParam || String(dayParam).trim() === '') {
    var now = new Date();
    return Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd MMM');
  }
  return String(dayParam).trim();
}

// ── REQUEST ROUTING ──────────────────────────────────────────

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, message: 'No data received.' });
    }
    var params = JSON.parse(e.postData.contents);
    var action = params.action || params.type;

    if (action === 'register') return handleRegistration(params);
    if (action === 'checkin' || action === 'checkin_name' || action === 'checkin_confirm') return handleCheckin(params);
    if (action === 'checkin_manual' || action === 'search') return handleCheckinManual(params);
    if (action === 'checkin_stats' || action === 'stats') return handleCheckinStats(params);
    if (action === 'lookup') return handleLookupRegistration(params);

    return jsonResponse({ success: false, message: 'Invalid action requested.' });
  } catch (err) {
    return jsonResponse({ success: false, message: 'Server error: ' + err.message });
  }
}

function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action || params.type;

    if (action === 'register') return handleRegistration(params);
    if (action === 'checkin' || action === 'checkin_name' || action === 'checkin_confirm') return handleCheckin(params);
    if (action === 'checkin_manual' || action === 'search') return handleCheckinManual(params);
    if (action === 'checkin_stats' || action === 'stats') return handleCheckinStats(params);
    if (action === 'lookup') return handleLookupRegistration(params);

    return jsonResponse({
      success: true,
      service: 'SPIN Event Attendance API (23 Nov - 5 Dec)',
      status: 'online',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return jsonResponse({ success: false, message: 'Server error: ' + err.message });
  }
}

// ── 1. REGISTRATION HANDLER (NO EMAIL REQUIREMENT) ────────────

function handleRegistration(params) {
  var requiredFields = ['fullName', 'designation', 'organization', 'email'];
  for (var i = 0; i < requiredFields.length; i++) {
    if (!params[requiredFields[i]] || String(params[requiredFields[i]]).trim() === '') {
      return jsonResponse({ success: false, message: 'Please fill all required fields.' });
    }
  }

  var email = String(params.email).trim().toLowerCase();
  if (!isValidEmail(email)) {
    return jsonResponse({ success: false, message: 'Invalid email format provided.' });
  }

  var regSheet = getSheet(CONFIG.REGISTRATIONS_SHEET);
  var dupCheck = checkDuplicateRegistration(regSheet, email);
  if (dupCheck.found) {
    return jsonResponse({
      success: true,
      alreadyRegistered: true,
      id: dupCheck.id,
      name: dupCheck.name,
      message: 'You are already registered for this training program!'
    });
  }

  var registrationId = generateRegistrationId(regSheet);
  var now = new Date();
  var timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  var phoneVal = params.phone ? String(params.phone).trim() : '';

  regSheet.appendRow([
    timestamp,
    registrationId,
    String(params.fullName).trim(),
    String(params.designation).trim(),
    String(params.organization).trim(),
    email,
    phoneVal,
    0, // Total Days Attended
    '' // Last Check-in
  ]);

  return jsonResponse({
    success: true,
    message: 'Registration recorded successfully!',
    id: registrationId,
    name: String(params.fullName).trim()
  });
}

// ── 2. NAME CHECK-IN HANDLER (BY REG ID OR NAME) ──────────────

function handleCheckin(params) {
  var regId = params.registrationId ? String(params.registrationId).trim() : '';
  var targetDay = normalizeDay(params.day);

  if (!regId) {
    return jsonResponse({ success: false, message: 'Participant identifier is missing.' });
  }

  var regSheet = getSheet(CONFIG.REGISTRATIONS_SHEET);
  var regData = regSheet.getDataRange().getValues();
  var participantRowIndex = -1;
  var participantName = '';
  var participantOrg = '';
  var currentTotalDays = 0;

  for (var i = 1; i < regData.length; i++) {
    var rowRegId = String(regData[i][REG_COLS.REGISTRATION_ID - 1]).trim().toUpperCase();
    if (rowRegId === regId.toUpperCase()) {
      participantRowIndex = i + 1;
      participantName = regData[i][REG_COLS.FULL_NAME - 1];
      participantOrg = regData[i][REG_COLS.ORGANIZATION - 1];
      currentTotalDays = Number(regData[i][REG_COLS.TOTAL_DAYS_ATTENDED - 1]) || 0;
      break;
    }
  }

  if (participantRowIndex === -1) {
    return jsonResponse({
      success: false,
      message: 'Participant record not found.'
    });
  }

  // Check if already checked in for targetDay
  var logSheet = getSheet(CONFIG.ATTENDANCE_LOG_SHEET);
  var logData = logSheet.getDataRange().getValues();
  var normalizedTargetDay = formatCellDay(targetDay);

  for (var j = 1; j < logData.length; j++) {
    var loggedRegId = String(logData[j][LOG_COLS.REGISTRATION_ID - 1]).trim().toUpperCase();
    var loggedDay = formatCellDay(logData[j][LOG_COLS.DAY_OR_DATE - 1]);

    if (loggedRegId === regId.toUpperCase()) {
      var loggedDayNorm = loggedDay.replace(/[^a-z0-9]/g, '');
      var targetDayNorm = normalizedTargetDay.replace(/[^a-z0-9]/g, '');
      if (loggedDayNorm === targetDayNorm || loggedDay.indexOf(normalizedTargetDay) !== -1 || normalizedTargetDay.indexOf(loggedDay) !== -1) {
        return jsonResponse({
          success: false,
          alreadyCheckedIn: true,
          day: targetDay,
          name: participantName,
          registrationId: regId,
          checkinTime: logData[j][LOG_COLS.CHECKIN_TIME - 1],
          message: participantName + ' is ALREADY marked present for ' + targetDay + '.'
        });
      }
    }
  }

  // Record Attendance
  var now = new Date();
  var timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  var formattedTime = Utilities.formatDate(now, Session.getScriptTimeZone(), 'HH:mm (dd MMM yyyy)');

  // Prefix with single quote so Google Sheets treats it as plain text and avoids date auto-parsing
  logSheet.appendRow([
    timestamp,
    regId,
    participantName,
    participantOrg,
    "'" + targetDay,
    formattedTime,
    'Name Check-in'
  ]);

  // Update Registrations Sheet
  regSheet.getRange(participantRowIndex, REG_COLS.TOTAL_DAYS_ATTENDED).setValue(currentTotalDays + 1);
  regSheet.getRange(participantRowIndex, REG_COLS.LAST_CHECKIN).setValue(targetDay + ' (' + formattedTime + ')');

  return jsonResponse({
    success: true,
    day: targetDay,
    name: participantName,
    registrationId: regId,
    organization: participantOrg,
    totalDaysAttended: currentTotalDays + 1,
    checkinTime: formattedTime,
    message: 'Checked in ' + participantName + ' for ' + targetDay + '!'
  });
}

// ── 3. SEARCH ATTENDEES BY NAME ───────────────────────────────

function handleCheckinManual(params) {
  var query = params.query ? String(params.query).trim().toLowerCase() : '';

  var regSheet = getSheet(CONFIG.REGISTRATIONS_SHEET);
  var regData = regSheet.getDataRange().getValues();
  var logSheet = getSheet(CONFIG.ATTENDANCE_LOG_SHEET);
  var logData = logSheet.getDataRange().getValues();

  var results = [];

  for (var i = 1; i < regData.length; i++) {
    var name = String(regData[i][REG_COLS.FULL_NAME - 1]).toLowerCase();
    var org = String(regData[i][REG_COLS.ORGANIZATION - 1]).toLowerCase();
    var email = String(regData[i][REG_COLS.EMAIL - 1]).toLowerCase();
    var phone = String(regData[i][REG_COLS.PHONE - 1]).toLowerCase();
    var regId = String(regData[i][REG_COLS.REGISTRATION_ID - 1]).toLowerCase();

    // If query is empty, return the most recent 50 registrants
    var isMatch = (!query) || (name.indexOf(query) !== -1 || org.indexOf(query) !== -1 || email.indexOf(query) !== -1 || phone.indexOf(query) !== -1 || regId.indexOf(query) !== -1);

    if (isMatch) {
      var currentRegIdUpper = String(regData[i][REG_COLS.REGISTRATION_ID - 1]).trim().toUpperCase();

      var attendedDays = [];
      for (var j = 1; j < logData.length; j++) {
        if (String(logData[j][LOG_COLS.REGISTRATION_ID - 1]).trim().toUpperCase() === currentRegIdUpper) {
          var rawDay = logData[j][LOG_COLS.DAY_OR_DATE - 1];
          var cellDay = formatCellDay(rawDay);
          var dayDisplay = cellDay;
          if (cellDay.length >= 5) {
            dayDisplay = cellDay.substring(0, 2) + ' ' + cellDay.substring(2).trim();
            dayDisplay = dayDisplay.charAt(0).toUpperCase() + dayDisplay.slice(1);
          }
          attendedDays.push({
            day: dayDisplay || String(rawDay),
            checkinTime: logData[j][LOG_COLS.CHECKIN_TIME - 1]
          });
        }
      }

      results.push({
        registrationId: regData[i][REG_COLS.REGISTRATION_ID - 1],
        fullName: regData[i][REG_COLS.FULL_NAME - 1],
        designation: regData[i][REG_COLS.DESIGNATION - 1],
        organization: regData[i][REG_COLS.ORGANIZATION - 1],
        email: regData[i][REG_COLS.EMAIL - 1],
        phone: regData[i][REG_COLS.PHONE - 1],
        totalDaysAttended: attendedDays.length,
        attendedDays: attendedDays
      });

      if (!query && results.length >= 50) break;
    }
  }

  return jsonResponse({ success: true, count: results.length, results: results });
}

// ── 4. STATS HANDLER ──────────────────────────────────────────

function handleCheckinStats(params) {
  var regSheet = getSheet(CONFIG.REGISTRATIONS_SHEET);
  var regData = regSheet.getDataRange().getValues();
  var totalRegistered = Math.max(0, regData.length - 1);

  var logSheet = getSheet(CONFIG.ATTENDANCE_LOG_SHEET);
  var logData = logSheet.getDataRange().getValues();

  var requestedDay = params.day ? normalizeDay(params.day).toLowerCase() : null;
  var dayCounts = {};
  var requestedDayCount = 0;

  for (var i = 1; i < logData.length; i++) {
    var dayVal = String(logData[i][LOG_COLS.DAY_OR_DATE - 1]).trim();
    if (!dayCounts[dayVal]) {
      dayCounts[dayVal] = 0;
    }
    dayCounts[dayVal]++;

    if (requestedDay && dayVal.toLowerCase() === requestedDay) {
      requestedDayCount++;
    }
  }

  return jsonResponse({
    success: true,
    totalRegistered: totalRegistered,
    dayCounts: dayCounts,
    requestedDayCount: requestedDayCount
  });
}

// ── 5. LOOKUP REGISTRATION ───────────────────────────────────

function handleLookupRegistration(params) {
  var query = params.query || params.email || params.id || params.name;
  if (!query) {
    return jsonResponse({ success: false, message: 'Search query is missing.' });
  }

  var normalized = String(query).trim().toLowerCase();
  var sheet = getSheet(CONFIG.REGISTRATIONS_SHEET);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var email = String(data[i][REG_COLS.EMAIL - 1]).trim().toLowerCase();
    var id = String(data[i][REG_COLS.REGISTRATION_ID - 1]).trim().toLowerCase();
    var name = String(data[i][REG_COLS.FULL_NAME - 1]).trim().toLowerCase();

    if (email === normalized || id === normalized || name === normalized) {
      return jsonResponse({
        success: true,
        id: data[i][REG_COLS.REGISTRATION_ID - 1],
        name: data[i][REG_COLS.FULL_NAME - 1],
        organization: data[i][REG_COLS.ORGANIZATION - 1]
      });
    }
  }

  return jsonResponse({ success: false, message: 'Participant record not found.' });
}
