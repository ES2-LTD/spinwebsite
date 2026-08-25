// ============================================================
// SPIN Workshop System Configuration
// ============================================================
// This file contains shared configuration for the workshop
// registration and attendance system.
//
// DEPLOYMENT INSTRUCTIONS:
// 1. Deploy the Google Apps Script (see apps-script/workshop-backend.gs)
// 2. Copy the deployed Web App URL
// 3. Replace 'YOUR_APPS_SCRIPT_WEB_APP_URL' below with the actual URL
// 4. Do not commit the actual URL to public repositories if it contains
//    sensitive information
// ============================================================

const SPIN_WORKSHOP_CONFIG = {
  // Replace this with your deployed Google Apps Script Web App URL
  //  API_URL: 'https://script.google.com/macros/s/AKfycbx56CZkvX_CAAnDWx9Q1FEBedrWizjSVBUYOGfb0rsh9NlLTyWz5uCON8JihXSPkFGO/exec',
  API_URL: 'https://script.google.com/macros/s/AKfycbx56CZkvX_CAAnDWx9Q1FEBedrWizjSVBUYOGfb0rsh9NlLTyWz5uCON8JihXSPkFGO/exec',
  // Form types
  FORM_TYPES: {
    PRE_WORKSHOP: 'pre_workshop',
    ATTENDANCE: 'attendance',
    CHECKIN_QR: 'checkin_qr',
    CHECKIN_MANUAL: 'checkin_manual',
    CHECKIN_CONFIRM: 'checkin_confirm',
    CHECKIN_STATUS: 'checkin_status',
    CHECKIN_STATS: 'checkin_stats'
  }
};

// Make the configuration available globally
if (typeof window !== 'undefined') {
  window.SPIN_WORKSHOP_CONFIG = SPIN_WORKSHOP_CONFIG;
}