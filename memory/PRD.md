# ATRON - Smart Attendance Management System
## Product Requirements Document

### Problem Statement
Build a smart university attendance management system (ATRON) that prevents proxy attendance using QR codes and digital sessions. UI must match the exact Stitch design provided by the user.

### Architecture
- **Frontend**: React + TailwindCSS (dark theme, glass morphism, Material Symbols Outlined)
- **Backend**: FastAPI + Motor (async MongoDB driver)
- **Database**: MongoDB (users, classes, class_members, attendance_sessions, attendance_records)
- **Auth**: JWT-based with bcrypt password hashing

### User Personas
1. **Teachers** - Create classes, start QR attendance sessions, view reports/analytics
2. **Students** - Join classes, scan QR codes to mark attendance, track percentage
3. **Admins** (future) - Monitor university stats, manage departments

### Core Requirements (Static)
- Class creation with auto-generated 6-digit codes
- QR-based attendance sessions with live check-in feed
- Role-based dashboards (teacher/student)
- Attendance reports with Excel export
- Analytics with weekly trends and subject comparisons

### What's Been Implemented (April 2, 2026)
- Full backend API: auth, classes, attendance, reports, analytics
- Complete UI reskin matching Stitch design (dark theme, cyan/amber/red palette)
- 15 pages: Landing, Login, Signup, Teacher Dashboard, Student Dashboard, Create Class, Join Class, Attendance Session, Mark Attendance, Class Management, Reports, Analytics
- Glass morphism effects, Material Symbols Outlined icons
- QR code generation with canvas
- Excel export functionality
- Testing: 100% backend (18/18), 100% frontend flows

### Prioritized Backlog
- **P0**: All core features implemented
- **P1**: Google OAuth integration, Admin dashboard
- **P2**: Geo-fencing for attendance verification, Push notifications
- **P3**: Mobile-responsive PWA, LMS/ERP integration

### Next Tasks
1. Add Google OAuth for social login
2. Build Admin dashboard for university statistics
3. Add attendance alerts (email/push notifications)
4. Implement geo-fencing for proximity verification
