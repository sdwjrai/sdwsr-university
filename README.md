# 🎓 SDWSR University - Complete Online Learning Platform

## 📌 Project Overview

SDWSR University is a fully functional online university website built with HTML, CSS, JavaScript, and Supabase. It features a complete student registration system, course management, admin dashboard, and detailed course pages for various programming topics.

**Founded:** May 6, 2025  
**Motto:** "Free the mind with free education at S.U.D"

---

## ✨ Features

### For Students
- 📚 Browse course catalog with filtering by level
- 📝 Register as a new student
- 🎯 Enroll in courses
- 📊 View real-time student and course counts
- 📖 Access detailed course information pages

### For Administrators
- 🔐 Secure admin login (password: sdwsr2025)
- 👥 View all registered students
- 📚 Manage course catalog
- 📝 Track student enrollments
- ➕ Add new courses to the system
- 🗑️ Delete students, courses, or enrollments

---

## 🗂️ Project Structure
sdwsr-university/
├── index.html # Homepage with stats
├── courses.html # Course catalog with enrollment
├── register.html # Student registration form
├── admin.html # Admin dashboard
├── supabase.html # Supabase course page
├── react.html # React.js course page
├── postgre.html # PostgreSQL course page
├── cplusplus.html # C++ programming course
├── web.html # Web development course
├── sdwjr.html # SDWJR Classroom page
├── style.css # Global styles
├── script.js # Database connection & logic
└── README.md # Project documentation

text

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure |
| CSS3 | Styling & responsive design |
| JavaScript | Interactivity & API calls |
| Supabase | Backend database |
| GitHub | Version control |
| Vercel | Deployment |

---

## 🗄️ Database Schema

### Students Table
```sql
- id (SERIAL PRIMARY KEY)
- name (TEXT NOT NULL)
- email (TEXT UNIQUE NOT NULL)
- dob (DATE)
- country (TEXT)
- referral_source (TEXT)
- registered_at (TIMESTAMPTZ)
Courses Table
sql
- id (SERIAL PRIMARY KEY)
- title (TEXT NOT NULL)
- description (TEXT)
- level (TEXT: beginner/intermediate/advanced)
- duration (INTEGER)
- instructor (TEXT)
- created_at (TIMESTAMPTZ)
Enrollments Table
sql
- id (SERIAL PRIMARY KEY)
- student_id (INTEGER REFERENCES students)
- course_id (INTEGER REFERENCES courses)
- enrolled_at (TIMESTAMPTZ)
🚀 Deployment Instructions
Prerequisites
GitHub account

Supabase account

Vercel account

Step 1: Set Up Supabase Database
Create a new Supabase project

Go to SQL Editor → New Query

Run the SQL schema (provided in the documentation)

Copy your Project URL and Anon Key

Step 2: Configure Database Connection
Open script.js and replace:

javascript
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
Step 3: Deploy to GitHub
Create a new repository on GitHub

Upload all 12 files

Commit changes

Step 4: Deploy to Vercel
Go to vercel.com

Import your GitHub repository

Click Deploy

Your site is live at: https://sdwsr-university.vercel.app

🔐 Admin Access
Credential	Value
Password	sdwsr2025
Access URL	/admin.html
📱 Pages & Navigation
Page	URL	Description
Home	/index.html	University homepage with stats
Courses	/courses.html	Browse and enroll in courses
Register	/register.html	New student registration
Admin	/admin.html	Manage everything
Supabase	/supabase.html	Supabase course info
React	/react.html	React.js course info
PostgreSQL	/postgre.html	Database course info
C++	/cplusplus.html	Programming course
Web Dev	/web.html	Web development course
SDWJR	/sdwjr.html	Classroom community
📧 Contact Information
Phone: (347) 640-4912

Email: sdwsrsdwjr@gmail.com

Founded: May 6, 2025

📄 License
© 2026 ALL RIGHTS RESERVED | SDWSR University of Database & AI

🙏 Acknowledgments
Unsplash for stock images

Supabase for backend infrastructure

Vercel for hosting

GitHub for version control

🎯 Quick Start Commands
bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sdwsr-university.git

# Navigate to project
cd sdwsr-university

# Open in browser (double-click index.html)
# Or use Live Server in VS Code
✅ Checklist Before Going Live
Supabase project created

Database tables created

Supabase keys added to script.js

Files uploaded to GitHub

Deployed on Vercel

Admin login works

Student registration works

Course enrollment works

All 10 navigation links work

🎉 Congratulations! Your university website is now live!
