# Database Seeding Guide

This guide explains how to seed your quiz application database with initial topics and questions.

## Overview

The seeding process automatically populates your database with:
- **10 Topics** across various subjects (JavaScript, React, Node.js, TypeScript, etc.)
- **15+ Questions** with multiple choice options and correct answers
- Proper relationships between topics and questions

## Quick Start

### 1. Ensure Server is Running

Before seeding, make sure your backend server is running:

#### Option A: Using Docker (Recommended)
```bash
# Start all services (PostgreSQL, Redis, Backend)
npm run docker:up

# Wait for all services to be healthy (about 30-60 seconds)
# The backend will automatically run migrations on startup
```

#### Option B: Local Development
```bash
# Start the development server locally
npm run dev
```

The server should be accessible at `http://localhost:5000` (Docker) or your configured PORT.

### 2. Run the Seed Script

#### For Docker Environment:
```bash
# In a new terminal window (keep Docker running in the first)
npm run seed

# The seed script will connect to http://localhost:5000/api/v1
# and populate the PostgreSQL database running in Docker
```

#### For Local Development:
```bash
# Run the seed script once
npm run seed

# Or use the development version that watches for changes
npm run seed:dev
```

## Environment Configuration

Make sure your `.env` file includes the API_BASE_URL:

```env
API_BASE_URL=http://localhost:5000/api/v1
```

If not specified, it defaults to `http://localhost:3000/api/v1`.

## What Gets Seeded

### Topics
The script creates topics with the following structure:
- **JavaScript** (medium)
- **React** (medium)
- **Node.js** (medium)
- **TypeScript** (hard)
- **HTML & CSS** (easy)
- **Database Management** (medium)
- **System Design** (hard)
- **Data Structures** (medium)
- **Algorithms** (hard)
- **Web Development Basics** (easy)

### Questions
Each topic gets relevant questions with:
- Question text
- 4 multiple choice options
- Correct answer option
- Proper topic association

## Seed Script Features

### ✅ Smart Duplicate Handling
- Skips topics that already exist
- Uses existing topics for question assignment
- Won't create duplicate data

### ✅ Error Handling
- Tests API connectivity before starting
- Graceful error handling for network issues
- Detailed logging of success/failure counts

### ✅ Rate Limiting Friendly
- Adds delays between API calls
- Respects server rate limits
- Won't overwhelm your API

### ✅ Comprehensive Logging
- Shows progress for each operation
- Displays final summary with counts
- Color-coded status messages

## Sample Output

```bash
🌱 Starting database seeding...

🔍 Testing API connectivity...
✅ API is accessible

📚 Creating topics...

Creating topic: JavaScript (medium)
✅ Topic "JavaScript" created with ID: cmg20vu29001sqn338nvad5fl
Creating topic: React (medium)
✅ Topic "React" created with ID: cmg20vu29001sqn338nvad5fm
...

📊 Topics Summary: 10 created, 0 errors

❓ Adding questions...

Adding 2 questions to topic ID: cmg20vu29001sqn338nvad5fl
✅ Successfully added 2 questions
...

📊 Questions Summary: 15 added, 0 errors

🎉 Database seeding completed!
📚 Topics: 10 created
❓ Questions: 15 added

✅ Seeding process completed successfully
```

## Customizing Seed Data

### Adding New Topics

Edit the `topics` array in `src/seed.ts`:

```typescript
const topics: Topic[] = [
  { title: 'Your New Topic', difficulty: 'medium' },
  // ... existing topics
];
```

### Adding New Questions

Add questions to the `questionsData` array:

```typescript
const questionsData: QuestionWithTopic[] = [
  {
    topicTitle: 'Your New Topic',
    questionText: 'Your question here?',
    options: [
      { optionId: '1', optionText: 'Option 1' },
      { optionId: '2', optionText: 'Option 2' },
      { optionId: '3', optionText: 'Option 3' },
      { optionId: '4', optionText: 'Option 4' }
    ],
    correctOption: '1'
  },
  // ... existing questions
];
```

## Troubleshooting

### Connection Issues
```bash
❌ Cannot connect to API. Please ensure the server is running.
```
**Solution**: Make sure your backend server is running on the correct port.

### Rate Limiting
```bash
❌ Error creating topic: Too many requests
```
**Solution**: The script includes delays, but you can increase them by modifying the `delay(500)` calls in the script.

### Topic Already Exists
```bash
⚠️ Topic "JavaScript" already exists, skipping...
```
**Solution**: This is normal behavior. The script will use existing topics for questions.

## Integration with Development Workflow

### Docker Workflow (Recommended)
1. **Setup Environment**: `cp env.example .env` and configure
2. **Start All Services**: `npm run docker:up`
3. **Wait for Services**: Allow 30-60 seconds for all containers to be healthy
4. **Seed Database**: `npm run seed` (in a new terminal)
5. **Start Developing**: Your database is now populated and ready!

### Local Development Workflow
1. Start your development server: `npm run dev`
2. Run database migrations: `npm run db:migrate`
3. Seed the database: `npm run seed`
4. Start developing with populated data

### For New Team Members (Docker)
1. **Clone the repository**
2. **Setup environment**: `cp env.example .env` and configure
3. **Install dependencies**: `npm install`
4. **Start Docker services**: `npm run docker:up`
5. **Wait for startup**: Check logs with `npm run docker:logs`
6. **Seed database**: `npm run seed`
7. **Ready to develop!** All data is in the Docker PostgreSQL instance

### For New Team Members (Local)
1. Clone the repository
2. Copy `.env.example` to `.env` and configure
3. Install dependencies: `npm install`
4. Setup local PostgreSQL and Redis
5. Run migrations: `npm run db:migrate`
6. Seed database: `npm run seed`
7. Start development: `npm run dev`

## API Endpoints Used

The seed script calls these endpoints:

### Create Topic
```http
POST /api/v1/topics
Content-Type: application/json

{
  "title": "Topic Name",
  "difficulty": "easy|medium|hard"
}
```

### Add Questions
```http
POST /api/v1/questions
Content-Type: application/json

{
  "questions": [
    {
      "questionText": "Question?",
      "options": [
        { "optionId": "1", "optionText": "Option 1" },
        { "optionId": "2", "optionText": "Option 2" },
        { "optionId": "3", "optionText": "Option 3" },
        { "optionId": "4", "optionText": "Option 4" }
      ],
      "correctOption": "1",
      "topicId": "topic-id-here"
    }
  ]
}
```

## Best Practices

1. **Always seed after database migrations**
2. **Test the seed script in development first**
3. **Keep seed data relevant to your application**
4. **Run seeding on a clean database for consistent results**
5. **Update seed data as your application evolves**

---

For questions or issues with seeding, check the server logs and ensure all prerequisites are met.