import axios from 'axios';
import type { ApiResponse, Topic, QuizConfig, QuizData, QuizSubmission, QuizResult } from '@/types';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API response interceptor to handle the ApiResponse wrapper
api.interceptors.response.use(
  (response) => {
    // If the response has the ApiResponse format, return the data
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      const apiResponse = response.data as ApiResponse;
      if (apiResponse.success) {
        return { ...response, data: apiResponse.data };
      } else {
        throw new Error(apiResponse.error || apiResponse.message);
      }
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const quizApi = {
  // Get all available topics
  getTopics: async (): Promise<Topic[]> => {
    const response = await api.get<Topic[]>('/topics');
    return response.data;
  },

  // Start a quiz with specified configuration
  startQuiz: async (config: QuizConfig): Promise<QuizData> => {
    const response = await api.post<QuizData>('/quiz/start', config);
    return response.data;
  },

  // Submit quiz answers
  submitQuiz: async (submission: QuizSubmission): Promise<QuizResult> => {
    const response = await api.post<QuizResult>('/quiz/submit', submission);
    return response.data;
  },
};