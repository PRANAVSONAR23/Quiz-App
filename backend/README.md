# Quiz Application Backend API

A comprehensive backend API for a quiz application built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- ✅ Create quiz topics with difficulty levels
- ✅ Add questions with multiple choice options
- ✅ Start quiz sessions with customizable question count
- ✅ Submit quiz answers and get scored results
- ✅ Retrieve all available topics
- ✅ Input validation and error handling
- ✅ Rate limiting and security middlewares
- ✅ Comprehensive test coverage

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Testing**: Jest + Supertest
- **Validation**: Express-validator

## Quick Start

### 1. Setup Environment
```bash
# Copy environment variables
cp env.example .env

# Install dependencies
npm install

# Run database migrations
npm run db:migrate
```

### 2. Seed Database (Recommended)
```bash
# Start the server first
npm run dev

# In another terminal, seed the database
npm run seed
```

This will populate your database with sample topics and questions. See [SEEDING.md](./SEEDING.md) for detailed seeding documentation.

### 3. Alternative Manual Setup
If you prefer to add data manually, you can use the API endpoints directly.

## API Endpoints

### 1. Create Topic
```http
POST /api/v1/topics
Content-Type: application/json

{
  "title": "JavaScript Fundamentals",
  "difficulty": "easy"
} 