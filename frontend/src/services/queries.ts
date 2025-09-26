import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizApi } from './api';
import type { QuizConfig } from '@/types';

// Query keys
export const queryKeys = {
  topics: ['topics'],
  quiz: (config: QuizConfig) => ['quiz', config],
} as const;

// Custom hooks for API calls
export const useTopics = () => {
  return useQuery({
    queryKey: queryKeys.topics,
    queryFn: quizApi.getTopics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStartQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: quizApi.startQuiz,
    onSuccess: (data, variables) => {
      // Cache the quiz data
      queryClient.setQueryData(queryKeys.quiz(variables), data);
    },
  });
};

export const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: quizApi.submitQuiz,
  });
};