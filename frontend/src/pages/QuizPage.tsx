import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuizStore } from '@/store/quizStore';
import { useSubmitQuiz } from '@/services/queries';
import { ChevronLeft, ChevronRight, Clock, Flag } from 'lucide-react';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const submitQuizMutation = useSubmitQuiz();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  
  const {
    quizData,
    testSelection,
    sessionId,
    currentQuestionIndex,
    answers,
    isFirstQuestion,
    isLastQuestion,
    progressPercentage,
    setAnswer,
    nextQuestion,
    previousQuestion,
    setCurrentQuestion,
    setQuizResult,
  } = useQuizStore();

  useEffect(() => {
    // Redirect if no quiz data
    if (!quizData || !testSelection) {
      navigate('/');
    }
  }, [quizData, testSelection, navigate]);

  if (!quizData || !testSelection) {
    return null;
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.questionId);

  const handleOptionSelect = (optionId: string) => {
    setAnswer(currentQuestion.questionId, optionId);
  };

  const handleSubmitQuiz = async () => {
    if (!testSelection || !sessionId) return;

    const submission = {
      topicId: testSelection.topicId,
      answers: answers.reduce((acc, answer) => {
        acc[answer.questionId] = answer.selectedOptionId;
        return acc;
      }, {} as Record<string, string>),
      sessionId: sessionId,
    };

    try {
      const result = await submitQuizMutation.mutateAsync(submission);
      setQuizResult(result);
      navigate('/results');
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  const handleQuestionNavigation = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
  };

  const answeredQuestions = answers.length;
  const totalQuestions = quizData.questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quizData.quizTitle}</h1>
              <p className="text-gray-600">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{answeredQuestions}</span> / {totalQuestions} answered
              </div>
              {quizData.quizTimer && (
                <div className="flex items-center text-blue-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="font-medium">30:00</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="text-xl">
                Question {currentQuestionIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* Question Text */}
              <div className="mb-8">
                <p className="text-lg leading-relaxed text-gray-800">
                  {currentQuestion.questionText}
                </p>
                {currentQuestion.questionImage && (
                  <img
                    src={currentQuestion.questionImage}
                    alt="Question"
                    className="mt-4 max-w-full h-auto rounded-lg shadow-md"
                  />
                )}
              </div>

              {/* Options */}
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = currentAnswer?.selectedOptionId === option.optionId;
                  const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                  
                  return (
                    <button
                      key={option.optionId}
                      onClick={() => handleOptionSelect(option.optionId)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 text-gray-600'
                        }`}>
                          {optionLetter}
                        </div>
                        <span className="text-gray-800 font-medium">{option.optionText}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={isFirstQuestion}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitDialog(true)}
                    className="flex items-center text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    Submit Quiz
                  </Button>
                  
                  {!isLastQuestion && (
                    <Button
                      onClick={nextQuestion}
                      className="flex items-center"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Navigator */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg text-gray-900">Questions Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-5 gap-2">
                {quizData.questions.map((question, index) => {
                  const isAnswered = answers.some(a => a.questionId === question.questionId);
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={question.questionId}
                      onClick={() => handleQuestionNavigation(index)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-md'
                          : isAnswered
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                  <span className="text-gray-600">Not answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                  <span className="text-gray-600">Current</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Submit Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                You have answered {answeredQuestions} out of {totalQuestions} questions.
                {answeredQuestions < totalQuestions && ' Unanswered questions will be marked as incorrect.'}
              </p>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit your quiz?
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={submitQuizMutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {submitQuizMutation.isPending ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuizPage;