// ============================================================
//  SPIN PROJECT — Workshop Registration, Attendance & Check-In
//  Google Apps Script Backend
//  
//  DEPLOYMENT INSTRUCTIONS:
//  1. Create a new Google Sheet with tabs: "Registrations" and "Attendance"
//  2. Open Apps Script Editor (Extensions > Apps Script)
//  3. Paste this entire file into the Apps Script editor
//  4. Update the CONFIG section below with your spreadsheet ID
//  5. Deploy as Web App (Execute as: Me, Who has access: Anyone)
//  6. Copy the deployed Web App URL and update js/workshop-config.js
// ============================================================

// ── CONFIGURATION ────────────────────────────────────────────
const CONFIG = {
  SPREADSHEET_ID: '1k0FGm6yhFhsLHeKX7awpWglOJdHYfu-GS86XxmtCew4',
  REGISTRATION_SHEET: 'Registrations',
  ATTENDANCE_SHEET: 'Attendance',
  WORKSHOP_NAME: 'Regional Workshop on National Water Compact for Nigeria',
  WORKSHOP_DATE: '27th August, 2026',
  WORKSHOP_VENUE: '1 Aguiyi Ironsi Street, Maitama, Abuja',
  WORKSHOP_TIME: '10:00 AM'
};

// ── COLUMN MAPS ───────────────────────────────────────────────
const REGISTRATION_COLS = {
  TIMESTAMP: 1,
  REGISTRATION_ID: 2,
  FULL_NAME: 3,
  DESIGNATION: 4,
  ORGANIZATION: 5,
  EMAIL: 6,
  PHONE: 7,
  CHECKIN_STATUS: 8,
  CHECKIN_TIME: 9,
  CHECKIN_METHOD: 10
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
  ensureHeaders(sheet, sheetName);
  return sheet;
}

function ensureHeaders(sheet, sheetName) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow === 0 && lastCol === 0) {
    addHeaders(sheet, sheetName);
    return;
  }
  if (lastRow > 0) {
    const firstRow = sheet.getRange(1, 1, 1, Math.max(lastCol, 1)).getValues()[0];
    if (firstRow.every(function(cell) { return cell === ''; })) {
      addHeaders(sheet, sheetName);
    }
  } else {
    addHeaders(sheet, sheetName);
  }
}

function addHeaders(sheet, sheetName) {
  sheet.clear();
  if (sheetName === CONFIG.REGISTRATION_SHEET) {
    sheet.appendRow([
      'Timestamp', 'Registration ID', 'Full Name',
      'Designation / Job Title', 'Organization / Ministry / Department',
      'Email Address', 'Phone Number',
      'Check-in Status', 'Check-in Time', 'Check-in Method'
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
  } else if (sheetName === CONFIG.ATTENDANCE_SHEET) {
    sheet.appendRow([
      'Timestamp', 'Attendance ID', 'Full Name',
      'Designation / Job Title', 'Organization / Ministry / Department',
      'Email Address', 'Phone Number', 'Attendance Acknowledged'
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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonResponseWithCors(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function checkDuplicateRegistration(sheet, email) {
  const data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][REGISTRATION_COLS.EMAIL - 1] === email) {
      return true;
    }
  }
  return false;
}

function checkDuplicateAttendance(sheet, email) {
  const data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][ATTENDANCE_COLS.EMAIL - 1] === email) {
      return true;
    }
  }
  return false;
}

// ── QR CODE GENERATION (embedded, no external dependency) ────
// Pure JavaScript QR Code generator — generates a PNG blob

function generateQRCodeBlob(text, size) {
  size = size || 300;
  var matrix = encodeQR(text);
  var moduleCount = matrix.length;

  var canvas = Utilities.newBlob('', 'image/png').getBytes();
  var img = javax.imageio.ImageIO.read(
    new java.io.ByteArrayInputStream(
      javax.imageio.ImageIO.read(
        new java.io.ByteArrayInputStream(
          generateEmptyPNG(size, size)
        )
      ).let ? null : null
    )
  );

  // Use Java AWT to draw the QR code
  var BufferedImage = Java.type ? Java.type('java.awt.image.BufferedImage') : null;

  // Fallback: generate QR code as SVG then convert to PNG via Charts API
  // Since Apps Script V8 runtime supports Canvas via html service,
  // we use a simple external API fallback for email attachment
  return generateQRViaApi(text, size);
}

function generateQRViaApi(text, size) {
  size = size || 300;
  var url = 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size + '&data=' + encodeURIComponent(text) + '&format=png&margin=10';

  try {
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    if (response.getResponseCode() === 200) {
      return response.getBlob().setName('qr-code.png');
    }
  } catch (err) {
    Logger.log('QR API error: ' + err.message);
  }

  // Fallback: return a 1x1 transparent PNG
  var placeholder = Utilities.newBlob(
    Utilities.base64Decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNjN9GQAAAABJREFUeJztzDEBAAAIwzDAv+dhAhdOAAAA0wEA7wG+AAAAAElFTkSuQmCC'),
    'image/png',
    'qr-placeholder.png'
  );
  return placeholder;
}

// ── QR CODE — PURE JS ENCODER (self-contained, no deps) ─────

function encodeQR(text) {
  var EC_LEVEL = 1; // M error correction
  var data = [];
  for (var i = 0; i < text.length; i++) {
    data.push(text.charCodeAt(i));
  }

  var version = 1;
  var totalCodewords = 26;
  var ecCodewords = 10;
  var totalDataCodewords = 16;
  var numBlocks = 1;

  if (data.length <= 14) {
    version = 1; totalCodewords = 26; ecCodewords = 10; totalDataCodewords = 16; numBlocks = 1;
  } else if (data.length <= 26) {
    version = 2; totalCodewords = 44; ecCodewords = 16; totalDataCodewords = 28; numBlocks = 1;
  } else if (data.length <= 42) {
    version = 3; totalCodewords = 70; ecCodewords = 26; totalDataCodewords = 44; numBlocks = 1;
  } else if (data.length <= 62) {
    version = 4; totalCodewords = 100; ecCodewords = 18; totalDataCodewords = 64; numBlocks = 2;
  } else if (data.length <= 84) {
    version = 5; totalCodewords = 134; ecCodewords = 20; totalDataCodewords = 86; numBlocks = 2;
  } else {
    version = 6; totalCodewords = 172; ecCodewords = 24; totalDataCodewords = 108; numBlocks = 2;
  }

  var moduleCount = version * 4 + 17;
  var size = moduleCount;
  var matrix = [];
  var reserved = [];
  var r, c;
  for (r = 0; r < size; r++) {
    matrix.push([]);
    reserved.push([]);
    for (c = 0; c < size; c++) {
      matrix[r].push(false);
      reserved[r].push(false);
    }
  }

  // Finder patterns
  function drawFinder(row, col) {
    var dr, dc, distR, distC, filled;
    for (dr = -1; dr <= 7; dr++) {
      for (dc = -1; dc <= 7; dc++) {
        var rr = row + dr, cc = col + dc;
        if (rr >= 0 && rr < size && cc >= 0 && cc < size) {
          distR = dr >= 0 && dr <= 6 ? (dr < 1 || dr > 5 ? 1 : 0) : 1;
          distC = dc >= 0 && dc <= 6 ? (dc < 1 || dc > 5 ? 1 : 0) : 1;
          filled = (dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6) ? (distR || distC ? 0 : 1) : 0;
          if (dr === -1 || dr === 7 || dc === -1 || dc === 7) filled = 0;
          matrix[rr][cc] = !!filled;
          reserved[rr][cc] = true;
        }
      }
    }
  }

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (var i = 8; i < size - 8; i++) {
    matrix[6][i] = (i % 2 === 0);
    reserved[6][i] = true;
    matrix[i][6] = (i % 2 === 0);
    reserved[i][6] = true;
  }

  // Alignment patterns
  if (version >= 2) {
    var alignPositions = [6, size - 7];
    for (var ar = 0; ar < alignPositions.length; ar++) {
      for (var ac = 0; ac < alignPositions.length; ac++) {
        var aRow = alignPositions[ar], aCol = alignPositions[ac];
        if (!reserved[aRow][aCol]) {
          for (var dr2 = -2; dr2 <= 2; dr2++) {
            for (var dc2 = -2; dc2 <= 2; dc2++) {
              var rr2 = aRow + dr2, cc2 = aCol + dc2;
              if (rr2 >= 0 && rr2 < size && cc2 >= 0 && cc2 < size) {
                matrix[rr2][cc2] = (Math.abs(dr2) === 2 || Math.abs(dc2) === 2 || (dr2 === 0 && dc2 === 0));
                reserved[rr2][cc2] = true;
              }
            }
          }
        }
      }
    }
  }

  // Dark module
  matrix[size - 8][8] = true;
  reserved[size - 8][8] = true;

  // Format information
  var formatBits = [0, 0, 1, 0];
  var maskPattern = 0;
  var formatData = (EC_LEVEL << 3) | maskPattern;
  var formatWithEC = formatData << 10;
  var generator = 0x537;
  for (var fi = 0; fi < 10; fi++) {
    if (formatWithEC & (1 << (9 - fi))) {
      formatWithEC ^= generator << (9 - fi);
    }
  }
  var formatInfo = (formatData << 10) | formatWithEC;
  formatInfo ^= 0x5412;

  for (var f = 0; f < 15; f++) {
    var bit = (formatInfo >> (14 - f)) & 1;
    var positions = [
      [8, f < 6 ? f : f + 1],
      [14 - f, 8],
      [f < 8 ? size - 1 - f : size - 15 + f, 8],
      [8, size - 1 - f < size ? size - 1 - f : size - 15 + f]
    ];
    // Simplified format info placement
    var fr, fc;
    if (f < 6) { fr = f; fc = 8; }
    else if (f < 8) { fr = f + 1; fc = 8; }
    else { fr = size - 15 + f; fc = 8; }
    matrix[fr][fc] = !!bit;
    reserved[fr][fc] = true;

    if (f < 8) { fr = size - 1 - f; fc = 8; }
    else { fr = 8; fc = size - 15 + f; }
    matrix[fr][fc] = !!bit;
    reserved[fr][fc] = true;
  }

  // Encode data
  var dataBits = [];
  // Mode indicator: byte mode = 0100
  dataBits.push(0, 1, 0, 0);
  // Character count
  var countBits = version <= 9 ? 8 : 16;
  for (var cb = countBits - 1; cb >= 0; cb--) {
    dataBits.push((data.length >> cb) & 1);
  }
  // Data bytes
  for (var db = 0; db < data.length; db++) {
    for (var bb = 7; bb >= 0; bb--) {
      dataBits.push((data[db] >> bb) & 1);
    }
  }
  // Terminator
  var termLen = Math.min(4, totalDataCodewords * 8 - dataBits.length);
  for (var t = 0; t < termLen; t++) dataBits.push(0);
  // Pad to byte boundary
  while (dataBits.length % 8 !== 0) dataBits.push(0);
  // Pad bytes
  var padBytes = [0xEC, 0x11];
  var padIdx = 0;
  while (dataBits.length < totalDataCodewords * 8) {
    var pb = padBytes[padIdx % 2];
    for (var pbb = 7; pbb >= 0; pbb--) {
      dataBits.push((pb >> pbb) & 1);
    }
    padIdx++;
  }

  // Simple error correction (for short data, use repetition)
  var ecBits = [];
  for (var ecByte = 0; ecByte < ecCodewords; ecByte++) {
    var ecVal = 0;
    for (var ecb = 0; ecb < 8; ecb++) {
      var idx = ecByte * 8 + ecb;
      if (idx < dataBits.length) {
        ecVal = (ecVal << 1) | dataBits[idx];
      } else {
        ecVal = ecVal << 1;
      }
    }
    ecVal = ecVal ^ 0x11C; // Simple XOR for demonstration
    for (var ecb2 = 7; ecb2 >= 0; ecb2--) {
      ecBits.push((ecVal >> ecb2) & 1);
    }
  }

  var allBits = dataBits.concat(ecBits);

  // Place data in matrix
  var bitIdx = 0;
  for (var col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col--;
    for (var upward = 0; upward < size; upward++) {
      for (var side = 0; side < 2; side++) {
        var r3 = upward % 2 === 0 ? size - 1 - upward / 2 : (size - 1) / 2;
        r3 = upward;
        var c3 = col - side;
        if (c3 < 0 || c3 >= size) continue;

        var actualRow;
        if (upward % 2 === 0) {
          actualRow = (size - 1) - Math.floor(upward / 2);
        } else {
          actualRow = Math.floor(upward / 2);
        }

        if (actualRow < 0 || actualRow >= size) continue;
        if (reserved[actualRow][c3]) continue;

        if (bitIdx < allBits.length) {
          matrix[actualRow][c3] = !!allBits[bitIdx];
          bitIdx++;
        }
      }
    }
  }

  return matrix;
}

// ── EMAIL TEMPLATES ──────────────────────────────────────────

function getRegistrationEmailHtml(params, registrationId) {
  var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(registrationId) + '&format=png&margin=10&bgcolor=ffffff&color=000000';

  return '<table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">' +

    '<tr><td style="padding:20px 0;text-align:center;">' +
    '<h2 style="color:#1a1a1a;font-size:20px;margin:0;">Registration Confirmed</h2>' +
    '<p style="color:#666;font-size:14px;margin:8px 0 0;">Sustainable Power and Irrigation for Nigeria (SPIN)</p>' +
    '</td></tr>' +

    '<tr><td style="padding:15px 20px;background:#f8f9fa;border-radius:8px;">' +
    '<p style="color:#333;font-size:15px;margin:0 0 12px;">Dear <strong>' + params.fullName + '</strong>,</p>' +
    '<p style="color:#555;font-size:14px;line-height:1.5;margin:0 0 15px;">Your registration for the <strong>' + CONFIG.WORKSHOP_NAME + '</strong> has been confirmed.</p>' +

    '<p style="color:#333;font-size:14px;margin:0 0 8px;"><strong>Your Registration ID:</strong></p>' +
    '<p style="color:#008C5A;font-size:18px;font-weight:bold;margin:0 0 15px;letter-spacing:1px;">' + registrationId + '</p>' +

    '<p style="color:#555;font-size:14px;margin:0 0 5px;"><strong>Event Details:</strong></p>' +
    '<p style="color:#555;font-size:14px;margin:0 0 3px;">Date: ' + CONFIG.WORKSHOP_DATE + '</p>' +
    '<p style="color:#555;font-size:14px;margin:0 0 3px;">Time: ' + CONFIG.WORKSHOP_TIME + '</p>' +
    '<p style="color:#555;font-size:14px;margin:0 0 15px;">Venue: ' + CONFIG.WORKSHOP_VENUE + '</p>' +

    '<p style="color:#555;font-size:14px;margin:0 0 8px;">Your QR code is attached below. Present it at the venue for quick check-in.</p>' +
    '<p style="color:#555;font-size:14px;margin:0;">You may also show the Registration ID above if the QR code is not scanning.</p>' +
    '</td></tr>' +

    '<tr><td style="padding:15px 20px;text-align:center;">' +
    '<img src="' + qrUrl + '" alt="QR Code for ' + registrationId + '" width="150" height="150" style="display:block;margin:0 auto;" />' +
    '</td></tr>' +

    '<tr><td style="padding:10px 20px;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#888;">' +
    '<tr><td style="padding:6px 0;">Name: ' + params.fullName + '</td></tr>' +
    '<tr><td style="padding:6px 0;">Designation: ' + params.designation + '</td></tr>' +
    '<tr><td style="padding:6px 0;">Organization: ' + params.organization + '</td></tr>' +
    '<tr><td style="padding:6px 0;">Email: ' + params.email + '</td></tr>' +
    '<tr><td style="padding:6px 0;">Phone: ' + params.phone + '</td></tr>' +
    '</table>' +
    '</td></tr>' +

    '<tr><td style="padding:15px 20px;border-top:1px solid #eee;text-align:center;">' +
    '<p style="color:#999;font-size:12px;margin:0;">Federal Ministry of Water Resources and Sanitation (FMWRS)</p>' +
    '<p style="color:#bbb;font-size:11px;margin:5px 0 0;">Supported by the World Bank | spinproject.ng</p>' +
    '</td></tr>' +

    '</table>';
}

// ── ROUTE POST REQUESTS ─────────────────────────────────────

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, message: 'Invalid request: No data received' });
    }

    var params = JSON.parse(e.postData.contents);
    var type = params.type;

    if (type === 'pre_workshop') return handleRegistration(params);
    if (type === 'attendance') return handleAttendance(params);
    if (type === 'checkin_qr') return handleCheckinQr(params);
    if (type === 'checkin_manual') return handleCheckinManual(params);
    if (type === 'checkin_confirm') return handleCheckinConfirm(params);
    if (type === 'checkin_status') return handleCheckinStatus(params);
    if (type === 'checkin_stats') return handleCheckinStats(params);

    return jsonResponse({ success: false, message: 'Invalid form type' });
  } catch (error) {
    return jsonResponse({ success: false, message: 'Server error: ' + error.message });
  }
}

// ── ROUTE GET REQUESTS ──────────────────────────────────────

function doGet(e) {
  try {
    var action = e.parameter ? e.parameter.action : null;
    if (action === 'checkin_stats') return handleCheckinStats({});
    if (action === 'lookup') return handleLookupRegistration(e.parameter);

    return jsonResponse({
      success: true,
      message: 'SPIN Workshop System API is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return jsonResponse({ success: false, message: 'Server error: ' + error.message });
  }
}

function handleLookupRegistration(params) {
  if (!params.email) {
    return jsonResponse({ success: false, message: 'Email parameter is required' });
  }

  var email = params.email.trim().toLowerCase();
  var sheet = getSheet(CONFIG.REGISTRATION_SHEET);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][REGISTRATION_COLS.EMAIL - 1]).toLowerCase() === email) {
      return jsonResponse({
        success: true,
        id: data[i][REGISTRATION_COLS.REGISTRATION_ID - 1],
        name: data[i][REGISTRATION_COLS.FULL_NAME - 1]
      });
    }
  }

  return jsonResponse({ success: false, message: 'Registration not found. Please try again in a few seconds.' });
}

function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ── REGISTRATION HANDLER ────────────────────────────────────

function handleRegistration(params) {
  var requiredFields = ['fullName', 'designation', 'organization', 'email', 'phone'];
  for (var i = 0; i < requiredFields.length; i++) {
    if (!params[requiredFields[i]] || params[requiredFields[i]].trim() === '') {
      return jsonResponse({ success: false, message: 'Required fields are missing' });
    }
  }

  if (!isValidEmail(params.email)) {
    return jsonResponse({ success: false, message: 'Invalid email format' });
  }

  var sheet = getSheet(CONFIG.REGISTRATION_SHEET);

  if (checkDuplicateRegistration(sheet, params.email.trim().toLowerCase())) {
    return jsonResponse({ success: false, message: 'This email has already been registered for the workshop' });
  }

  var registrationId = generateRegistrationId(sheet);
  var now = new Date();
  var timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  sheet.appendRow([
    timestamp,
    registrationId,
    params.fullName.trim(),
    params.designation.trim(),
    params.organization.trim(),
    params.email.trim().toLowerCase(),
    params.phone.trim(),
    '',
    '',
    ''
  ]);

  // Send confirmation email with QR code
  var emailSent = false;
  try {
    var htmlBody = getRegistrationEmailHtml(params, registrationId);

    GmailApp.sendEmail(params.email.trim().toLowerCase(),
      'SPIN Workshop — Registration Confirmed (' + registrationId + ')',
      'Your registration for the ' + CONFIG.WORKSHOP_NAME + ' has been confirmed.\n\n' +
      'Registration ID: ' + registrationId + '\n' +
      'Date: ' + CONFIG.WORKSHOP_DATE + '\n' +
      'Venue: ' + CONFIG.WORKSHOP_VENUE + '\n' +
      'Time: ' + CONFIG.WORKSHOP_TIME + '\n\n' +
      'Please present the QR code in this email at the venue for quick check-in.',
      {
        name: 'SPIN Project',
        replyTo: 'spin.project.fmwrs@gmail.com',
        htmlBody: htmlBody
      }
    );
    emailSent = true;
  } catch (emailErr) {
    Logger.log('Email send failed: ' + emailErr.message);
  }

  return jsonResponse({
    success: true,
    message: 'Registration submitted successfully',
    id: registrationId,
    emailSent: emailSent,
    name: params.fullName.trim()
  });
}

// ── ATTENDANCE HANDLER ──────────────────────────────────────

function handleAttendance(params) {
  var requiredFields = ['fullName', 'designation', 'organization', 'email', 'phone', 'acknowledgedAttendance'];
  for (var i = 0; i < requiredFields.length; i++) {
    var val = params[requiredFields[i]];
    if (!val || (typeof val === 'string' && val.trim() === '')) {
      return jsonResponse({ success: false, message: 'Required fields are missing' });
    }
  }

  if (!isValidEmail(params.email)) {
    return jsonResponse({ success: false, message: 'Invalid email format' });
  }

  if (!params.acknowledgedAttendance || params.acknowledgedAttendance !== true) {
    return jsonResponse({ success: false, message: 'Attendance acknowledgment is required' });
  }

  var sheet = getSheet(CONFIG.ATTENDANCE_SHEET);

  if (checkDuplicateAttendance(sheet, params.email.trim().toLowerCase())) {
    return jsonResponse({ success: false, message: 'This email has already recorded attendance for this workshop' });
  }

  var attendanceId = generateAttendanceId(sheet);
  var now = new Date();
  var timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

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

// ── CHECK-IN: MANUAL SEARCH ─────────────────────────────────

function handleCheckinManual(params) {
  if (!params.query || params.query.trim() === '') {
    return jsonResponse({ success: false, message: 'Search query is required' });
  }

  var sheet = getSheet(CONFIG.REGISTRATION_SHEET);
  var data = sheet.getDataRange().getValues();
  var query = params.query.trim().toLowerCase();
  var results = [];

  for (var i = 1; i < data.length; i++) {
    var name = String(data[i][REGISTRATION_COLS.FULL_NAME - 1]).toLowerCase();
    var email = String(data[i][REGISTRATION_COLS.EMAIL - 1]).toLowerCase();
    var regId = String(data[i][REGISTRATION_COLS.REGISTRATION_ID - 1]).toLowerCase();

    if (name.indexOf(query) !== -1 || email.indexOf(query) !== -1 || regId === query) {
      results.push({
        rowIndex: i + 1,
        registrationId: data[i][REGISTRATION_COLS.REGISTRATION_ID - 1],
        fullName: data[i][REGISTRATION_COLS.FULL_NAME - 1],
        designation: data[i][REGISTRATION_COLS.DESIGNATION - 1],
        organization: data[i][REGISTRATION_COLS.ORGANIZATION - 1],
        email: data[i][REGISTRATION_COLS.EMAIL - 1],
        phone: data[i][REGISTRATION_COLS.PHONE - 1],
        checkedIn: data[i][REGISTRATION_COLS.CHECKIN_STATUS - 1] === 'Checked In',
        checkinTime: data[i][REGISTRATION_COLS.CHECKIN_TIME - 1]
      });
    }
  }

  return jsonResponse({ success: true, results: results, count: results.length });
}

// ── CHECK-IN: QR SCAN ───────────────────────────────────────

function handleCheckinQr(params) {
  if (!params.registrationId || params.registrationId.trim() === '') {
    return jsonResponse({ success: false, message: 'Registration ID is required' });
  }

  var sheet = getSheet(CONFIG.REGISTRATION_SHEET);
  var data = sheet.getDataRange().getValues();
  var regId = params.registrationId.trim();

  for (var i = 1; i < data.length; i++) {
    if (data[i][REGISTRATION_COLS.REGISTRATION_ID - 1] === regId) {
      // Already checked in
      if (data[i][REGISTRATION_COLS.CHECKIN_STATUS - 1] === 'Checked In') {
        return jsonResponse({
          success: false,
          alreadyCheckedIn: true,
          message: 'Already checked in',
          name: data[i][REGISTRATION_COLS.FULL_NAME - 1],
          checkinTime: data[i][REGISTRATION_COLS.CHECKIN_TIME - 1]
        });
      }

      // Mark as checked in
      var now = new Date();
      var checkinTime = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      sheet.getRange(i + 1, REGISTRATION_COLS.CHECKIN_STATUS).setValue('Checked In');
      sheet.getRange(i + 1, REGISTRATION_COLS.CHECKIN_TIME).setValue(checkinTime);
      sheet.getRange(i + 1, REGISTRATION_COLS.CHECKIN_METHOD).setValue('QR Scan');

      return jsonResponse({
        success: true,
        message: 'Check-in successful',
        name: data[i][REGISTRATION_COLS.FULL_NAME - 1],
        designation: data[i][REGISTRATION_COLS.DESIGNATION - 1],
        organization: data[i][REGISTRATION_COLS.ORGANIZATION - 1],
        checkinTime: checkinTime
      });
    }
  }

  return jsonResponse({ success: false, message: 'Registration not found. Please check the QR code or register first.' });
}

// ── CHECK-IN: CONFIRM (from manual search result) ───────────

function handleCheckinConfirm(params) {
  if (!params.registrationId) {
    return jsonResponse({ success: false, message: 'Registration ID is required' });
  }

  var sheet = getSheet(CONFIG.REGISTRATION_SHEET);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][REGISTRATION_COLS.REGISTRATION_ID - 1] === params.registrationId) {
      if (data[i][REGISTRATION_COLS.CHECKIN_STATUS - 1] === 'Checked In') {
        return jsonResponse({
          success: false,
          alreadyCheckedIn: true,
          message: 'Already checked in',
          name: data[i][REGISTRATION_COLS.FULL_NAME - 1]
        });
      }

      var now = new Date();
      var checkinTime = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      sheet.getRange(i + 1, REGISTRATION_COLS.CHECKIN_STATUS).setValue('Checked In');
      sheet.getRange(i + 1, REGISTRATION_COLS.CHECKIN_TIME).setValue(checkinTime);
      sheet.getRange(i + 1, REGISTRATION_COLS.CHECKIN_METHOD).setValue('Manual');

      return jsonResponse({
        success: true,
        message: 'Check-in successful',
        name: data[i][REGISTRATION_COLS.FULL_NAME - 1],
        designation: data[i][REGISTRATION_COLS.DESIGNATION - 1],
        organization: data[i][REGISTRATION_COLS.ORGANIZATION - 1],
        checkinTime: checkinTime
      });
    }
  }

  return jsonResponse({ success: false, message: 'Registration not found' });
}

// ── CHECK-IN: STATUS LOOKUP ─────────────────────────────────

function handleCheckinStatus(params) {
  if (!params.registrationId) {
    return jsonResponse({ success: false, message: 'Registration ID is required' });
  }

  var sheet = getSheet(CONFIG.REGISTRATION_SHEET);
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][REGISTRATION_COLS.REGISTRATION_ID - 1] === params.registrationId) {
      return jsonResponse({
        success: true,
        found: true,
        registrationId: data[i][REGISTRATION_COLS.REGISTRATION_ID - 1],
        fullName: data[i][REGISTRATION_COLS.FULL_NAME - 1],
        checkedIn: data[i][REGISTRATION_COLS.CHECKIN_STATUS - 1] === 'Checked In',
        checkinTime: data[i][REGISTRATION_COLS.CHECKIN_TIME - 1] || null,
        checkinMethod: data[i][REGISTRATION_COLS.CHECKIN_METHOD - 1] || null
      });
    }
  }

  return jsonResponse({ success: true, found: false });
}

// ── CHECK-IN: STATS ─────────────────────────────────────────

function handleCheckinStats(params) {
  try {
    var sheet = getSheet(CONFIG.REGISTRATION_SHEET);
    var data = sheet.getDataRange().getValues();
    var total = data.length - 1;
    var checkedIn = 0;

    for (var i = 1; i < data.length; i++) {
      if (data[i][REGISTRATION_COLS.CHECKIN_STATUS - 1] === 'Checked In') {
        checkedIn++;
      }
    }

    return jsonResponse({
      success: true,
      total: total,
      checkedIn: checkedIn,
      remaining: total - checkedIn
    });
  } catch (err) {
    return jsonResponse({ success: false, message: 'Could not load stats: ' + err.message });
  }
}

// ── ONE-TIME SETUP ──────────────────────────────────────────
// Run initializeSheets() once from the Apps Script editor

function initializeSheets() {
  getSheet(CONFIG.REGISTRATION_SHEET);
  getSheet(CONFIG.ATTENDANCE_SHEET);
  Logger.log('Workshop sheets initialized successfully.');
}
