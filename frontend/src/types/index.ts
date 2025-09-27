// Backend API types
export const enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface Option {
  optionId: string;
  optionText: string;
}

export interface Topic {
  id: string;
  title: string;
  difficulty: Difficulty;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  questionId: string;
  questionText: string;
  questionImage?: string;
  options: Option[];
}

export interface QuizConfig {
  topicId: string;
  numberOfQuestions: number;
  difficulty: Difficulty;
}

export interface QuizData {
  message: string;
  quizTitle: string;
  quizTimer?: number;
  totalQuestions: number;
  sessionId: string;
  questions: Question[];
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizSubmission {
  topicId: string;
  answers: Record<string, string>; // questionId -> optionId
  sessionId: string;
}

export interface QuestionAnalysis {
  questionId: string;
  questionText: string;
  correctOption: string;
  userSelectedOption: string | null;
  isCorrect: boolean;
  options: Option[];
}

export interface QuizResult {
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

// Frontend specific types
export interface QuizState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  timeRemaining?: number;
  isSubmitted: boolean;
}

export interface TestSelection {
  topicId: string;
  numberOfQuestions: number;
  difficulty: Difficulty;
}