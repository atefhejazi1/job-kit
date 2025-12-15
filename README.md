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
- [Database Schema](#database-schema)
- [Contexts & Hooks](#contexts--hooks)
- [API Endpoints](#api-endpoints)
- [Components Documentation](#components-documentation)
- [Authentication](#authentication)
- [Key Features Implementation](#key-features-implementation)
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

## � Database Schema

### Complete Prisma Models

#### User Model
Primary user account supporting both job seekers and companies.

```prisma
model User {
  id        String          @id @default(cuid())
  email     String          @unique
  name      String
  password  String          (hashed with bcryptjs)
  avatarUrl String?
  userType  UserType        @default(USER)  // USER | COMPANY
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
  
  // Relations
  company        Company?           // One-to-one with Company
  jobSeeker      JobSeeker?         // One-to-one with JobSeeker
  resumes        Resume[]           // One-to-many with Resume
  applications   JobApplication[]   // One-to-many with JobApplication
  savedJobs      SavedJob[]         // Many-to-many with Job
  savedCompanies SavedCompany[]     // Many-to-many with Company
  searchHistory  SearchHistory[]    // One-to-many with SearchHistory
  notifications  Notification[]     // One-to-many with Notification
  messages       Message[]          // One-to-many with Message
  interviews     Interview[]        // One-to-many with Interview
}
```

#### Company Model
Company profile linked to User account.

```prisma
model Company {
  id              String    @id @default(cuid())
  userId          String    @unique
  companyName     String
  industry        String?
  companySize     String?   // e.g., "1-50", "51-200", "200+"
  location        String?
  website         String?
  description     String?   // Full company description
  logo            String?   // Cloudinary URL
  contactPhone    String?
  contactEmail    String?
  establishedYear Int?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  user    User          @relation("UserCompany", fields: [userId], references: [id], onDelete: Cascade)
  jobs    Job[]         @relation("CompanyJobs")
  savedBy SavedCompany[]
}
```

#### Job Model
Job listings created by companies.

```prisma
model Job {
  id               String    @id @default(cuid())
  companyId        String
  title            String
  description      String    // Full job description
  requirements     String[]  // Array of requirements
  location         String
  workType         WorkType  // FULL_TIME | PART_TIME | CONTRACT | FREELANCE | INTERNSHIP | REMOTE
  salaryMin        Int?
  salaryMax        Int?
  currency         String    @default("USD")
  benefits         String[]  // Array of benefits
  skills           String[]  // Required skills
  experienceLevel  String    // e.g., "entry", "mid", "senior"
  isActive         Boolean   @default(true)
  deadline         DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  
  // Relations
  company        Company          @relation("CompanyJobs", fields: [companyId], references: [id], onDelete: Cascade)
  applications   JobApplication[] @relation("JobApplications")
  savedByUsers   SavedJob[]       @relation("SavedByUsers")
  messageThreads MessageThread[]
  interviews     Interview[]
}
```

#### Resume Model
Resume profiles for job seekers with JSON storage for flexible sections.

```prisma
model Resume {
  id             String   @id @default(cuid())
  userId         String
  name           String
  email          String
  phone          String
  summary        String
  skills         Json     // Array of { type: 'skill', id: string, name: string }
  languages      Json     // Array of { type: 'language', id: string, name: string }
  education      Json     // Array of EducationItem
  certifications Json?    // Array of CertificationItem
  experience     Json     // Array of ExperienceItem
  projects       Json     // Array of ProjectItem
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  // Relations
  user User @relation(fields: [userId], references: [id])
}
```

#### JobApplication Model
Track applications submitted by job seekers.

```prisma
model JobApplication {
  id          String            @id @default(cuid())
  jobId       String
  userId      String
  coverLetter String?
  status      ApplicationStatus @default(PENDING)
  notes       String?           // HR notes
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  
  // Relations
  job        Job         @relation("JobApplications", fields: [jobId], references: [id], onDelete: Cascade)
  user       User        @relation("UserApplications", fields: [userId], references: [id], onDelete: Cascade)
  interviews Interview[]
  
  @@unique([jobId, userId])  // Prevent duplicate applications
}
```

#### Supporting Models
- **JobSeeker**: Extended profile for job seekers (skills, experience level, expectations)
- **SavedJob** & **SavedCompany**: Bookmarking/favorites functionality
- **SearchHistory**: Track user search queries
- **MessageThread** & **Message**: Communication between companies and applicants
- **Interview**: Interview scheduling and management
- **Notification**: User notifications system

### Enums

```prisma
enum UserType {
  USER      # Job seeker
  COMPANY   # Employer/Company
}

enum WorkType {
  FULL_TIME
  PART_TIME
  CONTRACT
  FREELANCE
  INTERNSHIP
  REMOTE
}

enum ApplicationStatus {
  PENDING        # Initial submission
  REVIEWED       # HR reviewed
  SHORTLISTED    # Candidate shortlisted for interview
  INTERVIEWING   # Interview scheduled/in progress
  ACCEPTED       # Job offer made and accepted
  REJECTED       # Application rejected
  WITHDRAWN      # Applicant withdrew application
}
```

---

## 🎯 Contexts & Hooks

### AuthContext
Authentication state management across the application.

**Location**: [`contexts/AuthContext.tsx`](contexts/AuthContext.tsx)

**Features**:
- User login/logout
- Token refresh mechanism (JWT)
- Session persistence
- User state management

**Usage**:
```typescript
import { useAuth } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return <div>Welcome, {user?.name}</div>;
}
```

**Key Methods**:
- `login(userData, accessToken?, refreshToken?)` - Store user session
- `logout()` - Clear user session
- `refreshAuth()` - Verify and refresh JWT token
- `updateUser(data)` - Update user profile

---

### ResumeContext
Resume builder state management with template support.

**Location**: [`contexts/ResumeContext.tsx`](contexts/ResumeContext.tsx)

**Features**:
- Resume form data management
- Multiple resume support
- Real-time preview synchronization
- Template switching
- Data migration from old format

**Usage**:
```typescript
import { useResume } from "@/contexts/ResumeContext";

export default function ResumeBuilder() {
  const { 
    resumeData, 
    setResumeData, 
    saveResume, 
    currentTemplate,
    setTemplate,
    loading 
  } = useResume();
  
  const handleSave = async () => {
    await saveResume(resumeData);
  };
  
  return (
    <div>
      <form onSubmit={handleSave}>
        {/* Form fields */}
      </form>
    </div>
  );
}
```

**Data Structure**:
```typescript
interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: SkillItem[];      // { type: 'skill', id: string, name: string }
  languages: LanguageItem[]; // { type: 'language', id: string, name: string }
  education: EducationItem[];
  certifications: CertificationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
}
```

---

### ThemeContext
Light/Dark mode management.

**Location**: [`contexts/ThemeContext.tsx`](contexts/ThemeContext.tsx)

**Features**:
- Theme toggle (light/dark)
- localStorage persistence
- System preference detection
- Tailwind CSS integration

**Usage**:
```typescript
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

---

### NotificationContext
Application notifications system.

**Location**: [`contexts/NotificationContext.tsx`](contexts/NotificationContext.tsx)

**Features**:
- Toast notifications
- Success/Error/Warning states
- Auto-dismiss timers
- Real-time updates

---

### Custom Hooks

#### useSocket
Real-time messaging with Socket.io

**Location**: [`hooks/useSocket.ts`](hooks/useSocket.ts)

```typescript
const { messages, sendMessage, isConnected } = useSocket();
```

#### useNotifications
Fetch user notifications

**Location**: [`hooks/useNotifications.ts`](hooks/useNotifications.ts)

```typescript
const { notifications, unreadCount, markAsRead } = useNotifications();
```

#### useUnreadMessages
Track unread messages

**Location**: [`hooks/useUnreadMessages.ts`](hooks/useUnreadMessages.ts)

```typescript
const { unreadCount, updateUnread } = useUnreadMessages();
```

---

## 🔌 API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "userType": "USER"  // or "COMPANY"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": "clxxxxx",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "USER"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "user": { /* user object */ },
  "accessToken": "jwt.token.here",
  "refreshToken": "refresh.token.here"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <accessToken>

Response (200):
{
  "user": { /* full user object */ }
}
```

#### Refresh Token
```
POST /api/auth/refresh
Authorization: Bearer <refreshToken>

Response (200):
{
  "accessToken": "new.jwt.token"
}
```

---

### Resume Routes

#### Create/Update Resume
```
POST /api/resume
x-user-id: <userId>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "summary": "Experienced developer...",
  "skills": [
    { "type": "skill", "id": "123", "name": "JavaScript" }
  ],
  "languages": [
    { "type": "language", "id": "456", "name": "English" }
  ],
  "education": [
    {
      "type": "education",
      "school": "MIT",
      "degree": "B.S.",
      "startDate": "2018-09",
      "endDate": "2022-05",
      "description": "Computer Science"
    }
  ],
  "experience": [
    {
      "type": "experience",
      "company": "Tech Corp",
      "role": "Senior Developer",
      "title": "Senior Developer",
      "startDate": "2022-06",
      "endDate": "present",
      "description": "Led development of..."
    }
  ],
  "projects": [
    {
      "type": "project",
      "title": "Project Name",
      "link": "https://project.com",
      "description": "Description..."
    }
  ],
  "certifications": []
}

Response (201):
{
  "id": "clxxxxx",
  "userId": "clxxxxx",
  "name": "John Doe",
  "createdAt": "2025-12-15T10:00:00Z",
  "updatedAt": "2025-12-15T10:00:00Z"
}
```

#### Get Resume
```
GET /api/resume?userId=<userId>

Response (200):
{
  "id": "clxxxxx",
  "userId": "clxxxxx",
  /* full resume data */
}
```

#### Delete Resume
```
DELETE /api/resume
x-user-id: <userId>
Content-Type: application/json

{
  "resumeId": "clxxxxx"
}

Response (200):
{
  "message": "Resume deleted successfully"
}
```

---

### Job Routes

#### List Jobs (with Filters)
```
GET /api/jobs?
  page=1
  limit=10
  search=developer
  location=New York
  workType=FULL_TIME
  salaryMin=50000
  salaryMax=150000

Response (200):
{
  "jobs": [
    {
      "id": "clxxxxx",
      "title": "Senior Developer",
      "company": { /* company object */ },
      "location": "New York",
      "workType": "FULL_TIME",
      "salaryMin": 80000,
      "salaryMax": 120000,
      "skills": ["JavaScript", "React", "Node.js"],
      "description": "We're looking for...",
      "deadline": "2025-12-31T23:59:59Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

#### Get Job Details
```
GET /api/jobs/<jobId>

Response (200):
{
  "id": "clxxxxx",
  "title": "Senior Developer",
  "company": { /* full company object */ },
  "description": "Full description...",
  "requirements": ["Requirement 1", "Requirement 2"],
  "benefits": ["Benefit 1", "Benefit 2"],
  "createdAt": "2025-12-01T10:00:00Z"
}
```

#### Post Job (Company Only)
```
POST /api/jobs
x-user-id: <companyUserId>
x-company-id: <companyId>
Content-Type: application/json

{
  "title": "Senior Developer",
  "description": "Full job description...",
  "location": "New York, NY",
  "workType": "FULL_TIME",
  "salaryMin": 80000,
  "salaryMax": 120000,
  "currency": "USD",
  "requirements": ["Requirement 1"],
  "benefits": ["Benefit 1"],
  "skills": ["JavaScript", "React"],
  "experienceLevel": "senior",
  "deadline": "2025-12-31T23:59:59Z"
}

Response (201):
{
  "id": "clxxxxx",
  /* job object */
}
```

---

### Job Application Routes

#### Apply for Job
```
POST /api/applications
x-user-id: <userId>
Content-Type: application/json

{
  "jobId": "clxxxxx",
  "coverLetter": "I am interested in this position because..."
}

Response (201):
{
  "id": "clxxxxx",
  "jobId": "clxxxxx",
  "userId": "clxxxxx",
  "status": "PENDING",
  "createdAt": "2025-12-15T10:00:00Z"
}
```

#### Get User Applications
```
GET /api/applications?
  userId=<userId>
  status=PENDING
  limit=20

Response (200):
{
  "applications": [
    {
      "id": "clxxxxx",
      "job": { /* job object */ },
      "status": "PENDING",
      "createdAt": "2025-12-15T10:00:00Z"
    }
  ]
}
```

#### Get Application Details
```
GET /api/applications/<applicationId>

Response (200):
{
  "id": "clxxxxx",
  "job": { /* full job object */ },
  "user": { /* user object */ },
  "status": "REVIEWED",
  "coverLetter": "...",
  "notes": "HR notes...",
  "interviews": []
}
```

#### Update Application Status (Company Only)
```
PUT /api/applications/<applicationId>
x-user-id: <companyUserId>
Content-Type: application/json

{
  "status": "SHORTLISTED",
  "notes": "Great candidate. Schedule interview."
}

Response (200):
{
  "id": "clxxxxx",
  "status": "SHORTLISTED"
}
```

---

### Dashboard Routes

#### Get Company Profile
```
GET /api/dashboard/company/profile
x-user-id: <companyUserId>

Response (200):
{
  "id": "clxxxxx",
  "companyName": "Tech Corp",
  "industry": "Technology",
  "logo": "https://cloudinary.com/...",
  "description": "We are...",
  "website": "https://techcorp.com",
  "location": "San Francisco, CA"
}
```

#### Get Dashboard Stats
```
GET /api/dashboard/stats
x-user-id: <userId>

Response (200):
{
  "totalApplications": 15,
  "pendingApplications": 3,
  "approvedApplications": 5,
  "rejectedApplications": 7,
  "totalJobsPosted": 8,
  "activeJobs": 5,
  "savedJobs": 12
}
```

---

### File Upload Routes

#### Upload Company Logo
```
POST /api/upload/logo
x-user-id: <companyUserId>
Content-Type: multipart/form-data

{
  "file": <File>
}

Response (200):
{
  "url": "https://cloudinary.com/image-url",
  "message": "Logo uploaded successfully"
}
```

---

## 📦 Components Documentation

### Layout Components

#### Header.tsx
Main navigation header with theme toggle and user menu.

- Shows different nav items for authenticated/unauthenticated users
- Company vs. User specific navigation
- Mobile responsive menu
- Theme toggle integration

#### Footer.tsx
Application footer with links and information.

---

### Authentication Components

#### AuthGuard.tsx
Protects routes and components from unauthorized access.

```typescript
<AuthGuard requiredRole="COMPANY">
  <CompanyDashboard />
</AuthGuard>
```

#### ProtectedRoute.tsx
Wrapper for protected pages requiring authentication.

#### AuthRedirect.tsx
Redirects authenticated users away from auth pages.

---

### Dashboard Components

#### ResumePreview.tsx
Real-time resume preview matching the selected template.

#### ResumePreviewWithTemplate.tsx
Enhanced preview with template selection and formatting.

#### UserInfo.tsx
User profile information and edit form.

---

### Resume Components

#### ResumeForm Components
- **PersonalInfo** - Name, email, phone
- **Summary** - Professional summary
- **Skills** - Add/remove skills
- **Languages** - Languages and proficiency
- **Education** - School, degree, dates
- **Experience** - Work history
- **Projects** - Portfolio projects
- **Certifications** - Professional certifications

#### ResumeTemplates
Multiple professional templates with preview:
- Modern Template
- Classic Template
- Creative Template
- Minimal Template

---

### Notification Components

#### NotificationDropdown.tsx
Displays user notifications with filters.

#### NotificationList.tsx
List view of all notifications.

---

### Job Components

#### JobCard.tsx
Individual job listing card with key information.

```typescript
<JobCard
  job={jobData}
  onApply={() => handleApply(jobData.id)}
  isSaved={isSaved}
  onSaveToggle={() => toggleSave(jobData.id)}
/>
```

#### JobsList.tsx
Grid/list view of multiple job listings.

#### JobsListAdvanced.tsx
Advanced job listing with filters and sorting.

---

### Shared Components

#### Hero.tsx
Landing page hero section.

#### Features.tsx
Feature showcase section.

#### Services.tsx
Services overview.

#### Testimonials.tsx
User testimonials carousel.

#### About.tsx
About page content.

#### QuickStats.tsx
Quick statistics display.

---

## 🔐 Authentication

### How Authentication Works

1. **Registration**: User creates account with email/password
   - Password hashed with bcryptjs before storage
   - JWT token issued on successful registration

2. **Login**: User provides credentials
   - Password verified against hash
   - Access and Refresh tokens generated
   - Tokens stored in cookies/localStorage

3. **Token Refresh**: Access token expires after ~1 hour
   - Refresh token used to obtain new access token
   - Automatic refresh on API calls

4. **Protected Routes**: Components check user authentication
   - `AuthGuard` checks user type (USER/COMPANY)
   - `ProtectedRoute` requires valid token
   - Redirects to login if not authenticated

### Headers Required for Authenticated Requests

```typescript
// For all authenticated requests
headers: {
  "x-user-id": userId,        // User ID
  "x-company-id": companyId   // Only for COMPANY users
}
```

Use the helper function:
```typescript
import { createApiHeaders } from "@/lib/api-utils";

const headers = createApiHeaders(user);
```

---

## 🎯 Key Features Implementation

### Resume Builder
- **Multi-section form** with add/remove capabilities
- **Real-time preview** synchronized with form data
- **Template selection** with visual previews
- **PDF export** using jsPDF and html2canvas
- **Auto-save** to database with localStorage fallback
- **Drag-and-drop** reordering (future enhancement)

### Job Search & Filtering
- **Advanced filters**: Location, salary, work type, skills
- **Full-text search** across job titles and descriptions
- **Save jobs** for later viewing
- **Search history** tracking
- **Job alerts** (future enhancement)

### Application Tracking
- **Application status** progression (PENDING → REVIEWED → SHORTLISTED → etc.)
- **Application timeline** with status changes
- **Interview scheduling** from application view
- **Notes and feedback** from recruiters
- **Application statistics** dashboard

### Company Dashboard
- **Job posting management** - Create, edit, delete listings
- **Application management** - View and filter applications
- **Applicant profiles** - Review resumes and qualifications
- **Analytics dashboard** - Metrics and insights
- **Team settings** (future enhancement)

### Messaging System
- **Real-time messaging** with Socket.io
- **Message threads** organized by job/applicant
- **Unread count** notifications
- **Message history** persistence

---

## 🚀 Development Workflow

### Adding a New Feature

1. **Update Database Schema** (if needed)
   ```bash
   # Edit prisma/schema.prisma
   npm run db:migrate -- --name feature_name
   npm run db:generate
   ```

2. **Create API Route**
   ```typescript
   // app/api/feature/route.ts
   export async function GET(req: Request) { }
   export async function POST(req: Request) { }
   ```

3. **Add Context/State** (if needed)
   ```typescript
   // contexts/FeatureContext.tsx
   const FeatureContext = createContext();
   export const FeatureProvider = ({ children }) => { }
   export const useFeature = () => { }
   ```

4. **Create Components**
   ```typescript
   // components/Feature.tsx
   export default function Feature() { }
   ```

5. **Add Types**
   ```typescript
   // types/feature.types.ts
   export interface FeatureData { }
   ```

6. **Update Routes** (if needed)
   ```typescript
   // app/feature/page.tsx
   export default function FeaturePage() { }
   ```

---

## 📊 Key Files Reference

| File | Purpose |
|------|---------|
| [`prisma/schema.prisma`](prisma/schema.prisma) | Database schema definition |
| [`contexts/AuthContext.tsx`](contexts/AuthContext.tsx) | Authentication state |
| [`contexts/ResumeContext.tsx`](contexts/ResumeContext.tsx) | Resume builder state |
| [`lib/prisma.ts`](lib/prisma.ts) | Prisma client singleton |
| [`lib/api-utils.ts`](lib/api-utils.ts) | API header helpers |
| [`lib/cloudinary.ts`](lib/cloudinary.ts) | Cloudinary integration |
| [`types/auth.types.ts`](types/auth.types.ts) | Auth TypeScript types |
| [`types/resume.data.types.ts`](types/resume.data.types.ts) | Resume data types |

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

### Resume Save Issues

**Problem**: "500 Internal Server Error" when saving resume

**Solutions**:
1. Check Prisma migrations are run: `npm run db:migrate`
2. Verify `userId` is being sent in request headers
3. Check terminal for detailed error message
4. Ensure `DATABASE_URL` is correctly configured

**Example Fix**:
```typescript
// Make sure to include userId
const res = await fetch("/api/resume", {
  method: "POST",
  headers: { 
    "x-user-id": userId,
    "Content-Type": "application/json" 
  },
  body: JSON.stringify(resumeData)
});
```

---

### Theme Toggle Not Working

**Problem**: Dark/Light mode toggle not changing theme

**Solutions**:
1. Hard refresh browser: `Ctrl+Shift+Delete`
2. Clear localStorage: `localStorage.clear()`
3. Restart dev server: `npm run dev`
4. Verify `tailwind.config.ts` has `darkMode: 'class'`
5. Check `ThemeContext` is wrapped in layout

**Verify Setup**:
```typescript
// app/layout.tsx should have:
<ThemeProvider>
  <AuthProvider>
    {children}
  </AuthProvider>
</ThemeProvider>
```

---

### Authentication Issues

**Problem**: "User not found" or login fails

**Solutions**:
1. Verify email exists in database: Check Prisma Studio `npm run db:studio`
2. Password must be hashed: bcryptjs handles this
3. Check JWT token expiration
4. Clear browser cookies and try again

**Debug Login**:
```typescript
// Check response from login endpoint
const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});

if (!res.ok) {
  const error = await res.json();
  console.error("Login error:", error);
}
```

---

### Database Connection Issues

**Problem**: `PrismaClientInitializationError` or connection timeout

**Solutions**:
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` format: `postgresql://user:password@localhost:5432/dbname`
3. Test connection: `psql $DATABASE_URL`
4. Ensure network connectivity (if remote DB)

**Connection String Examples**:
```env
# Local
DATABASE_URL="postgresql://postgres:password@localhost:5432/jobkit_db"

# Docker
DATABASE_URL="postgresql://postgres:password@postgres:5432/jobkit_db"

# Cloud (Railway, Supabase)
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
```

---

### Prisma Client Not Generated

**Problem**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
npm install @prisma/client@5 prisma@5
npm run db:generate
```

---

### Port 3000 Already in Use

**Solution**:
```bash
# Use different port
npm run dev -- -p 3001

# Or kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### Cloudinary Upload Fails

**Problem**: "Invalid Cloudinary credentials" or upload returns 401

**Solutions**:
1. Verify `.env.local` has:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```
2. Check credentials in Cloudinary dashboard
3. Ensure upload folder exists in Cloudinary
4. Restart dev server after env changes

---

### Type Errors After Schema Changes

**Problem**: TypeScript compilation errors after Prisma schema update

**Solution**:
```bash
npm run db:generate
npm run lint
# If still issues, clear node_modules
rm -r node_modules
npm install
npm run db:generate
```

---

## 📚 Additional Resources

### Prisma Documentation
- [Prisma Client](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Schema](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

### Next.js Documentation
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### External Integrations
- [Cloudinary Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🤝 Contributing

When contributing to this project:

1. Create feature branch: `git checkout -b feature/new-feature`
2. Follow TypeScript best practices
3. Update database schema if needed: `npm run db:migrate -- --name description`
4. Test API endpoints thoroughly
5. Update this README if adding new features
6. Submit pull request with description

---

## 📝 License

This project is private and developed for internal use.

## 👥 Authors

Developed by:
- **Atef Hejazi** (@atefhejazi1)
- **Sameh**
- **Raghad**
- **Hanady**

---

**Last Updated**: December 15, 2025
**Prisma Version**: v5.21.0
**Next.js Version**: 16.0.1
**Node.js Version**: 18+
**Status**: Active Development
