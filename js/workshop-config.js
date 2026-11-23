// ============================================================
// SPIN Workshop & Event System Configuration
// ============================================================
// This file contains shared configuration for workshop registration,
// multi-day training programs, and attendance tracking systems.
// ============================================================

// Single-Day Workshop Configuration
const SPIN_WORKSHOP_CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbx56CZkvX_CAAnDWx9Q1FEBedrWizjSVBUYOGfb0rsh9NlLTyWz5uCON8JihXSPkFGO/exec',
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

// Flexible Multi-Day Event Configuration (Dynamic Days)
const SPIN_MULTIDAY_CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbxuu_SYoZGwI7p2t7el3TlAHO9sUfjCsUBcvJQEt1c7H7Jqd2lwwlbAtFwh08yhQ-vL/exec',
  EVENT_NAME: 'SPIN Project Capacity Building & Technical Training',
  EVENT_VENUE: 'Main Auditorium, FMWRS Headquarters / Apo Training Center, Abuja'
};

// Make configurations available globally
if (typeof window !== 'undefined') {
  window.SPIN_WORKSHOP_CONFIG = SPIN_WORKSHOP_CONFIG;
  window.SPIN_MULTIDAY_CONFIG = SPIN_MULTIDAY_CONFIG;
}
