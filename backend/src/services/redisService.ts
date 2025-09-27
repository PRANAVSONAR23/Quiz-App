import Redis from 'ioredis';
import { QuizSessionData, QuestionWithAnalysis } from '../types';

class RedisService {
  private client: Redis;
  private ttl: number;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000,
      commandTimeout: 5000,
    });
    
    this.ttl = parseInt(process.env.REDIS_TTL || '7200'); // Default 2 hours

    this.client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  // Quiz Session Management
  async setQuizSession(sessionId: string, data: QuizSessionData): Promise<void> {
    const key = this.getSessionKey(sessionId);
    await this.client.setex(key, this.ttl, JSON.stringify(data));
  }

  async getQuizSession(sessionId: string): Promise<QuizSessionData | null> {
    const key = this.getSessionKey(sessionId);
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteQuizSession(sessionId: string): Promise<void> {
    const key = this.getSessionKey(sessionId);
    await this.client.del(key);
  }

  async extendQuizSession(sessionId: string): Promise<void> {
    const key = this.getSessionKey(sessionId);
    await this.client.expire(key, this.ttl);
  }

  // Topic Questions Caching
  async setTopicQuestions(topicId: string, difficulty: string, questions: QuestionWithAnalysis[]): Promise<void> {
    const key = this.getTopicQuestionsKey(topicId, difficulty);
    await this.client.setex(key, this.ttl, JSON.stringify(questions));
  }

  async getTopicQuestions(topicId: string, difficulty: string): Promise<QuestionWithAnalysis[] | null> {
    const key = this.getTopicQuestionsKey(topicId, difficulty);
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  // General caching utilities
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, serializedValue);
    } else {
      await this.client.setex(key, this.ttl, serializedValue);
    }
  }

  async get(key: string): Promise<any | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async flushAll(): Promise<void> {
    await this.client.flushall();
  }

  // Key generation helpers
  private getSessionKey(sessionId: string): string {
    return `quiz_session:${sessionId}`;
  }

  private getTopicQuestionsKey(topicId: string, difficulty: string): string {
    return `topic_questions:${topicId}:${difficulty}`;
  }

  // Health check
  async ping(): Promise<string> {
    return await this.client.ping();
  }

  // Get connection status
  isConnected(): boolean {
    return this.client.status === 'ready';
  }
}

// Export singleton instance
export const redisService = new RedisService();
export default redisService;