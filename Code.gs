// ============================================================
//  SPIN PROJECT — Grievance Redress Mechanism (GRM)
//  Google Apps Script Backend
//  Paste this entire file into your Apps Script editor,
//  then deploy as a Web App (Execute as: Me, Who has access: Anyone)
// ============================================================

// ── CONFIGURATION ────────────────────────────────────────────
// Set these in Apps Script → Project Settings → Script Properties
// Key: ADMIN_USERNAME   Value: your chosen username
// Key: ADMIN_PASSWORD   Value: your chosen password
// (Do NOT hardcode them here)

// Notification emails — edit this list as needed
var NOTIFICATION_EMAILS = [
  "spinproject25@gmail.com",
  "mmargungu@gmail.com",
  "spin@es2.com.ng",
  "ijeomacogili@yahoo.com"
];

// Your Google Spreadsheet ID (from the URL)
var SPREADSHEET_ID = "1H0KHWMnLYJtSnmfRPsOcoxo6mSgl7iugwLRgWpdD_G8";

// The name of the sheet tab inside your Google Spreadsheet
var SHEET_NAME = "GRM Log";

// ── COLUMN MAP ───────────────────────────────────────────────
var COLS = {
  SN:           1,
  STATE:        2,
  DATETIME:     3,
  GRIEVANCE_NO: 4,
  NAME:         5,
  PHONE:        6,
  EMAIL:        7,
  MEDIUM:       8,
  NATURE:       9,
  DETAILS:      10,
  ACTION:       11,
  STATUS:       12,
  REMARK:       13
};

// ── HELPERS ──────────────────────────────────────────────────

function getSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Write header row
    sheet.appendRow([
      "S/N", "Name of State", "Date & Time", "Grievance No.",
      "Name of Grievant", "Phone", "Email",
      "Medium of Communication", "Nature of Grievance",
      "Detail of Grievance", "Action Taken and Date",
      "Status (Open/In Progress/Closed)", "Remark"
    ]);
    sheet.getRange(1, 1, 1, 13).setFontWeight("bold");
  }
  return sheet;
}

function generateGrievanceNo(sn) {
  var now = new Date();
  var yr  = now.getFullYear();
  var mo  = String(now.getMonth() + 1).padStart(2, "0");
  return "GRM-" + yr + mo + "-" + String(sn).padStart(4, "0");
}

function checkAuth(user, pass) {
  var props = PropertiesService.getScriptProperties();
  var storedUser = props.getProperty("ADMIN_USERNAME");
  var storedPass = props.getProperty("ADMIN_PASSWORD");
  return (user === storedUser && pass === storedPass);
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── SEND NOTIFICATION EMAIL ───────────────────────────────────

function sendNotificationEmail(data, grievanceNo) {
  var subject = "🔔 New Grievance Submitted — " + grievanceNo + " (" + data.state + ")";

  var body = [
    "A new grievance has been submitted on the SPIN Project GRM portal.",
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "GRIEVANCE DETAILS",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Grievance No.   : " + grievanceNo,
    "Date & Time     : " + new Date().toLocaleString("en-NG"),
    "State           : " + data.state,
    "Nature          : " + data.nature,
    "Medium          : " + data.medium,
    "",
    "DETAILS OF GRIEVANCE:",
    data.details,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "GRIEVANT CONTACT (confidential)",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Name  : " + data.name,
    "Phone : " + (data.phone  || "Not provided"),
    "Email : " + (data.email  || "Not provided"),
    "",
    "Please log into the SPIN GRM Admin Dashboard to review and update the status.",
    "",
    "— SPIN Project GRM System"
  ].join("\n");

  NOTIFICATION_EMAILS.forEach(function(recipient) {
    try {
      GmailApp.sendEmail(recipient, subject, body);
    } catch(e) {
      Logger.log("Failed to email " + recipient + ": " + e.message);
    }
  });
}

// ── HANDLE POST (form submission & status updates) ────────────

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var action = params.action || "submit";

    // ── Submit a new grievance ──
    if (action === "submit") {
      var sheet = getSheet();
      var lastRow = sheet.getLastRow();
      var sn = lastRow; // row 1 = header, so lastRow = count of data rows
      var grievanceNo = generateGrievanceNo(sn);
      var now = new Date();

      sheet.appendRow([
        sn,
        params.state,
        Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
        grievanceNo,
        params.name,
        params.phone  || "",
        params.email  || "",
        params.medium,
        params.nature,
        params.details,
        "",          // Action Taken (empty on submission)
        "Open",      // Default status
        ""           // Remark
      ]);

      sendNotificationEmail(params, grievanceNo);

      return jsonResponse({ success: true, grievanceNo: grievanceNo });
    }

    // ── Update status (admin only) ──
    if (action === "updateStatus") {
      if (!checkAuth(params.user, params.pass)) {
        return jsonResponse({ success: false, error: "Unauthorized" });
      }
      var sheet = getSheet();
      var data  = sheet.getDataRange().getValues();
      // Find row by grievance number (column 4, index 3)
      for (var i = 1; i < data.length; i++) {
        if (data[i][COLS.GRIEVANCE_NO - 1] === params.grievanceNo) {
          var row = i + 1;
          if (params.status)  sheet.getRange(row, COLS.STATUS).setValue(params.status);
          if (params.action)  sheet.getRange(row, COLS.ACTION).setValue(params.action);
          if (params.remark !== undefined) sheet.getRange(row, COLS.REMARK).setValue(params.remark);
          return jsonResponse({ success: true });
        }
      }
      return jsonResponse({ success: false, error: "Grievance not found" });
    }

    return jsonResponse({ success: false, error: "Unknown action" });

  } catch(err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// ── HANDLE GET (data retrieval) ───────────────────────────────

function doGet(e) {
  var action = e.parameter.action || "getPublic";

  // ── Public tracker: returns only anonymous summary ──
  if (action === "getPublic") {
    var sheet = getSheet();
    var data  = sheet.getDataRange().getValues();
    var rows  = [];
    for (var i = 1; i < data.length; i++) {
      rows.push({
        grievanceNo: data[i][COLS.GRIEVANCE_NO - 1],
        state:       data[i][COLS.STATE       - 1],
        nature:      data[i][COLS.NATURE      - 1],
        date:        data[i][COLS.DATETIME    - 1],
        status:      data[i][COLS.STATUS      - 1]
      });
    }
    return jsonResponse({ success: true, data: rows });
  }

  // ── Admin: full data ──
  if (action === "getAll") {
    var user = e.parameter.user;
    var pass = e.parameter.pass;
    if (!checkAuth(user, pass)) {
      return jsonResponse({ success: false, error: "Unauthorized" });
    }
    var sheet = getSheet();
    var data  = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var obj = {};
      headers.forEach(function(h, idx) { obj[h] = data[i][idx]; });
      rows.push(obj);
    }
    return jsonResponse({ success: true, data: rows });
  }

  // ── Admin login check ──
  if (action === "login") {
    var user = e.parameter.user;
    var pass = e.parameter.pass;
    var ok   = checkAuth(user, pass);
    return jsonResponse({ success: ok });
  }

  return jsonResponse({ success: false, error: "Unknown action" });
}

// ── ONE-TIME SETUP (run manually once) ───────────────────────
// Open Apps Script editor → Run → runSetup
// This sets your admin username and password.
// Change the values below before running!

function runSetup() {
  var props = PropertiesService.getScriptProperties();
  props.setProperty("ADMIN_USERNAME", "spinadmin");     // ← change this
  props.setProperty("ADMIN_PASSWORD", "ChangeMe2025!"); // ← change this
  Logger.log("✅ Admin credentials saved. Update them before going live.");

  // Also ensure the sheet header row exists
  getSheet();
  Logger.log("✅ Sheet initialized.");
}
