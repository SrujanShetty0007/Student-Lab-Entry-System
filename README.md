# MITK Lab Entry System

A comprehensive web-based laboratory entry management system for Moodlakatte Institute of Technology, Kundapura. This system allows students to record their lab entries and provides administrators with tools to view, manage, and export entry data.

## Features

### Student Features
- **Lab Entry Form**: Simple form to record name, USN, semester, entry date, and time
- **Auto Date/Time**: Automatically sets current date and time as defaults
- **Recent Entries Display**: Shows last 5 entries on the homepage
- **Responsive Design**: Works on desktop and mobile devices

### Administrator Features
- **Admin Panel**: Dashboard with entry statistics and management tools
- **Student Entries View**: Complete table view of all lab entries
- **Search & Filter**: Filter entries by name, USN, or semester
- **Export Data**: Download entries as CSV file
- **Delete Entries**: Remove individual entries from the system

## System Architecture

### Frontend Files
- `index.html` - Main lab entry form page
- `admin_panel.html` - Administrator dashboard
- `student_entries.html` - Complete entries management page
- `script.js` - Main form functionality and navigation
- `student_entries.js` - Entries display, filtering, and management
- `assets/style.css` - Homepage styling
- `assets/admin_panel.css` - Admin panel styling
- `assets/student_entries.css` - Entries page styling

### Backend Integration
- Google Apps Script for data storage and retrieval
- Google Sheets as the database backend
- RESTful API endpoints for CRUD operations

## Prerequisites

### Google Sheet Setup
Your Google Sheet must have these exact columns in order:
- **Column A:** NAME
- **Column B:** USN  
- **Column C:** SEMESTER
- **Column D:** ENTRY DATE
- **Column E:** ENTRY TIME

## Setup Instructions

### 1. Google Apps Script Setup
1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. Replace the default code with code from `Apps_Scripts` file
4. Save the project with a meaningful name
5. Run the `initialSetup()` function once to link the script to your sheet

### 2. Deploy Web App
1. In Apps Script, click **Deploy → New deployment**
2. Choose type: **Web app**
3. Set "Execute as": **Me**
4. Set "Who has access": **Anyone**
5. Click **Deploy** and authorize permissions
6. Copy the provided Web App URL

### 3. Update Frontend Configuration
1. Open `script.js` and locate the `scriptURL` constant
2. Replace the existing URL with your Web App URL
3. Open `student_entries.js` and update the `scriptURL` constant with the same URL

### 4. Test the System
1. Open `index.html` in a web browser
2. Fill out and submit the lab entry form
3. Check your Google Sheet to verify data was recorded
4. Test the admin panel at `admin_panel.html`
5. Test the entries management at `student_entries.html`

## Usage Guide

### For Students
1. Navigate to the homepage (`index.html`)
2. Fill in your details:
   - Name
   - USN (University Seat Number)
   - Semester
   - Entry Date (auto-filled with today's date)
   - Entry Time (auto-filled with current time)
3. Click "Entry Now!" to submit
4. View recent entries in the sidebar

### For Administrators
1. Navigate to the admin panel (`admin_panel.html`)
2. View system statistics and total entries
3. Use "View All Entries" to see the complete entries table
4. In the entries view:
   - Search by name or USN
   - Filter by semester
   - Export data as CSV
   - Delete individual entries as needed

## API Endpoints

The Google Apps Script provides these endpoints:
- `GET ?action=getEntries` - Retrieve all entries
- `POST action=deleteEntry&row=X` - Delete entry at row X
- `POST` (default) - Add new entry

## Data Flow

1. **Entry Submission**: Form data → Google Apps Script → Google Sheets
2. **Data Retrieval**: Frontend → Google Apps Script → Google Sheets → JSON response
3. **Entry Management**: Admin actions → Google Apps Script → Google Sheets updates

## File Structure
```
├── index.html                 # Main entry form
├── admin_panel.html          # Administrator dashboard  
├── student_entries.html      # Entries management page
├── script.js                 # Main form logic
├── student_entries.js        # Entries display & management
├── Apps_Scripts              # Google Apps Script code
├── assets/
│   ├── style.css            # Homepage styles
│   ├── admin_panel.css      # Admin panel styles
│   └── student_entries.css  # Entries page styles
├── README.md                # This file
└── SETUP_INSTRUCTIONS.md    # Detailed setup guide
```

## Troubleshooting

### Common Issues
- **Form not submitting**: Check if the Web App URL is correctly set in both `script.js` and `student_entries.js`
- **Data not appearing**: Verify Google Apps Script permissions and deployment settings
- **Time display issues**: Ensure the `formatTime()` function in Apps Script is working correctly

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers supported
- JavaScript must be enabled

## Security Notes
- No authentication required for basic entry submission
- Admin panel has no login protection (direct access)
- Google Apps Script handles data validation and storage
- All data is stored in your private Google Sheet

## Lab Information
- **Institution**: Moodlakatte Institute of Technology, Kundapura
- **Lab**: LAB-201-MITK
- **Hours**: 9:00 AM – 5:00 PM