# ApplySync
AI-powered job application tracker that generates company-tailored mock interviews based on job descriptions, roles, and user resumes.


Overview

ApplySync is a full-stack web application that helps job seekers manage their job applications and prepare for interviews more effectively.

Users can track applications, store job descriptions and resumes, and generate personalized mock interviews tailored to specific companies, roles, and industries using AI.

The goal is to bridge the gap between applying and actually being prepared for the interview.

Features
-User authentication (sign up / login)
-Job application tracking dashboard
-Add, edit, and manage job applications
-Store job descriptions and notes
-Resume upload and association with applications
-AI-generated mock interviews tailored to:
-Company
-Role
-Job description
-User resume
-Multiple interview types:
-Behavioral
-Technical / role-specific
-Recruiter screening
-Answer input and AI feedback (planned)
-Interview session history (planned)
-Tech Stack

Frontend:
Next.js (React)
TypeScript
Tailwind CSS

Backend:
Next.js API routes
Node.js

Database:
PostgreSQL
Prisma ORM

Authentication:
Clerk or Auth.js (TBD)

AI Integration:
OpenAI API

Deployment:
Vercel (frontend + API)
Supabase or Railway (database)

How It Works:
User creates an account and logs in
User adds a job application with:
Company name
Role
Job description
Resume
The system analyzes the application data
User generates a mock interview for that specific application
AI creates tailored interview questions based on:
Role requirements
Company context
Resume experience
User practices and (eventually) receives feedback

MVP Goals:
Authentication
Create and manage job applications
Dashboard view of applications
Application detail page
Generate mock interview questions
Store interview sessions
Future Improvements
AI feedback on answers
Resume-job match scoring
Company-specific interview insights
Interview performance analytics
Voice-based mock interviews
Mobile responsiveness improvements

Getting Started:
Prerequisites:
Node.js
npm or yarn
PostgreSQL database

Installation:
git clone https://github.com/your-username/applysync.git
cd applysync
npm install
Run the development server
npm run dev
Team
Developer 1: Backend, database design, AI integration
Developer 2: Frontend, UI/UX, user flows

Why This Project:
Job seekers often apply to dozens of roles but struggle to prepare for interviews in a targeted way.

ApplySync solves this by combining:
-application tracking
-resume context
-job-specific interview preparation into one platform.

License:
MIT License
