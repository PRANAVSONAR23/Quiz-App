import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTopics, useStartQuiz } from '@/services/queries';
import { useQuizStore } from '@/store/quizStore';
import { Difficulty, type TestSelection } from '@/types';
import { Loader2, BookOpen, Clock, Target } from 'lucide-react';

const TestSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: topics, isLoading, error } = useTopics();
  const startQuizMutation = useStartQuiz();
  const { setTestSelection, setQuizData } = useQuizStore();

  const [selection, setSelection] = useState<Partial<TestSelection>>({
    numberOfQuestions: 10,
    difficulty: Difficulty.MEDIUM,
  });

  const questionOptions = [5, 10, 15, 20, 25];

  const handleStartQuiz = async () => {
    if (!selection.topicId || !selection.numberOfQuestions || !selection.difficulty) {
      return;
    }

    const testConfig: TestSelection = {
      topicId: selection.topicId,
      numberOfQuestions: selection.numberOfQuestions,
      difficulty: selection.difficulty,
    };

    try {
      const quizData = await startQuizMutation.mutateAsync(testConfig);
      setTestSelection(testConfig);
      setQuizData(quizData);
      navigate('/quiz');
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Failed to start quiz');
    }
  };

  const selectedTopic = topics?.find(topic => topic.id === selection.topicId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading topics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Failed to load topics. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Setup</h1>
          <p className="text-lg text-gray-600">Configure your test preferences</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <BookOpen className="mr-3 h-6 w-6" />
              Test Configuration
            </CardTitle>
            <CardDescription className="text-blue-100">
              Select your topic, number of questions, and difficulty level
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Topic Selection */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-900 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Select Topic
              </label>
              <Select
                value={selection.topicId}
                onValueChange={(value) => setSelection(prev => ({ ...prev, topicId: value }))}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Choose a topic..." />
                </SelectTrigger>
                <SelectContent>
                  {topics?.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{topic.title}</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                          topic.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          topic.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {topic.difficulty.toUpperCase()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Questions */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-900 flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Number of Questions
              </label>
              <Select
                value={selection.numberOfQuestions?.toString()}
                onValueChange={(value) => setSelection(prev => ({ ...prev, numberOfQuestions: parseInt(value) }))}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select number of questions..." />
                </SelectTrigger>
                <SelectContent>
                  {questionOptions.map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Difficulty Level
              </label>
              <Select
                value={selection.difficulty}
                onValueChange={(value) => setSelection(prev => ({ ...prev, difficulty: value as Difficulty }))}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select difficulty..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Difficulty.EASY}>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Easy
                    </div>
                  </SelectItem>
                  <SelectItem value={Difficulty.MEDIUM}>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value={Difficulty.HARD}>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      Hard
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Test Summary */}
            {selectedTopic && selection.numberOfQuestions && selection.difficulty && (
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="font-semibold text-lg mb-3 text-gray-900">Test Summary</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Topic:</span>
                    <span className="font-medium">{selectedTopic.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-medium">{selection.numberOfQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <span className={`font-medium ${
                      selection.difficulty === 'easy' ? 'text-green-600' :
                      selection.difficulty === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {selection.difficulty?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Start Test Button */}
            <Button
              onClick={handleStartQuiz}
              disabled={!selection.topicId || !selection.numberOfQuestions || !selection.difficulty || startQuizMutation.isPending}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {startQuizMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Starting Quiz...
                </>
              ) : (
                'Start Quiz'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestSelectionPage;