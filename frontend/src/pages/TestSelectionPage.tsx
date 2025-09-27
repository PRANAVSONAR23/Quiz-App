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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-lg">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-700 font-medium">Loading topics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center">
        <Card className="w-full max-w-md rounded-2xl shadow-xl border-0">
          <CardContent className="pt-6 text-center">
            <div className="text-red-600 font-medium text-lg">
              Failed to load topics. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Quiz Setup</h1>
          <p className="text-lg text-gray-500 mt-2 font-medium">Configure your test preferences to start your quiz</p>
        </div>

        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6">
            <CardTitle className="text-2xl font-semibold flex items-center">
              <BookOpen className="mr-3 h-7 w-7" />
              Test Configuration
            </CardTitle>
            <CardDescription className="text-blue-100 text-sm">
              Select your topic, number of questions, and difficulty level
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-8 bg-white">
            {/* Topic Selection */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-900 flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                Select Topic
              </label>
              <Select
                value={selection.topicId}
                onValueChange={(value) => setSelection(prev => ({ ...prev, topicId: value }))}
              >
                <SelectTrigger className="h-12 text-base rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Choose a topic..." />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {topics?.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      <div className="flex items-center justify-between w-full py-1">
                        <span className="font-medium text-gray-800">{topic.title}</span>
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
                <Target className="mr-2 h-5 w-5 text-blue-600" />
                Number of Questions
              </label>
              <Select
                value={selection.numberOfQuestions?.toString()}
                onValueChange={(value) => setSelection(prev => ({ ...prev, numberOfQuestions: parseInt(value) }))}
              >
                <SelectTrigger className="h-12 text-base rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Select number of questions..." />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {questionOptions.map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      <div className="flex items-center">
                        <span className="font-medium">{num} Questions</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600" />
                Difficulty Level
              </label>
              <Select
                value={selection.difficulty}
                onValueChange={(value) => setSelection(prev => ({ ...prev, difficulty: value as Difficulty }))}
              >
                <SelectTrigger className="h-12 text-base rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Select difficulty..." />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value={Difficulty.EASY}>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="font-medium">Easy</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={Difficulty.MEDIUM}>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                      <span className="font-medium">Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={Difficulty.HARD}>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      <span className="font-medium">Hard</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Test Summary */}
            {selectedTopic && selection.numberOfQuestions && selection.difficulty && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Test Summary</h3>
                <div className="space-y-3 text-gray-700 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Topic:</span>
                    <span className="font-semibold text-gray-800">{selectedTopic.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Questions:</span>
                    <span className="font-semibold text-gray-800">{selection.numberOfQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Difficulty:</span>
                    <span className={`font-semibold ${
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
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
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