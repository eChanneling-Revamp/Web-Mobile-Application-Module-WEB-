# eChannelling - Healthcare Appointment Booking Platform

A modern web application for booking medical appointments with doctors across Sri Lanka. Built with Next.js, React, and TypeScript.

## 🌐 Live Demo

**Live Site**: [https://echannelling.vercel.app/](https://echannelling.vercel.app/)

## Tech Stack

### Frontend
-   **Framework**: Next.js 15.5.4 (App Router)
-   **UI Library**: React 19.1.0
-   **Language**: TypeScript 5.9.3
-   **Styling**: Tailwind CSS 4.1.14 with PostCSS
-   **State Management**: Redux Toolkit 2.9.0 + React Redux 9.2.0
-   **HTTP Client**: Axios 1.12.2
-   **Icons**: React Icons 5.5.0, Lucide React 0.544.0, Heroicons 2.2.0
-   **Animations**: Framer Motion 12.23.26
-   **PDF Generation**: jsPDF 3.0.3
-   **Effects**: React Snowfall 2.4.0

### Backend & Database
-   **ORM**: Prisma 7.2.0
-   **Database**: PostgreSQL (via @prisma/adapter-pg 7.2.0)
-   **Database Driver**: pg 8.16.3
-   **Caching**: Upstash Redis 1.35.7
-   **Validation**: Zod 4.2.1

### Authentication & Security
-   **JWT**: jsonwebtoken 9.0.3
-   **Password Hashing**: bcryptjs 3.0.3
-   **Encryption**: crypto-js 4.2.0
-   **UUID Generation**: uuid 13.0.0

### Communication
-   **Email**: Nodemailer 7.0.11, SendGrid Mail 8.1.6, Resend 6.6.0
-   **SMS**: Twilio 5.10.7

### Development Tools
-   **Linting**: ESLint 9.37.0 with Next.js config
-   **Code Formatting**: Prettier 3.6.2
-   **TypeScript Utilities**: ts-node 10.9.2
-   **Environment Variables**: dotenv 17.2.3

## Prerequisites

-   Node.js (version 18+)
-   npm or yarn
-   Redis instance (Upstash recommended)
-   SMTP server access (for email OTP)
-   Twilio account (for SMS OTP)

## Installation

```bash
git clone <repository-url>
cd e-channeling
npm install
```

## 📋 Environment Variables

Create a `.env` file in the `e-channeling` directory and add the following:

```env
# ===========================
# API Configuration
# ===========================
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# ===========================
# Database Configuration
# ===========================
DATABASE_URL=postgresql://user:password@localhost:5432/echanneling?schema=public

# ===========================
# Redis Configuration (Upstash)
# ===========================
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-rest-token

# ===========================
# Email Configuration (SMTP)
# ===========================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# ===========================
# Email Service Providers (Optional)
# ===========================
RESEND_API_KEY=your-resend-api-key
SENDGRID_API_KEY=your-sendgrid-api-key

# ===========================
# Twilio Configuration (SMS)
# ===========================
TWILIO_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE=+1234567890

# ===========================
# Optional Configuration
# ===========================
#NODE_TLS_REJECT_UNAUTHORIZED=0
```



## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint
-   `npx tsx src/utils/api.ts` - Run single ts file

## Routes

-   `/` - Home page
-   `/login` - Login page (/Email/Phone number+ Password)
-   `/signup` - Registration page (Multi-step with OTP verification)
-   `/forgot-password` - Password recovery initiation
-   `/search` - Find Doctors
-   `/profile` - User profile (Protected - requires login)
-   `/booking` - Appointment booking (Protected - requires login)
