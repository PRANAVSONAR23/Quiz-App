import prisma from '../utils/database';
import redisService from './redisService';
import { v4 as uuidv4 } from 'uuid';
import { 
  CreateTopicRequest, 
  CreateQuestionRequest, 
  TakeQuizRequest, 
  SubmitQuizRequest,
  QuestionResponse,
  QuestionWithAnalysis,
  QuizSessionData,
  QuestionAnalysis,
  Option 
} from '../types';

export class QuizService {
  
  async createTopic(data: CreateTopicRequest) {
    const existingTopic = await prisma.topic.findUnique({
      where: { title: data.title }
    });

    if (existingTopic) {
      throw new Error('TOPIC_EXISTS');
    }

    return await prisma.topic.create({
      data: {
        title: data.title,
        difficulty: data.difficulty
      }
    });
  }

  async addQuestions(questions: CreateQuestionRequest[]) {
    // Verify all topics exist
    const topicIds = [...new Set(questions.map(q => q.topicId))];
    const topics = await prisma.topic.findMany({
      where: { id: { in: topicIds } }
    });

    if (topics.length !== topicIds.length) {
      throw new Error('INVALID_TOPIC');
    }

    // Validate options and correct answers
    for (const question of questions) {
      const optionIds = question.options.map(opt => opt.optionId);
      if (!optionIds.includes(question.correctOption)) {
        throw new Error('INVALID_CORRECT_OPTION');
      }
    }

    return await prisma.question.createMany({
      data: questions.map(q => ({
        questionText: q.questionText,
        questionImage: q.questionImage,
        options: JSON.stringify(q.options),
        correctOption: q.correctOption,
        topicId: q.topicId
      }))
    });
  }

  async takeQuiz(data: TakeQuizRequest) {
    const topic = await prisma.topic.findUnique({
      where: { id: data.topicId }
    });

    if (!topic) {
      throw new Error('TOPIC_NOT_FOUND');
    }

    // Check if we have cached questions for this topic/difficulty
    let allQuestions = await redisService.getTopicQuestions(data.topicId, data.difficulty);
    
    if (!allQuestions) {
      // Fetch all questions from database for this topic/difficulty
      const dbQuestions = await prisma.question.findMany({
        where: {
          topicId: data.topicId,
        }
      });

      // Transform to our format and cache
      allQuestions = dbQuestions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        questionImage: q.questionImage || undefined,
        options: JSON.parse(q.options as string) as Option[],
        correctOption: q.correctOption
      }));

      // Cache the questions for this topic/difficulty
      await redisService.setTopicQuestions(data.topicId, data.difficulty, allQuestions);
    }

    const totalQuestionsInTopic = allQuestions.length;

    if (totalQuestionsInTopic < data.numberOfQuestions) {
      throw new Error('INSUFFICIENT_QUESTIONS');
    }

    // Randomly select the requested number of questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, data.numberOfQuestions);

    // Generate unique session ID
    const sessionId = uuidv4();
    const startTime = new Date().toISOString();
    const expiresAt = new Date(Date.now() + parseInt(process.env.REDIS_TTL || '7200') * 1000).toISOString();

    // Create quiz session data
    const sessionData: QuizSessionData = {
      sessionId,
      topicId: data.topicId,
      topicTitle: topic.title,
      difficulty: data.difficulty,
      requestedQuestions: data.numberOfQuestions,
      totalQuestionsInTopic,
      allQuestions,
      selectedQuestions,
      startTime,
      expiresAt
    };

    // Store session in Redis
    await redisService.setQuizSession(sessionId, sessionData);

    // Prepare response (without correct answers)
    const questionResponses: QuestionResponse[] = selectedQuestions.map(q => ({
      questionId: q.id,
      questionText: q.questionText,
      questionImage: q.questionImage,
      options: q.options
    }));

    return {
      message: 'Quiz started successfully',
      quizTitle: topic.title,
      totalQuestions: data.numberOfQuestions,
      sessionId,
      questions: questionResponses
    };
  }

  async submitQuiz(data: SubmitQuizRequest) {
    // Retrieve quiz session from Redis
    const sessionData = await redisService.getQuizSession(data.sessionId);
    
    if (!sessionData) {
      throw new Error('INVALID_SESSION');
    }

    if (sessionData.topicId !== data.topicId) {
      throw new Error('TOPIC_MISMATCH');
    }

    const { selectedQuestions,requestedQuestions } = sessionData;
    
    // Create detailed analysis for each question
    const questionAnalysis: QuestionAnalysis[] = selectedQuestions.map(question => {
      const userSelectedOption = data.answers[question.id] || null;
      const isCorrect = userSelectedOption === question.correctOption;

      return {
        questionId: question.id,
        questionText: question.questionText,
        questionImage: question.questionImage,
        correctOption: question.correctOption,
        userSelectedOption,
        isCorrect,
        options: question.options
      };
    });

    // Calculate scores
    const score = questionAnalysis.filter(q => q.isCorrect).length;
    const attemptedQuestions = Object.keys(data.answers).length;
    const percentage = Math.round((score / requestedQuestions) * 100);

    // Clean up session after use (optional - could keep for review)
    await redisService.deleteQuizSession(data.sessionId);

    return {
      score,
      totalQuestions: requestedQuestions, // Total questions in the topic
      attemptedQuestions: attemptedQuestions, // Questions in this quiz attempt
      percentage: `${percentage}%`,
      questionAnalysis
    };
  }

  async getAllTopics() {
    return await prisma.topic.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
        createdAt: true,
        _count: {
          select: {
            questions: true
          }
        }
      }
    });
  }
}