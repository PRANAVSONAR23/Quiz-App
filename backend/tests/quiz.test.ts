import supertest from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import router from '../src/routes/quizRoutes';
import prisma from '../src/utils/database';
import redisService from '../src/services/redisService';
import { Difficulty } from '../src/types';

jest.mock('../src/utils/database', () => ({
  __esModule: true,
  default: {
    topic: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    question: {
      findMany: jest.fn(),
      createMany: jest.fn(),
    },
  },
}));

jest.mock('../src/services/redisService', () => ({
  __esModule: true,
  default: {
    setQuizSession: jest.fn(),
    getQuizSession: jest.fn(),
    deleteQuizSession: jest.fn(),
    setTopicQuestions: jest.fn(),
    getTopicQuestions: jest.fn(),
  },
}));

const mockTopicFindUnique = prisma.topic.findUnique as jest.Mock;
const mockTopicFindMany = prisma.topic.findMany as jest.Mock;
const mockTopicCreate = prisma.topic.create as jest.Mock;
const mockQuestionFindMany = prisma.question.findMany as jest.Mock;
const mockQuestionCreateMany = prisma.question.createMany as jest.Mock;

const mockRedisSetQuizSession = redisService.setQuizSession as jest.Mock;
const mockRedisGetQuizSession = redisService.getQuizSession as jest.Mock;
const mockRedisDeleteQuizSession = redisService.deleteQuizSession as jest.Mock;
const mockRedisSetTopicQuestions = redisService.setTopicQuestions as jest.Mock;
const mockRedisGetTopicQuestions = redisService.getTopicQuestions as jest.Mock;

const app = express();
app.use(bodyParser.json());
app.use(router);

const request = supertest(app);

describe('Quiz API', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockTopicFindUnique.mockReset();
    mockTopicFindMany.mockReset();
    mockTopicCreate.mockReset();
    mockQuestionFindMany.mockReset();
    mockQuestionCreateMany.mockReset();
    mockRedisSetQuizSession.mockReset();
    mockRedisGetQuizSession.mockReset();
    mockRedisDeleteQuizSession.mockReset();
    mockRedisSetTopicQuestions.mockReset();
    mockRedisGetTopicQuestions.mockReset();
  });

  describe('POST /topics', () => {
    it('should create a new topic successfully', async () => {
      mockTopicFindUnique.mockResolvedValue(null);
      mockTopicCreate.mockResolvedValue({
        id: 'topic1',
        title: 'Math',
        difficulty: Difficulty.EASY,
        createdAt: new Date(),
      });

      const response = await request
        .post('/topics')
        .send({ title: 'Math', difficulty: Difficulty.EASY });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Topic created successfully');
      expect(response.body.data.title).toBe('Math');
      expect(mockTopicCreate).toHaveBeenCalledWith({
        data: { title: 'Math', difficulty: Difficulty.EASY },
      });
    });

    it('should return 409 if topic already exists', async () => {
      mockTopicFindUnique.mockResolvedValue({
        id: 'topic1',
        title: 'Math',
        difficulty: Difficulty.EASY,
        createdAt: new Date(),
      });

      const response = await request
        .post('/topics')
        .send({ title: 'Math', difficulty: Difficulty.EASY });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Quiz already exists');
    });
  });

  describe('GET /topics', () => {
    it('should retrieve all topics successfully', async () => {
      const testDate = new Date();
      const mockTopics = [
        {
          id: 'topic1',
          title: 'Math',
          difficulty: Difficulty.EASY,
          createdAt: testDate,
          _count: { questions: 5 },
        },
      ];
      mockTopicFindMany.mockResolvedValue(mockTopics);

      const response = await request.get('/topics');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Topics retrieved successfully');
      expect(response.body.data).toEqual([
        {
          id: 'topic1',
          title: 'Math',
          difficulty: Difficulty.EASY,
          createdAt: testDate.toISOString(),
          _count: { questions: 5 },
        },
      ]);
      expect(mockTopicFindMany).toHaveBeenCalledWith({
        select: {
          id: true,
          title: true,
          difficulty: true,
          createdAt: true,
          _count: { select: { questions: true } },
        },
      });
    });
  });

  describe('POST /questions', () => {
    it('should add questions successfully', async () => {
      const mockQuestions = [
        {
          questionText: 'What is 2+2?',
          options: [
            { optionId: 'a', optionText: '4' },
            { optionId: 'b', optionText: '5' },
          ],
          correctOption: 'a',
          topicId: 'topic1',
        },
      ];
      mockTopicFindMany.mockResolvedValue([{ id: 'topic1', title: 'Math', difficulty: Difficulty.EASY, createdAt: new Date() }]);
      mockQuestionCreateMany.mockResolvedValue({ count: 1 });

      const response = await request
        .post('/questions')
        .send({ questions: mockQuestions });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Questions added successfully');
      expect(mockQuestionCreateMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            questionText: 'What is 2+2?',
            options: JSON.stringify(mockQuestions[0].options),
            correctOption: 'a',
            topicId: 'topic1',
          }),
        ]),
      });
    });

    it('should return 404 if invalid topic', async () => {
      const mockQuestions = [
        {
          questionText: 'What is 2+2?',
          options: [
            { optionId: 'a', optionText: '4' },
            { optionId: 'b', optionText: '5' },
          ],
          correctOption: 'a',
          topicId: 'invalid',
        },
      ];
      mockTopicFindMany.mockResolvedValue([]);

      const response = await request
        .post('/questions')
        .send({ questions: mockQuestions });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid topic ID');
    });

    it('should return 400 if invalid correct option', async () => {
      const mockQuestions = [
        {
          questionText: 'What is 2+2?',
          options: [
            { optionId: 'a', optionText: '4' },
            { optionId: 'b', optionText: '5' },
          ],
          correctOption: 'c', // Invalid
          topicId: 'topic1',
        },
      ];
      mockTopicFindMany.mockResolvedValue([{ id: 'topic1', title: 'Math', difficulty: Difficulty.EASY, createdAt: new Date() }]);

      const response = await request
        .post('/questions')
        .send({ questions: mockQuestions });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Correct option must be one of the provided options');
    });
  });

  describe('POST /quiz/start', () => {
    it('should start a quiz successfully', async () => {
      const mockTopic = { id: 'topic1', title: 'Math', difficulty: Difficulty.EASY, createdAt: new Date() };
      const mockQuestions = [
        {
          id: 'q1',
          questionText: 'What is 2+2?',
          questionImage: null,
          options: JSON.stringify([{ optionId: 'a', optionText: '4' }, { optionId: 'b', optionText: '5' }]),
          correctOption: 'a',
          topicId: 'topic1',
          createdAt: new Date(),
        },
      ];
      mockTopicFindUnique.mockResolvedValue(mockTopic);
      mockRedisGetTopicQuestions.mockResolvedValue(null); // No cached questions
      mockQuestionFindMany.mockResolvedValue(mockQuestions);
      mockRedisSetTopicQuestions.mockResolvedValue(undefined);
      mockRedisSetQuizSession.mockResolvedValue(undefined);

      const response = await request
        .post('/quiz/start')
        .send({ topicId: 'topic1', numberOfQuestions: 1, difficulty: Difficulty.EASY });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Quiz data retrieved successfully');
      expect(response.body.data.quizTitle).toBe('Math');
      expect(response.body.data.questions).toHaveLength(1);
      expect(response.body.data.sessionId).toBeDefined();
      expect(response.body.data.totalQuestions).toBe(1);
      expect(response.body.data.quizTimer).toBe(60); // 1 question * 2 minutes * 60 seconds
      expect(mockRedisSetQuizSession).toHaveBeenCalled();
    });

    it('should start a quiz with cached questions', async () => {
      const mockTopic = { id: 'topic1', title: 'Math', difficulty: Difficulty.EASY, createdAt: new Date() };
      const cachedQuestions = [
        {
          id: 'q1',
          questionText: 'What is 2+2?',
          questionImage: undefined,
          options: [{ optionId: 'a', optionText: '4' }, { optionId: 'b', optionText: '5' }],
          correctOption: 'a'
        }
      ];
      
      mockTopicFindUnique.mockResolvedValue(mockTopic);
      mockRedisGetTopicQuestions.mockResolvedValue(cachedQuestions); // Return cached questions
      mockRedisSetQuizSession.mockResolvedValue(undefined);

      const response = await request
        .post('/quiz/start')
        .send({ topicId: 'topic1', numberOfQuestions: 1, difficulty: Difficulty.EASY });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.questions).toHaveLength(1);
      expect(response.body.data.quizTimer).toBe(60); // 1 question * 2 minutes * 60 seconds
      expect(mockQuestionFindMany).not.toHaveBeenCalled(); // Should not query DB for questions
      expect(mockRedisSetTopicQuestions).not.toHaveBeenCalled(); // Should not cache again
    });

    it('should return 404 if topic not found', async () => {
      mockTopicFindUnique.mockResolvedValue(null);

      const response = await request
        .post('/quiz/start')
        .send({ topicId: 'invalid', numberOfQuestions: 1, difficulty: Difficulty.EASY });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Topic not found');
    });

    it('should return 400 if insufficient questions', async () => {
      const mockTopic = { id: 'topic1', title: 'Math', difficulty: Difficulty.EASY, createdAt: new Date() };
      mockTopicFindUnique.mockResolvedValue(mockTopic);
      mockRedisGetTopicQuestions.mockResolvedValue(null); // No cached questions
      mockQuestionFindMany.mockResolvedValue([]); // No questions
      mockRedisSetTopicQuestions.mockResolvedValue(undefined);

      const response = await request
        .post('/quiz/start')
        .send({ topicId: 'topic1', numberOfQuestions: 1, difficulty: Difficulty.EASY });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not enough questions available for the specified difficulty');
    });

    it('should calculate timer correctly for multiple questions', async () => {
      const mockTopic = { id: 'topic1', title: 'Math', difficulty: Difficulty.EASY, createdAt: new Date() };
      const mockQuestions = [
        {
          id: 'q1',
          questionText: 'What is 2+2?',
          questionImage: null,
          options: JSON.stringify([{ optionId: 'a', optionText: '4' }, { optionId: 'b', optionText: '5' }]),
          correctOption: 'a',
          topicId: 'topic1',
          createdAt: new Date(),
        },
        {
          id: 'q2',
          questionText: 'What is 3+3?',
          questionImage: null,
          options: JSON.stringify([{ optionId: 'a', optionText: '6' }, { optionId: 'b', optionText: '7' }]),
          correctOption: 'a',
          topicId: 'topic1',
          createdAt: new Date(),
        },
        {
          id: 'q3',
          questionText: 'What is 4+4?',
          questionImage: null,
          options: JSON.stringify([{ optionId: 'a', optionText: '8' }, { optionId: 'b', optionText: '9' }]),
          correctOption: 'a',
          topicId: 'topic1',
          createdAt: new Date(),
        },
        {
          id: 'q4',
          questionText: 'What is 5+5?',
          questionImage: null,
          options: JSON.stringify([{ optionId: 'a', optionText: '10' }, { optionId: 'b', optionText: '11' }]),
          correctOption: 'a',
          topicId: 'topic1',
          createdAt: new Date(),
        },
        {
          id: 'q5',
          questionText: 'What is 6+6?',
          questionImage: null,
          options: JSON.stringify([{ optionId: 'a', optionText: '12' }, { optionId: 'b', optionText: '13' }]),
          correctOption: 'a',
          topicId: 'topic1',
          createdAt: new Date(),
        },
      ];
      
      mockTopicFindUnique.mockResolvedValue(mockTopic);
      mockRedisGetTopicQuestions.mockResolvedValue(null);
      mockQuestionFindMany.mockResolvedValue(mockQuestions);
      mockRedisSetTopicQuestions.mockResolvedValue(undefined);
      mockRedisSetQuizSession.mockResolvedValue(undefined);

      const response = await request
        .post('/quiz/start')
        .send({ topicId: 'topic1', numberOfQuestions: 5, difficulty: Difficulty.EASY });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalQuestions).toBe(5);
      expect(response.body.data.quizTimer).toBe(300); // 5 questions * 2 minutes * 60 seconds = 600 seconds
      expect(response.body.data.questions).toHaveLength(5);
    });

    it('should calculate timer correctly for 10 questions', async () => {
      const mockTopic = { id: 'topic1', title: 'Math', difficulty: Difficulty.MEDIUM, createdAt: new Date() };
      // Create 10 mock questions
      const mockQuestions = Array.from({ length: 10 }, (_, i) => ({
        id: `q${i + 1}`,
        questionText: `Question ${i + 1}`,
        questionImage: null,
        options: JSON.stringify([
          { optionId: 'a', optionText: 'Option A' },
          { optionId: 'b', optionText: 'Option B' }
        ]),
        correctOption: 'a',
        topicId: 'topic1',
        createdAt: new Date(),
      }));
      
      mockTopicFindUnique.mockResolvedValue(mockTopic);
      mockRedisGetTopicQuestions.mockResolvedValue(null);
      mockQuestionFindMany.mockResolvedValue(mockQuestions);
      mockRedisSetTopicQuestions.mockResolvedValue(undefined);
      mockRedisSetQuizSession.mockResolvedValue(undefined);

      const response = await request
        .post('/quiz/start')
        .send({ topicId: 'topic1', numberOfQuestions: 10, difficulty: Difficulty.MEDIUM });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalQuestions).toBe(10);
      expect(response.body.data.quizTimer).toBe(600); // 10 questions * 2 minutes * 60 seconds = 1200 seconds (20 minutes)
      expect(response.body.data.questions).toHaveLength(10);
    });

    it('should calculate timer correctly for single question', async () => {
      const mockTopic = { id: 'topic1', title: 'Math', difficulty: Difficulty.HARD, createdAt: new Date() };
      const mockQuestions = [
        {
          id: 'q1',
          questionText: 'Hard question',
          questionImage: null,
          options: JSON.stringify([{ optionId: 'a', optionText: 'Answer A' }, { optionId: 'b', optionText: 'Answer B' }]),
          correctOption: 'a',
          topicId: 'topic1',
          createdAt: new Date(),
        },
      ];
      
      mockTopicFindUnique.mockResolvedValue(mockTopic);
      mockRedisGetTopicQuestions.mockResolvedValue(null);
      mockQuestionFindMany.mockResolvedValue(mockQuestions);
      mockRedisSetTopicQuestions.mockResolvedValue(undefined);
      mockRedisSetQuizSession.mockResolvedValue(undefined);

      const response = await request
        .post('/quiz/start')
        .send({ topicId: 'topic1', numberOfQuestions: 1, difficulty: Difficulty.HARD });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalQuestions).toBe(1);
      expect(response.body.data.quizTimer).toBe(60); // 1 question * 2 minutes * 60 seconds = 120 seconds
      expect(response.body.data.questions).toHaveLength(1);
    });
  });

  describe('POST /quiz/submit', () => {
    it('should submit a quiz successfully', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID v4
      const mockSessionData = {
        sessionId,
        topicId: 'topic1',
        topicTitle: 'Math',
        difficulty: Difficulty.EASY,
        requestedQuestions: 1,
        totalQuestionsInTopic: 5,
        allQuestions: [],
        selectedQuestions: [
          {
            id: 'q1',
            questionText: 'What is 2+2?',
            questionImage: undefined,
            options: [{ optionId: 'a', optionText: '4' }, { optionId: 'b', optionText: '5' }],
            correctOption: 'a'
          }
        ],
        startTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7200000).toISOString()
      };
      
      mockRedisGetQuizSession.mockResolvedValue(mockSessionData);
      mockRedisDeleteQuizSession.mockResolvedValue(undefined);

      const response = await request
        .post('/quiz/submit')
        .send({ topicId: 'topic1', sessionId, answers: { q1: 'a' } });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Quiz submitted successfully');
      expect(response.body.data.score).toBe(1);
      expect(response.body.data.totalQuestions).toBe(1);
      expect(response.body.data.attemptedQuestions).toBe(1);
      expect(response.body.data.percentage).toBe('100%');
      expect(response.body.data.questionAnalysis).toHaveLength(1);
      expect(response.body.data.questionAnalysis[0].isCorrect).toBe(true);
      expect(mockRedisDeleteQuizSession).toHaveBeenCalledWith(sessionId);
    });

    it('should return 400 if invalid session', async () => {
      mockRedisGetQuizSession.mockResolvedValue(null); // No session found

      const response = await request
        .post('/quiz/submit')
        .send({ topicId: 'topic1', sessionId: '550e8400-e29b-41d4-a716-446655440001', answers: { q1: 'a' } });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid or expired session');
    });

    it('should return 400 if topic mismatch', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440002'; // Valid UUID v4
      const mockSessionData = {
        sessionId,
        topicId: 'different-topic',
        topicTitle: 'Science',
        difficulty: Difficulty.EASY,
        requestedQuestions: 1,
        totalQuestionsInTopic: 5,
        allQuestions: [],
        selectedQuestions: [],
        startTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7200000).toISOString()
      };
      
      mockRedisGetQuizSession.mockResolvedValue(mockSessionData);

      const response = await request
        .post('/quiz/submit')
        .send({ topicId: 'topic1', sessionId, answers: { q1: 'a' } });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Topic mismatch with session');
    });
  });
});