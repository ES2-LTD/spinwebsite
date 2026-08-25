# SPIN Workshop Registration & Attendance System

This system provides a branded SPIN website experience for workshop registration and attendance tracking, replacing Google Forms with a custom solution integrated with Google Sheets via Google Apps Script.

## Architecture

```
SPIN Static Website
        ↓
Custom HTML Forms (workshop-registration.html, workshop-attendance.html)
        ↓
JavaScript fetch() → Google Apps Script Web App
        ↓
Google Sheets (Registrations & Attendance tabs)
```

## Features

- **Pre-Workshop Registration**: Collect attendee information before the event
- **Event Day Attendance**: Record attendance with acknowledgment confirmation
- **Duplicate Prevention**: Email-based duplicate detection for both registration and attendance
- **Professional UI**: Branded SPIN design following existing site patterns
- **Mobile-First**: Responsive design optimized for all screen sizes
- **Server-Side Validation**: Comprehensive validation in Google Apps Script
- **Secure**: No direct Google Sheets access from frontend, no exposed credentials

## Files Created

### Frontend Files
- `workshop-registration.html` - Pre-workshop registration page
- `workshop-attendance.html` - Event day attendance page
- `js/workshop-config.js` - Shared configuration for API endpoint

### Backend Files
- `apps-script/workshop-backend.gs` - Google Apps Script backend
- `apps-script/README.md` - This documentation file

## Deployment Instructions

### Step 1: Set Up Google Sheets

1. Create a new Google Spreadsheet
2. Rename the default sheet to "Registrations"
3. Add a second sheet and name it "Attendance"
4. The Apps Script will automatically create headers if the sheets are empty
5. Note the Spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

### Step 2: Deploy Google Apps Script

1. Open your Google Spreadsheet
2. Go to **Extensions > Apps Script**
3. Delete any existing code and paste the contents of `apps-script/workshop-backend.gs`
4. **IMPORTANT**: Update the `CONFIG` section at the top of the file:
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'YOUR_ACTUAL_SPREADSHEET_ID', // Replace with your spreadsheet ID
     REGISTRATION_SHEET: 'Registrations',
     ATTENDANCE_SHEET: 'Attendance'
   };
   ```
5. Save the script (Ctrl+S or Cmd+S)
6. Run the `initializeSheets` function once to set up the sheet headers:
   - Select `initializeSheets` from the function dropdown
   - Click "Run"
   - Grant the necessary permissions when prompted
7. Deploy as Web App:
   - Click **Deploy > New deployment**
   - Select type: **Web app**
   - Description: "SPIN Workshop System"
   - Execute as: **Me** (your email)
   - Who has access: **Anyone** (this is required for public form submissions)
   - Click **Deploy**
   - Copy the Web App URL (it will look like: `https://script.google.com/macros/s/.../exec`)

### Step 3: Configure Frontend

1. Open `js/workshop-config.js`
2. Replace the placeholder URL with your deployed Web App URL:
   ```javascript
   const SPIN_WORKSHOP_CONFIG = {
     API_URL: 'https://script.google.com/macros/s/YOUR_ACTUAL_WEB_APP_ID/exec',
     FORM_TYPES: {
       PRE_WORKSHOP: 'pre_workshop',
       ATTENDANCE: 'attendance'
     }
   };
   ```
3. Save the file

### Step 4: Test the System

1. Open `workshop-registration.html` in a browser
2. Fill out the registration form and submit
3. Check your Google Spreadsheet "Registrations" sheet for the entry
4. Open `workshop-attendance.html` in a browser
5. Fill out the attendance form and submit
6. Check your Google Spreadsheet "Attendance" sheet for the entry
7. Test duplicate prevention by trying to submit the same email twice

### Step 5: Deploy to Production

1. Upload the HTML files to your SPIN website hosting
2. Ensure the `js/workshop-config.js` file is also uploaded
3. Test the live URLs to ensure everything works
4. Update any internal links or navigation as needed

## QR Code Generation

Generate QR codes pointing to your workshop pages:

### Pre-Workshop Registration QR
- URL: `https://your-spin-website.com/workshop-registration.html`
- Use any QR code generator to create the QR code
- Print and display at pre-event locations

### Attendance QR
- URL: `https://your-spin-website.com/workshop-attendance.html`
- Use any QR code generator to create the QR code
- Print and display at the event entrance for check-in

## Google Sheet Structure

### Registrations Sheet
| Timestamp | Registration ID | Full Name | Designation / Job Title | Organization / Ministry / Department | Email Address | Phone Number |
|-----------|-----------------|-----------|-------------------------|--------------------------------------|---------------|--------------|

### Attendance Sheet
| Timestamp | Attendance ID | Full Name | Designation / Job Title | Organization / Ministry / Department | Email Address | Phone Number | Attendance Acknowledged |
|-----------|---------------|-----------|-------------------------|--------------------------------------|---------------|--------------|------------------------|

## API Endpoints

### POST / (Web App URL)

Accepts JSON payloads for form submissions.

#### Registration Payload
```json
{
  "type": "pre_workshop",
  "fullName": "John Doe",
  "designation": "Director",
  "organization": "Federal Ministry of Water Resources",
  "email": "john@example.com",
  "phone": "08012345678"
}
```

#### Attendance Payload
```json
{
  "type": "attendance",
  "fullName": "John Doe",
  "designation": "Director",
  "organization": "Federal Ministry of Water Resources",
  "email": "john@example.com",
  "phone": "08012345678",
  "acknowledgedAttendance": true
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Registration submitted successfully",
  "id": "SPIN-REG-202608-0001"
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Required fields are missing"
}
```

### GET / (Web App URL)

Returns API status for testing purposes.

```json
{
  "success": true,
  "message": "SPIN Workshop System API is running",
  "timestamp": "2026-08-24T12:00:00.000Z"
}
```

## Security Considerations

- **No Direct Sheet Access**: Frontend never connects directly to Google Sheets
- **No Exposed Credentials**: Spreadsheet ID and Web App URL are the only sensitive values
- **Server-Side Validation**: All validation happens in Google Apps Script
- **Duplicate Prevention**: Backend checks for duplicates before submission
- **Required Acknowledgment**: Attendance form requires explicit acknowledgment
- **Email Validation**: Server-side email format validation

## Maintenance

### Updating the Web App
If you need to update the Apps Script code:
1. Make changes in the Apps Script editor
2. Click **Deploy > Manage deployments**
3. Edit the existing deployment
4. Update the version
5. The Web App URL remains the same

### Monitoring Submissions
Regularly check your Google Sheets for:
- New registrations
- Attendance records
- Any potential issues or duplicate attempts

### Backup Data
Consider setting up automatic backups of your Google Spreadsheet to prevent data loss.

## Troubleshooting

### Form submissions not appearing in Google Sheets
- Verify the Web App URL in `js/workshop-config.js` is correct
- Check the Apps Script deployment settings (Execute as: Me, Who has access: Anyone)
- Check the browser console for JavaScript errors
- Verify the CONFIG section in the Apps Script has the correct Spreadsheet ID

### CORS errors
- The current implementation uses `mode: 'no-cors'` which should work for most cases
- If you need proper CORS responses, consider using a proxy or updating the Apps Script to return proper CORS headers

### Duplicate prevention not working
- Ensure the email field is being properly normalized (lowercase, trimmed)
- Check that the sheet headers match the expected column names
- Verify the duplicate checking logic in the Apps Script

## Responsive Testing

Test the pages at these breakpoints:
- **Mobile**: 375px wide
- **Tablet**: 768px wide
- **Small Desktop**: 1024px wide
- **Desktop**: 1280px wide and above

Ensure:
- Forms are easy to use on mobile
- No horizontal scrolling
- Touch targets are appropriately sized
- Navigation works correctly on all screen sizes

## Customization

### Changing Form Fields
To add or modify form fields:
1. Update the HTML forms in both `workshop-registration.html` and `workshop-attendance.html`
2. Update the column maps in `apps-script/workshop-backend.gs`
3. Update the validation logic in the Apps Script
4. Re-run `initializeSheets` to update sheet headers

### Changing Styling
The forms use existing SPIN site styles from `style.css`. To customize:
- Modify the form-specific classes in the HTML files
- Add new styles to `style.css` following the existing pattern
- Use the existing SPIN green (#008C5A) and lime (#aaff33) colors

## Support

For issues or questions:
- Check the Google Apps Script execution logs
- Verify browser console for JavaScript errors
- Ensure all configuration values are correct
- Test the Web App URL directly in a browser

## License

This system is part of the SPIN Project website. Follow the repository's existing license and contribution guidelines.