# Docker Setup Guide

This guide explains how to run the Quiz App backend using Docker.

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)

## Quick Start

1. **Clone and navigate to the project:**
   ```bash
   cd backend
   ```

2. **Create environment file:**
   ```bash
   cp env.example .env
   ```

3. **Start all services:**
   ```bash
   npm run docker:dev
   ```

   This will start:
   - PostgreSQL database on port 5432
   - Redis cache on port 6379  
   - Backend API on port 5000

4. **Check if services are running:**
   ```bash
   docker-compose ps
   ```

5. **View logs:**
   ```bash
   npm run docker:logs
   ```

## Available Commands

```bash
# Build Docker image
npm run docker:build

# Start services in background
npm run docker:up

# Start services with build (development)
npm run docker:dev

# Stop all services
npm run docker:down

# View backend logs
npm run docker:logs

# View all services logs
docker-compose logs -f
```

## Service Details

### Backend Application
- **Port:** 5000
- **Health Check:** http://localhost:5000/health
- **Environment:** Development mode with hot reload

### PostgreSQL Database  
- **Port:** 5432
- **Database:** quiz_app
- **Username:** quiz_user
- **Password:** quiz_password

### Redis Cache
- **Port:** 6379
- **Memory Limit:** 256MB
- **Policy:** allkeys-lru

## Environment Variables

Key environment variables for Docker setup:

```bash
# Database
DATABASE_URL=postgresql://quiz_user:quiz_password@postgres:5432/quiz_app

# Redis
REDIS_URL=redis://redis:6379
REDIS_TTL=7200  # 2 hours

# Application
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Production Deployment Changes

For production deployment, make these changes:

### 1. Update docker-compose.yml:
```yaml
backend:
  environment:
    NODE_ENV: production
  command: sh -c "npx prisma db push && npm start"
  # Remove volume mounts for hot reload
```

### 2. Environment Security:
- Use strong, random JWT_SECRET
- Use environment-specific database credentials
- Set proper CORS_ORIGIN for your frontend domain
- Use Docker secrets for sensitive data

### 3. Additional Production Services:
```yaml
# Add Nginx reverse proxy
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf

# Add monitoring (optional)
monitoring:
  image: prom/prometheus
  # ... prometheus config
```

### 4. Resource Limits:
```yaml
backend:
  deploy:
    resources:
      limits:
        memory: 512M
        cpus: '0.5'
      reservations:
        memory: 256M
```

## Troubleshooting

### Database Connection Issues:
```bash
# Check if PostgreSQL is ready
docker-compose exec postgres pg_isready -U quiz_user -d quiz_app

# Reset database
docker-compose down -v
docker-compose up -d
```

### Redis Connection Issues:
```bash
# Test Redis connection
docker-compose exec redis redis-cli ping

# View Redis logs
docker-compose logs redis
```

### Backend Issues:
```bash
# View detailed logs
docker-compose logs backend

# Restart just the backend
docker-compose restart backend

# Rebuild backend image
docker-compose up --build backend
```

### Clean Restart:
```bash
# Stop everything and remove volumes
docker-compose down -v

# Remove images (optional)
docker system prune -a

# Fresh start
npm run docker:dev
```

## Development Workflow

1. **Code Changes:** Files are mounted as volumes, so changes are reflected immediately
2. **Database Changes:** Update Prisma schema and restart backend service
3. **Dependency Changes:** Rebuild the Docker image with `npm run docker:dev`
4. **Environment Changes:** Update `.env` and restart services

## Monitoring

- **Health Check:** http://localhost:5000/health
- **Database Admin:** Connect to PostgreSQL on localhost:5432
- **Redis CLI:** `docker-compose exec redis redis-cli`
- **Logs:** `npm run docker:logs`