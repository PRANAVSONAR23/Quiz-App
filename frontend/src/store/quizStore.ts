import { create } from 'zustand';
import type { QuizData, QuizAnswer, QuizState, TestSelection, QuizResult } from '@/types';

interface QuizStore extends QuizState {
  // Quiz data
  quizData: QuizData | null;
  testSelection: TestSelection | null;
  quizResult: QuizResult | null;
  sessionId: string | null;
  
  // Actions
  setTestSelection: (selection: TestSelection) => void;
  setQuizData: (data: QuizData) => void;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: string, optionId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setQuizResult: (result: QuizResult) => void;
  resetQuiz: () => void;
  
  // Derived state
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  progressPercentage: number;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  // Initial state
  currentQuestionIndex: 0,
  answers: [],
  timeRemaining: undefined,
  isSubmitted: false,
  quizData: null,
  testSelection: null,
  quizResult: null,
  sessionId: null,
  isFirstQuestion: true,
  isLastQuestion: false,
  progressPercentage: 0,

  // Actions
  setTestSelection: (selection) => {
    set({ testSelection: selection });
  },

  setQuizData: (data) => {
    set({
      quizData: data,
      sessionId: data.sessionId,
      currentQuestionIndex: 0,
      answers: [],
      isSubmitted: false,
      timeRemaining: data.quizTimer,
      isFirstQuestion: true,
      isLastQuestion: data.questions.length === 1,
      progressPercentage: 0,
    });
  },

  setCurrentQuestion: (index) => {
    const { quizData } = get();
    if (!quizData) return;
    
    const validIndex = Math.max(0, Math.min(index, quizData.questions.length - 1));
    set({
      currentQuestionIndex: validIndex,
      isFirstQuestion: validIndex === 0,
      isLastQuestion: validIndex === quizData.questions.length - 1,
      progressPercentage: ((validIndex + 1) / quizData.questions.length) * 100,
    });
  },

  setAnswer: (questionId, optionId) => {
    set((state) => {
      const existingAnswerIndex = state.answers.findIndex(
        (answer) => answer.questionId === questionId
      );

      const newAnswer: QuizAnswer = { questionId, selectedOptionId: optionId };

      if (existingAnswerIndex >= 0) {
        // Update existing answer
        const newAnswers = [...state.answers];
        newAnswers[existingAnswerIndex] = newAnswer;
        return { answers: newAnswers };
      } else {
        // Add new answer
        return { answers: [...state.answers, newAnswer] };
      }
    });
  },

  nextQuestion: () => {
    const { currentQuestionIndex, quizData } = get();
    if (!quizData || currentQuestionIndex >= quizData.questions.length - 1) return;
    
    get().setCurrentQuestion(currentQuestionIndex + 1);
  },

  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex <= 0) return;
    
    get().setCurrentQuestion(currentQuestionIndex - 1);
  },

  setQuizResult: (result) => {
    set({ quizResult: result, isSubmitted: true });
  },

  resetQuiz: () => {
    set({
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: undefined,
      isSubmitted: false,
      quizData: null,
      testSelection: null,
      quizResult: null,
      sessionId: null,
      isFirstQuestion: true,
      isLastQuestion: false,
      progressPercentage: 0,
    });
  },
}));