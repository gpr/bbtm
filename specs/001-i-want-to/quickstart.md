# Quickstart: Blood Bowl Tournament Management System

**Date**: 2025-09-20
**Feature**: Blood Bowl Tournament Management System
**Phase**: 1 - Implementation Quickstart Guide

## Overview
This quickstart guide validates the core user scenarios and provides step-by-step instructions for testing the Blood Bowl tournament management system functionality.

## Prerequisites
- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Git repository cloned
- Firebase project created

## Setup Instructions

### 1. Environment Setup
```bash
# Clone repository
git clone <repository-url>
cd bbtm

# Install dependencies
npm install

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init
# Select: Hosting, Firestore, Authentication
```

### 2. Firebase Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Add Firebase configuration to .env.local
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Development Server
```bash
# Start development server
npm run dev

# Start Firebase emulators (separate terminal)
firebase emulators:start
```

## Core User Scenarios

### Scenario 1: User Registration and Tournament Creation

**Objective**: Verify that a new user can register and create a tournament

**Steps**:
1. **Navigate to application**
   - Open browser to `http://localhost:5173`
   - Verify landing page loads

2. **Register new user account**
   - Click "Register" button
   - Fill registration form:
     - Email: `organizer@example.com`
     - Password: `SecurePass123!`
     - Display Name: `Tournament Organizer`
   - Click "Create Account"
   - **Expected**: User is logged in and redirected to dashboard

3. **Create new tournament**
   - Click "Create Tournament" button
   - Fill tournament form:
     - Name: `Blood Bowl Championship 2025`
     - Description: `Annual championship tournament`
     - Max Participants: `16`
     - Registration Deadline: `2025-12-01`
     - Start Date: `2025-12-15`
     - Is Public: `true`
   - Click "Create Tournament"
   - **Expected**: Tournament created and visible in organizer's dashboard

4. **Verify tournament details**
   - Click on created tournament
   - **Expected**: Tournament details page shows correct information
   - **Expected**: Registration is open
   - **Expected**: Participant count is 0

### Scenario 2: Registered User Coach Registration

**Objective**: Verify that a registered user can register as a coach for a tournament

**Steps**:
1. **Register second user account**
   - Open new incognito window to `http://localhost:5173`
   - Register with:
     - Email: `coach1@example.com`
     - Password: `CoachPass123!`
     - Display Name: `Blood Bowl Coach`

2. **Browse public tournaments**
   - Navigate to "Browse Tournaments"
   - **Expected**: See "Blood Bowl Championship 2025" tournament
   - Click "View Details"

3. **Register as coach**
   - Click "Register for Tournament"
   - Fill registration form:
     - Alias: `BloodBowlPro`
     - Email: `coach1@example.com` (auto-filled)
     - Team Race: `Human`
     - Full Name: `John Smith`
     - NAF Number: `12345`
     - Team Name: `Reikland Reavers`
   - Click "Register"
   - **Expected**: Registration successful confirmation
   - **Expected**: Email confirmation sent (if configured)

4. **Verify registration**
   - **Expected**: Tournament participant count increases to 1
   - **Expected**: Coach can view their registration details
   - **Expected**: Coach cannot register again for same tournament

### Scenario 3: Anonymous Coach Registration

**Objective**: Verify that anonymous users can register for tournaments without creating accounts

**Steps**:
1. **Access anonymous registration**
   - Open new incognito window to `http://localhost:5173`
   - Navigate to tournament details (without logging in)
   - Click "Register Anonymously"

2. **Fill anonymous registration form**
   - Alias: `GreenOrcSlayer`
   - Email: `anonymous.coach@example.com`
   - Team Race: `Orc`
   - Full Name: `` (leave empty)
   - NAF Number: `` (leave empty)
   - Team Name: `Da Green Smashers`
   - Click "Register"

3. **Verify anonymous registration**
   - **Expected**: Registration successful without account creation
   - **Expected**: Tournament participant count increases to 2
   - **Expected**: Confirmation page shows registration details

### Scenario 4: Tournament Management by Organizer

**Objective**: Verify that tournament organizers can view and manage registrations

**Steps**:
1. **Login as organizer**
   - Login with `organizer@example.com`
   - Navigate to tournament dashboard

2. **View tournament registrations**
   - Click on "Blood Bowl Championship 2025"
   - Click "Manage Registrations" tab
   - **Expected**: See 2 registrations (BloodBowlPro and GreenOrcSlayer)
   - **Expected**: See all registration details

3. **Update registration status**
   - Change BloodBowlPro status to "Confirmed"
   - Change GreenOrcSlayer status to "Confirmed"
   - **Expected**: Status updates saved successfully

4. **Export registration list**
   - Click "Export to CSV"
   - **Expected**: CSV file downloads with registration data

### Scenario 5: Error Handling and Validation

**Objective**: Verify that proper validation and error handling work correctly

**Steps**:
1. **Test duplicate alias registration**
   - Try to register with alias "BloodBowlPro" (already used)
   - **Expected**: Error message "Alias already taken for this tournament"

2. **Test invalid email format**
   - Try to register with email "invalid-email"
   - **Expected**: Error message "Please enter a valid email address"

3. **Test registration for closed tournament**
   - As organizer, close tournament registration
   - Try to register as new coach
   - **Expected**: Error message "Registration is closed for this tournament"

4. **Test tournament capacity limits**
   - Set tournament max participants to 2
   - Try to register a third coach
   - **Expected**: Error message "Tournament is full" or coach added to waitlist

## Performance Validation

### Load Time Requirements
- **Landing page**: < 2 seconds
- **Tournament list**: < 3 seconds
- **Registration form**: < 1 second

### Responsiveness Requirements
- Test on mobile viewport (375px width)
- Test on tablet viewport (768px width)
- Test on desktop viewport (1200px width)
- **Expected**: All layouts render correctly

## Data Validation Tests

### Tournament Creation Validation
```bash
# Test required fields
- Name: Required, min 3 characters, max 200 characters
- Organizer: Automatically set to current user
- Max Participants: Optional, must be positive integer
- Dates: Start date must be after registration deadline

# Test optional fields
- Description: Max 1000 characters
- Registration deadline: Must be future date
```

### Coach Registration Validation
```bash
# Test required fields
- Alias: Required, 2-50 characters, unique per tournament
- Email: Required, valid email format
- Team Race: Required, must be valid enum value

# Test optional fields
- Full Name: Max 100 characters
- NAF Number: Numeric only, optional
- Team Name: Max 100 characters
```

## Security Tests

### Authentication Tests
```bash
# Test protected routes
- Dashboard access without login: Redirect to login
- Tournament creation without auth: 401 error
- Other user's tournament editing: 403 error

# Test data access
- Users can only see their own tournaments
- Only organizers can see full registration lists
- Anonymous users can only register, not view registrations
```

### Data Privacy Tests
```bash
# Test data visibility
- Personal emails not visible to other coaches
- Full names only visible to organizers
- Anonymous registrations properly flagged
```

## Success Criteria

### Functional Requirements Validation
- ✅ FR-001: Users can register accounts or use anonymous forms
- ✅ FR-002: Registered users can create tournaments
- ✅ FR-003: Coaches can register using accounts or anonymous forms
- ✅ FR-004: Mandatory fields (alias, email, team race) are enforced
- ✅ FR-005: Optional fields are properly captured
- ✅ FR-006: Email validation works correctly
- ✅ FR-007: Duplicate aliases are prevented
- ✅ FR-008: All data is persisted correctly
- ✅ FR-009: Organizers can view registered coaches
- ✅ FR-010: User authentication works properly

### Performance Requirements
- ✅ Page load times under targets
- ✅ Form submissions under 500ms
- ✅ Responsive design on all screen sizes

### User Experience Requirements
- ✅ Clear navigation and user flows
- ✅ Helpful error messages
- ✅ Confirmation feedback for actions
- ✅ Accessible form controls

## Troubleshooting

### Common Issues
1. **Firebase connection errors**
   - Check Firebase configuration in .env.local
   - Verify Firebase project permissions

2. **Emulator not starting**
   - Check port availability (9099, 8080, 4000)
   - Update Firebase CLI to latest version

3. **Authentication not working**
   - Verify Firebase Auth is enabled in console
   - Check CORS settings for localhost

4. **Data not persisting**
   - Verify Firestore rules allow writes
   - Check browser console for errors

### Debug Commands
```bash
# Check Firebase status
firebase projects:list

# Test Firestore rules
firebase firestore:rules:test

# View emulator logs
firebase emulators:start --debug

# Check application logs
npm run dev -- --debug
```

This quickstart guide ensures all core functionality works correctly and provides a foundation for further development and testing.