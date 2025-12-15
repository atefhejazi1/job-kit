# Job Kit

A modern full-stack job matching platform built with **Next.js 16**, **Prisma 5**, **PostgreSQL**, and **TypeScript**. The application supports both **job seekers** and **companies** with features for job browsing, resume building, applications management, and company dashboards.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Installation & Database Setup](#installation--database-setup)
- [Development](#development)
- [Database Management](#database-management)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### For Job Seekers

- **User Authentication**: Secure login and registration with bcryptjs password hashing
- **Resume Builder**: Create and manage multiple resumes with sections for education, experience, and projects
- **Job Search**: Browse and filter available job listings
- **Job Applications**: Apply directly to jobs from the platform
- **User Dashboard**: View application status and manage profile

### For Companies

- **Company Registration**: Create and manage company profiles
- **Job Posting**: Post and manage job listings with detailed requirements
- **Application Management**: View and manage all incoming job applications
- **Analytics Dashboard**: Track job postings and application metrics
- **Company Settings**: Update company information and branding

### General

- **Resume Preview**: Real-time resume preview with professional formatting
- **Logo Upload**: Cloudinary integration for company logo uploads
- **Responsive Design**: Tailwind CSS for mobile-friendly UI
- **Type Safety**: Full TypeScript support throughout the stack

## 🛠 Tech Stack

| Layer              | Technology                    |
| ------------------ | ----------------------------- |
| **Framework**      | Next.js 16.0.1                |
| **Runtime**        | Node.js (TypeScript)          |
| **Database**       | PostgreSQL with Prisma v5     |
| **Styling**        | Tailwind CSS v4 + PostCSS     |
| **Authentication** | bcryptjs for password hashing |
| **File Uploads**   | Cloudinary                    |
| **Forms**          | Formik + Yup validation       |
| **Icons**          | Lucide React, React Icons     |
| **Notifications**  | React Hot Toast               |
| **Printing**       | React to Print                |
| **Type Checking**  | TypeScript 5                  |
| **Linting**        | ESLint 9                      |

## 📁 Project Structure

```
job-kit/
├── app/
│   ├── (auth)/                 # Auth routes (login, register)
│   ├── (public)/               # Public pages
│   ├── api/                    # API routes
│   │   ├── auth/               # Auth endpoints
│   │   ├── applications/       # Job application endpoints
│   │   ├── dashboard/          # Dashboard data endpoints
│   │   ├── jobs/               # Job management endpoints
│   │   ├── resume/             # Resume endpoints
│   │   └── upload/             # File upload endpoints
│   ├── dashboard/              # Protected dashboard pages
│   │   ├── company/            # Company dashboard
│   │   └── user/               # User dashboard
│   ├── privacy/                # Privacy policy
│   ├── terms/                  # Terms of service
│   └── layout.tsx              # Root layout
├── components/
│   ├── auth/                   # Auth components & guards
│   ├── dashboard/              # Dashboard components
│   ├── layout/                 # Header, Footer
│   ├── shared/                 # Shared/public components
│   └── ui/                     # Reusable UI components
├── contexts/
│   ├── AuthContext.tsx         # Authentication context
│   └── ResumeContext.tsx       # Resume builder context
├── lib/
│   ├── api-utils.ts            # API utility functions
│   ├── cloudinary.ts           # Cloudinary configuration
│   └── prisma.ts               # Prisma singleton instance
├── prisma/
│   ├── schema.prisma           # Database schema (Prisma v5)
│   └── migrations/             # Database migration history
├── public/                     # Static assets
├── styles/
│   └── globals.css             # Global styles
├── types/                      # TypeScript type definitions
└── Configuration files
    ├── next.config.ts
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── eslint.config.mjs
    └── postcss.config.mjs
```

## 📋 Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **npm** or **yarn**: Package manager
- **PostgreSQL**: v12+ (local or cloud database)
- **Cloudinary Account**: For image uploads (optional for local development)

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/jobkit_db"
DIRECT_URL="postgresql://user:password@localhost:5432/jobkit_db"

# Cloudinary (optional, for logo/image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Node Environment
NODE_ENV="development"
```

### PostgreSQL Setup (Local)

If using a local PostgreSQL instance:

```bash
# Create database
createdb jobkit_db

# Set connection string in .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/jobkit_db"
DIRECT_URL="postgresql://postgres:password@localhost:5432/jobkit_db"
```

### PostgreSQL Setup (Docker)

Alternatively, use Docker:

```bash
docker run --name postgres-jobkit \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=jobkit_db \
  -p 5432:5432 \
  -d postgres:15
```

## 💾 Installation & Database Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all packages including **Prisma v5** and **@prisma/client v5**.

### 2. Generate Prisma Client

```bash
npm run db:generate
```

This generates the Prisma Client from the schema.

### 3. Create Database and Run Migrations

```bash
# First time setup - creates database schema
npm run db:migrate

# Provide a migration name when prompted (e.g., "init")
```

Or push schema directly without creating migration files:

```bash
npm run db:push
```

### 4. (Optional) Open Prisma Studio

View and manage database records in a visual interface:

```bash
npm run db:studio
```

Opens `http://localhost:5555` in your browser.

## 🚀 Development

### Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Other Development Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Database commands
npm run db:generate    # Generate Prisma Client
npm run db:push        # Sync schema with database
npm run db:migrate     # Create migration and apply
npm run db:studio      # Open Prisma Studio
```

## 🗄 Database Management

### Prisma Schema Overview

The database includes the following main models:

- **User**: Core user account (jobseeker or company)
- **Company**: Company profile linked to User
- **JobSeeker**: Job seeker profile linked to User
- **Job**: Job listings created by companies
- **JobApplication**: Applications submitted by job seekers
- **Resume**: Resume profiles for job seekers

### User Types

```prisma
enum UserType {
  USER      # Job seeker
  COMPANY   # Employer
}
```

### Work Types

```prisma
enum WorkType {
  FULL_TIME
  PART_TIME
  CONTRACT
  FREELANCE
  INTERNSHIP
  REMOTE
}
```

### Application Status

```prisma
enum ApplicationStatus {
  PENDING        # Initial submission
  REVIEWED       # HR reviewed
  SHORTLISTED    # Candidate shortlisted
  INTERVIEWING   # Interview in progress
  ACCEPTED       # Job offer accepted
  REJECTED       # Application rejected
  WITHDRAWN      # Applicant withdrew
}
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Job Management

- `GET /api/dashboard/jobs` - List jobs (with filters)
- `GET /api/dashboard/jobs/[id]` - Get job details
- `POST /api/applications` - Create job application
- `GET /api/applications` - List applications
- `GET /api/applications/[id]` - Get application details

### Resume

- `POST /api/resume` - Create/update resume
- `GET /api/resume` - Get user's resumes

### Dashboard

- `GET /api/dashboard/company/profile` - Get company profile
- `GET /api/dashboard/stats` - Get dashboard statistics

### File Upload

- `POST /api/upload/logo` - Upload company logo

## 🔐 Authentication

The application uses session-based authentication:

1. **Registration**: Users sign up as either a job seeker or company
2. **Password Security**: Passwords are hashed with bcryptjs before storage
3. **Protected Routes**: Dashboard and admin routes protected by `AuthGuard` and `ProtectedRoute` components
4. **Session Context**: `AuthContext` manages user state across the app

## 📦 Prisma v5 Notes

This project uses **Prisma v5.21.0** (latest v5 release). Key features:

- Improved type safety with TypeScript
- Enhanced query optimization
- PostgreSQL-native features support (arrays, JSON types)
- Prisma Studio for visual database management
- Prisma Migrate for safe schema evolution

To update Prisma in the future:

```bash
npm install @prisma/client@5 prisma@5
npm run db:generate
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

For production databases, use managed PostgreSQL services:

- **Vercel Postgres**
- **Railway**
- **Supabase**
- **AWS RDS**
- **DigitalOcean Managed Database**

## 🆘 Troubleshooting

### Prisma Client Not Generated

```bash
npm run db:generate
```

### Database Connection Issues

- Verify `DATABASE_URL` and `DIRECT_URL` in `.env.local`
- Test connection: `psql <DATABASE_URL>`
- Check PostgreSQL is running

### Migrations Failed

```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or reset and reseed
npm run db:migrate -- --force-reset
```

### Port 3000 Already in Use

```bash
# Use different port
npm run dev -- -p 3001
```

### Cloudinary Upload Issues

- Verify credentials in `.env.local`
- Check Cloudinary account is active
- Ensure upload folder exists in Cloudinary dashboard

### Type Errors in Components

After schema changes:

```bash
npm run db:generate
npm run lint
```

## 📝 License

This project is private and developed for internal use.

## 👥 Author

Developed by Atef Hejazi (@atefhejazi1)

---

**Last Updated**: November 26, 2025  
**Prisma Version**: v5.21.0 (latest v5)  
**Next.js Version**: 16.0.1  
**Node.js Version**: 18+
