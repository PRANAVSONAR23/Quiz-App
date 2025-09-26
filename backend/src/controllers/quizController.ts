import { Request, Response, NextFunction } from 'express';
import { QuizService } from '../services/quizService';
import { sendSuccess, sendError } from '../utils/responses';
import { 
  CreateTopicRequest, 
  CreateQuestionRequest, 
  TakeQuizRequest, 
  SubmitQuizRequest 
} from '../types';

const quizService = new QuizService();

export class QuizController {
  
  async createTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateTopicRequest = req.body;
      const topic = await quizService.createTopic(data);
      
      sendSuccess(res, topic, 'Topic created successfully', 201);
    } catch (error: any) {
      if (error.message === 'TOPIC_EXISTS') {
        sendError(res, 'Topic creation failed', 409, 'Quiz already exists');
        return;
      }
      next(error);
    }
  }

  async addQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { questions }: { questions: CreateQuestionRequest[] } = req.body;
      
      await quizService.addQuestions(questions);
      
      sendSuccess(res, null, 'Questions added successfully', 201);
    } catch (error: any) {
      if (error.message === 'INVALID_TOPIC') {
        sendError(res, 'Failed to add questions', 404, 'Invalid topic ID');
        return;
      }
      if (error.message === 'INVALID_CORRECT_OPTION') {
        sendError(res, 'Validation failed', 400, 'Correct option must be one of the provided options');
        return;
      }
      next(error);
    }
  }

  async takeQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: TakeQuizRequest = req.body;
      const quizData = await quizService.takeQuiz(data);
      
      sendSuccess(res, quizData, 'Quiz data retrieved successfully');
    } catch (error: any) {
      if (error.message === 'TOPIC_NOT_FOUND') {
        sendError(res, 'Failed to start quiz', 404, 'Topic not found');
        return;
      }
      if (error.message === 'INSUFFICIENT_QUESTIONS') {
        sendError(res, 'Failed to start quiz', 400, 'Not enough questions available for the specified difficulty');
        return;
      }
      next(error);
    }
  }

  async submitQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: SubmitQuizRequest = req.body;
      const result = await quizService.submitQuiz(data);
      
      sendSuccess(res, result, 'Quiz submitted successfully');
    } catch (error: any) {
      if (error.message === 'INVALID_QUESTIONS') {
        sendError(res, 'Failed to submit quiz', 400, 'Invalid question IDs or topic mismatch');
        return;
      }
      next(error);
    }
  }

  async getAllTopics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const topics = await quizService.getAllTopics();
      
      sendSuccess(res, topics, 'Topics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}