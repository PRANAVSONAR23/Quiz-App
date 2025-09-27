# Quiz Application

A modern, full-stack quiz application built with best practices, featuring a professional React TypeScript frontend and a robust Node.js backend with PostgreSQL database and Redis caching.

## 🌟 Features

- **Modern Tech Stack**: React 18, TypeScript, Node.js, Express, PostgreSQL, Redis
- **Beautiful UI**: Professional design with Tailwind CSS and shadcn/ui components
- **Real-time Timer**: Countdown timer with auto-submission when time expires
- **Redis Caching**: High-performance caching for quiz sessions and questions
- **Docker Support**: Complete containerization with Docker Compose
- **Comprehensive Testing**: Jest test suite with high coverage
- **Session Management**: Secure quiz sessions with unique IDs
- **Detailed Analytics**: Question-by-question analysis and scoring
- **Responsive Design**: Mobile-friendly interface
- **Best Practices**: Clean architecture, validation, error handling, and security

## 📁 Project Structure

```
Quiz-App/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middlewares/       # Custom middleware
│   │   ├── validators/        # Input validation
│   │   ├── utils/             # Helper functions
│   │   └── types/             # TypeScript types
│   ├── prisma/                # Database schema & migrations
│   ├── tests/                 # Jest test files
│   ├── docker-compose.yml     # Container orchestration
│   ├── Dockerfile             # Container image
│   └── package.json           # Dependencies & scripts
├── frontend/                  # React TypeScript SPA
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API integration
│   │   ├── store/             # Zustand state management
│   │   ├── hooks/             # Custom React hooks
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # Utility functions
│   └── package.json           # Frontend dependencies
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker & Docker Compose** (for Docker setup)
- **PostgreSQL** (for local setup without Docker)
- **Redis** (for local setup without Docker)

## 🐳 Option A: Docker Setup (Recommended)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd Quiz-App
```

### 2. Backend Setup
```bash
cd backend
cp env.example .env
```

**Configure your `.env` file:**
```env
# Database Configuration
POSTGRES_DB=quiz_app
POSTGRES_USER=quiz_user
POSTGRES_PASSWORD=your_secure_password_here

# Redis Configuration
REDIS_TTL=7200

# Application Configuration
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# API Configuration for seeding
API_BASE_URL=http://localhost:5000/api/v1
```

### 3. Start All Services
```bash
npm install
npm run docker:dev
```

This starts:
- PostgreSQL database on port 5432
- Redis cache on port 6379
- Backend API on port 5000

### 4. Seed the Database
```bash
# In a new terminal (keep Docker running)
npm run seed
```

### 5. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

Access the application at `http://localhost:5173`

## 💻 Option B: Local Development Setup

### 1. Database Setup
Install and configure PostgreSQL and Redis locally:

```bash
# PostgreSQL
createdb quiz_app
createuser quiz_user

# Redis
redis-server
```

### 2. Backend Setup
```bash
cd backend
cp env.example .env
```

**Configure `.env` for local development:**
```env
DATABASE_URL="postgresql://quiz_user:quiz_password@localhost:5432/quiz_app"
REDIS_URL="redis://localhost:6379"
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:5173
API_BASE_URL=http://localhost:3000/api/v1
```

### 3. Install Dependencies & Setup Database
```bash
npm install
npm run db:migrate
npm run dev
```

### 4. Seed Database
```bash
# In a new terminal
npm run seed
```

### 5. Frontend Setup
```bash
cd ../frontend
npm install

# Update API URL in src/services/api.ts if needed
# Change from localhost:5000 to localhost:3000 for local development

npm run dev
```

## 🌱 Database Seeding

The seeding process populates your database with sample data:

### What Gets Seeded
- **6 Topics**: JavaScript, React, Node.js, System Design, Data Structures, Algorithms
- **75+ Questions**: Multiple choice questions with proper answers
- **Difficulty Levels**: Easy, Medium, Hard

### Seeding Commands
```bash
# One-time seeding
npm run seed

# Development mode (watches for changes)
npm run seed:dev
```

### Seeding Features
- ✅ Smart duplicate handling
- ✅ Error handling and retries
- ✅ Rate limiting friendly
- ✅ Comprehensive logging
- ✅ API connectivity testing

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

### Test Features
- ✅ Complete API endpoint testing
- ✅ Database mock testing
- ✅ Redis service testing
- ✅ Input validation testing
- ✅ Error handling testing
- ✅ Session management testing

### Test Coverage
- Controllers: 100%
- Services: 95%+
- Routes: 100%
- Validators: 100%

## 📊 API Documentation

### Base URL
- **Docker**: `http://localhost:5000/api/v1`
- **Local**: `http://localhost:3000/api/v1`

### Endpoints

#### Topics Management
```http
POST /topics
Content-Type: application/json

{
  "title": "JavaScript Fundamentals",
  "difficulty": "easy|medium|hard"
}
```

```http
GET /topics
```

#### Questions Management
```http
POST /questions
Content-Type: application/json

{
  "questions": [
    {
      "questionText": "What is JavaScript?",
      "options": [
        {"optionId": "a", "optionText": "Programming language"},
        {"optionId": "b", "optionText": "Database"},
        {"optionId": "c", "optionText": "Operating system"},
        {"optionId": "d", "optionText": "Web browser"}
      ],
      "correctOption": "a",
      "topicId": "topic-id-here"
    }
  ]
}
```

#### Quiz Operations
```http
POST /quiz/start
Content-Type: application/json

{
  "topicId": "topic-id",
  "numberOfQuestions": 10,
  "difficulty": "medium"
}
```

```http
POST /quiz/submit
Content-Type: application/json

{
  "topicId": "topic-id",
  "sessionId": "session-uuid",
  "answers": {
    "question-id-1": "option-a",
    "question-id-2": "option-c"
  }
}
```

#### Health Check
```http
GET /health
```

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

## 🏗️ Architecture & Technologies

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for session management and performance
- **Validation**: Express-validator for input validation
- **Security**: Helmet, CORS, Rate limiting
- **Testing**: Jest with Supertest for API testing

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for global state
- **API Calls**: TanStack Query with Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React

### Database Schema (Prisma)
```prisma
model Topic {
  id          String      @id @default(cuid())
  title       String      @unique
  difficulty  Difficulty
  questions   Question[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Question {
  id             String   @id @default(cuid())
  questionText   String
  questionImage  String?
  options        Json     // Array of options
  correctOption  String
  topicId        String
  topic          Topic    @relation(fields: [topicId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

enum Difficulty {
  easy
  medium
  hard
}
```

## ⚡ Redis Caching Strategy

### Cache Keys
- **Session Data**: `quiz_session:{sessionId}`
- **Topic Questions**: `topic_questions:{topicId}:{difficulty}`

### Caching Benefits
- **Reduced DB Load**: Questions cached in Redis
- **Faster Results**: Session data retrieved from memory
- **Scalability**: Support for concurrent quiz sessions
- **Session Management**: Automatic cleanup with TTL (2 hours default)

### Redis Features
- Connection health monitoring
- Automatic retry logic
- Configurable TTL
- JSON serialization for complex objects

## ⏰ Timer Feature

### Timer Capabilities
- **Countdown Timer**: Real-time countdown display
- **Auto-submission**: Automatic quiz submission when time expires
- **Visual Indicators**: Color-coded warnings (normal/warning/critical)
- **Timer Controls**: Start, pause, reset, stop functionality
- **State Management**: Timer state integrated with quiz store

### Timer Hook (`useCountdownTimer`)
```typescript
const timer = useCountdownTimer({
  initialSeconds: 1800, // 30 minutes
  onExpire: handleTimerExpire,
  autoStart: true,
});
```

### Timer Features
- MM:SS format display
- Color-coded warnings (green > yellow > red)
- Automatic quiz submission on expiry
- Timer state persistence in quiz store

## 🎨 UI/UX Features

### shadcn/ui Components
- **Button**: Customizable buttons with variants
- **Card**: Content containers with headers/footers
- **Select**: Dropdown selection components
- **Progress**: Custom progress indicators
- **Dialog**: Modal dialogs for confirmations

### Design System
- **Professional Blue Gradient Theme**
- **Responsive Layout**: Mobile-first design
- **Smooth Animations**: Transitions and micro-interactions
- **Accessibility**: ARIA labels and keyboard navigation
- **Clean Typography**: Consistent font hierarchy

### Page Components
1. **Test Selection Page**: Topic/difficulty/count selection
2. **Quiz Page**: Question navigation with progress tracking
3. **Results Page**: Detailed analytics with performance metrics

## 🔒 Security Features

- **Input Validation**: Express-validator for all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Configurable CORS origins
- **Helmet**: Security headers
- **Session Management**: Secure UUID-based sessions
- **Error Handling**: Comprehensive error handling

## 🐳 Docker Features

### Multi-service Setup
- **PostgreSQL**: Database with health checks
- **Redis**: Cache with memory limits
- **Backend**: Node.js app with hot reload

### Docker Commands
```bash
# Start all services
npm run docker:dev

# Stop all services
npm run docker:down

# View logs
npm run docker:logs

# Build images
npm run docker:build
```

### Production Ready
- Multi-stage Dockerfile for optimized builds
- Health checks for all services
- Volume persistence for data
- Configurable resource limits

## 📈 Performance Optimizations

### Backend Optimizations
- Redis caching for frequently accessed data
- Database query optimization with Prisma
- Connection pooling
- Efficient session management

### Frontend Optimizations
- Component lazy loading
- Efficient state management with Zustand
- Optimized API calls with TanStack Query
- Responsive images and assets

## 🔧 Development Workflow

### Available Scripts

#### Backend Scripts
```bash
npm run dev          # Development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run seed         # Seed database
npm run docker:dev   # Start Docker development environment
```

#### Frontend Scripts
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🌐 Environment Configuration

### Backend Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/quiz_app
POSTGRES_DB=quiz_app
POSTGRES_USER=quiz_user
POSTGRES_PASSWORD=secure_password

# Redis
REDIS_URL=redis://localhost:6379
REDIS_TTL=7200

# Application
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173

# Seeding
API_BASE_URL=http://localhost:5000/api/v1
```

## 🚀 Production Deployment

### Production Checklist
1. **Environment Security**:
   - Use strong, random JWT_SECRET
   - Set NODE_ENV=production
   - Configure proper CORS_ORIGIN
   - Use environment-specific database credentials

2. **Docker Production Updates**:
   ```yaml
   backend:
     environment:
       NODE_ENV: production
     command: sh -c "npx prisma db push && npm start"
     # Remove development volume mounts
   ```

3. **Additional Services**:
   - Add Nginx reverse proxy
   - Add SSL/TLS certificates
   - Add monitoring (Prometheus/Grafana)
   - Add log aggregation

4. **Resource Limits**:
   ```yaml
   deploy:
     resources:
       limits:
         memory: 512M
         cpus: '0.5'
   ```

## 🤝 Best Practices Implemented

### Code Quality
- ✅ TypeScript for type safety
- ✅ ESLint for code linting
- ✅ Consistent code formatting
- ✅ Comprehensive error handling
- ✅ Input validation and sanitization

### Architecture
- ✅ Clean separation of concerns
- ✅ Modular component structure
- ✅ Service layer abstraction
- ✅ Repository pattern with Prisma
- ✅ Dependency injection

### Security
- ✅ Input validation
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Security headers
- ✅ Session management

### Performance
- ✅ Redis caching
- ✅ Database query optimization
- ✅ Efficient state management
- ✅ Lazy loading
- ✅ API response optimization

### Testing
- ✅ Unit tests
- ✅ Integration tests
- ✅ API endpoint testing
- ✅ Mock testing
- ✅ High test coverage

### DevOps
- ✅ Containerization with Docker
- ✅ Environment configuration
- ✅ Database migrations
- ✅ Health checks
- ✅ Logging and monitoring

## 🔧 Troubleshooting

### Common Issues

#### Docker Issues
```bash
# Reset Docker environment
npm run docker:down
docker system prune -a
npm run docker:dev
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
docker-compose exec postgres pg_isready -U quiz_user -d quiz_app

# Reset database
docker-compose down -v
docker-compose up -d
```

#### Redis Connection Issues
```bash
# Test Redis connection
docker-compose exec redis redis-cli ping

# View Redis logs
docker-compose logs redis
```

#### Seeding Issues
- Ensure backend is running and accessible
- Check API_BASE_URL in .env
- Verify database connection
- Check logs for detailed error messages

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🎯 Next Steps

- [ ] User authentication system
- [ ] Question categories and tags
- [ ] Quiz history and progress tracking
- [ ] Leaderboards and competitions
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Real-time multiplayer quizzes

---

**Built with ❤️ using modern web technologies and best practices**