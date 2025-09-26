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
    answers: Record<string, string>; // questionId -> optionId
  }
  
  export interface QuizResponse {
    message: string;
    quizTitle: string;
    quizTimer?: number;
    totalQuestions: number;
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
    percentage: string;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }