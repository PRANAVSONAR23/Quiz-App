export enum Difficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard'
  }
  
  export interface Option {
    optionId: string;
    optionText: string;
  }
  
  export interface CreateTopicRequest {
    title: string;
    difficulty: Difficulty;
  }
  
  export interface CreateQuestionRequest {
    questionText: string;
    questionImage?: string;
    options: Option[];
    correctOption: string;
    topicId: string;
  }
  
  export interface TakeQuizRequest {
    topicId: string;
    numberOfQuestions: number;
    difficulty: Difficulty;
  }
  
export interface SubmitQuizRequest {
  topicId: string;
  sessionId: string;
  answers: Record<string, string>; // questionId -> optionId
}
  
export interface QuizResponse {
  message: string;
  quizTitle: string;
  quizTimer: number; // Timer in seconds (2 minutes * numberOfQuestions)
  totalQuestions: number;
  sessionId: string;
  questions: QuestionResponse[];
}
  
  export interface QuestionResponse {
    questionId: string;
    questionText: string;
    questionImage?: string;
    options: Option[];
  }
  
export interface SubmitQuizResponse {
  score: number;
  totalQuestions: number;
  attemptedQuestions: number;
  percentage: string;
  questionAnalysis: QuestionAnalysis[];
}
  
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Enhanced types for Redis caching and result analysis
export interface QuestionAnalysis {
  questionId: string;
  questionText: string;
  questionImage?: string;
  correctOption: string;
  userSelectedOption: string | null;
  isCorrect: boolean;
  options: Option[];
}

export interface QuestionWithAnalysis {
  id: string;
  questionText: string;
  questionImage?: string;
  options: Option[];
  correctOption: string;
}

export interface QuizSessionData {
  sessionId: string;
  topicId: string;
  topicTitle: string;
  difficulty: Difficulty;
  requestedQuestions: number;
  totalQuestionsInTopic: number;
  allQuestions: QuestionWithAnalysis[];
  selectedQuestions: QuestionWithAnalysis[];
  startTime: string;
  expiresAt: string;
}