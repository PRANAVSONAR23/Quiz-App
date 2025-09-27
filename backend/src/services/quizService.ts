import prisma from '../utils/database';
import { 
  CreateTopicRequest, 
  CreateQuestionRequest, 
  TakeQuizRequest, 
  SubmitQuizRequest,
  QuestionResponse,
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

    const questions = await prisma.question.findMany({
      where: {
        topicId: data.topicId,
      },
      take: data.numberOfQuestions
    });

    if (questions.length < data.numberOfQuestions) {
      throw new Error('INSUFFICIENT_QUESTIONS');
    }

    const questionResponses: QuestionResponse[] = questions.map(q => ({
      questionId: q.id,
      questionText: q.questionText,
      questionImage: q.questionImage || undefined,
      options: JSON.parse(q.options as string) as Option[]
    }));

    return {
      message: 'Quiz started successfully',
      quizTitle: topic.title,
      totalQuestions: questions.length,
      questions: questionResponses
    };
  }

  async submitQuiz(data: SubmitQuizRequest) {
    const questionIds = Object.keys(data.answers);
    const questions = await prisma.question.findMany({
      where: {
        id: { in: questionIds },
        topicId: data.topicId
      }
    });

    if (questions.length !== questionIds.length) {
      throw new Error('INVALID_QUESTIONS');
    }

    let score = 0;
    for (const question of questions) {
      const userAnswer = data.answers[question.id];
      if (userAnswer === question.correctOption) {
        score++;
      }
    }

    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    return {
      score,
      totalQuestions,
      percentage: `${percentage}%`
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