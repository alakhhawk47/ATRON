# ATRON - Smart Attendance Management System

## Problem Statement
Build ATRON, a modern SaaS web platform for smart university attendance management. Teachers create digital classrooms and start QR-based attendance sessions. Students join classes and mark attendance by scanning QR codes. System generates reports and analytics.

## Architecture
- **Frontend**: React + TailwindCSS + Shadcn/UI + Recharts
- **Backend**: FastAPI (Python) 
- **Database**: MongoDB
- **Auth**: JWT (httpOnly cookies + Bearer token)
- **QR Codes**: qrcode.react
- **Excel Export**: openpyxl

## User Personas
1. **University Teachers** - Create classes, start attendance sessions, track analytics, export reports
2. **College Students** - Join classes via codes, scan QR for attendance, track percentages
3. **Administrators** (Future) - Monitor university-wide statistics

## Core Requirements
- Teacher: Create classes, generate join codes, start QR sessions, view reports/analytics, export Excel
- Student: Join classes, scan QR attendance, view percentages and alerts
- Auth: JWT-based email/password + future Google OAuth
- Dark theme UI matching ATRON design (cyan #69daff, dark bg #0e0e0e)

## What's Been Implemented (March 2026)
- Full auth system (register, login, logout, session management)
- Teacher dashboard with stats (classes, students, attendance rate, sessions)
- Student dashboard with attendance percentages, alerts
- Class creation with auto-generated join codes
- Class joining via codes
- Attendance sessions with QR code display and live check-in feed
- Mark attendance via QR scan URL
- Reports page with student-level attendance data
- Excel export of attendance reports
- Analytics page with bar charts, pie charts, class performance
- Class management with student list and attendance percentages
- Seed data: 3 classes, 8 students, 30 attendance sessions
- Dark theme ATRON design with Plus Jakarta Sans + Manrope fonts
- Responsive layout with sidebar navigation

## Prioritized Backlog
### P0 (Critical)
- [x] Core auth flow
- [x] Teacher/Student dashboards
- [x] Class CRUD + join codes
- [x] QR attendance sessions
- [x] Reports + Excel export

### P1 (Important)
- [ ] Google OAuth integration
- [ ] Password reset flow
- [ ] Mobile-responsive QR scanner
- [ ] Email notifications for low attendance

### P2 (Nice to have)
- [ ] Admin dashboard for university-wide stats
- [ ] Department/course management
- [ ] Geofence-based attendance verification
- [ ] Attendance trends over time charts
- [ ] Student bulk import via CSV

## Next Tasks
1. Add Google OAuth login (Emergent-managed)
2. Implement password reset with email
3. Add QR scanner for students (camera-based)
4. Add more detailed analytics (weekly trends, subject comparison)
5. Settings page for profile management
