import supertest from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import router from '../src/routes/quizRoutes'; // Adjust if the file name is different, based on your export default router;
import prisma from '../src/utils/database';
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

const mockTopicFindUnique = prisma.topic.findUnique as jest.Mock;
const mockTopicFindMany = prisma.topic.findMany as jest.Mock;
const mockTopicCreate = prisma.topic.create as jest.Mock;
const mockQuestionFindMany = prisma.question.findMany as jest.Mock;
const mockQuestionCreateMany = prisma.question.createMany as jest.Mock;

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
      const mockTopics = [
        {
          id: 'topic1',
          title: 'Math',
          difficulty: Difficulty.EASY,
          createdAt: new Date(),
          _count: { questions: 5 },
        },
      ];
      mockTopicFindMany.mockResolvedValue(mockTopics);

      const response = await request.get('/topics');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Topics retrieved successfully');
      expect(response.body.data).toEqual(mockTopics);
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
      mockQuestionFindMany.mockResolvedValue(mockQuestions);

      const response = await request
        .post('/quiz/start')
        .send({ topicId: 'topic1', numberOfQuestions: 1, difficulty: Difficulty.EASY });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Quiz data retrieved successfully');
      expect(response.body.data.quizTitle).toBe('Math');
      expect(response.body.data.questions).toHaveLength(1);
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
      mockQuestionFindMany.mockResolvedValue([]); // No questions

      const response = await request
        .post('/quiz/start')
        .send({ topicId: 'topic1', numberOfQuestions: 1, difficulty: Difficulty.EASY });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not enough questions available for the specified difficulty');
    });
  });

  describe('POST /quiz/submit', () => {
    it('should submit a quiz successfully', async () => {
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
      mockQuestionFindMany.mockResolvedValue(mockQuestions);

      const response = await request
        .post('/quiz/submit')
        .send({ topicId: 'topic1', answers: { q1: 'a' } });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Quiz submitted successfully');
      expect(response.body.data.score).toBe(1);
      expect(response.body.data.totalQuestions).toBe(1);
      expect(response.body.data.percentage).toBe('100%');
    });

    it('should return 400 if invalid questions', async () => {
      mockQuestionFindMany.mockResolvedValue([]); // No matching questions

      const response = await request
        .post('/quiz/submit')
        .send({ topicId: 'topic1', answers: { q1: 'a' } });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid question IDs or topic mismatch');
    });
  });
});