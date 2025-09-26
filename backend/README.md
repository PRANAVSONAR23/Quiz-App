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

## API Endpoints

### 1. Create Topic
```http
POST /api/v1/topics
Content-Type: application/json

{
  "title": "JavaScript Fundamentals",
  "difficulty": "easy"
}