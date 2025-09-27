import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuizStore } from '@/store/quizStore';
import { useSubmitQuiz } from '@/services/queries';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import Timer from '@/components/Timer';
import { ChevronLeft, ChevronRight, Flag, Clock } from 'lucide-react';

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
    updateTimeRemaining,
  } = useQuizStore();

  // Handle auto-submission when timer expires
  const handleTimerExpire = useCallback(async () => {
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
      console.error('Failed to auto-submit quiz:', error);
    }
  }, [testSelection, sessionId, answers, submitQuizMutation, setQuizResult, navigate]);

  // Initialize timer
  const timer = useCountdownTimer({
    initialSeconds: quizData?.quizTimer || 0,
    onExpire: handleTimerExpire,
    autoStart: true,
  });

  // Update store with timer changes
  useEffect(() => {
    updateTimeRemaining(timer.timeRemaining);
  }, [timer.timeRemaining, updateTimeRemaining]);

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
    if (timer.isExpired) return;
    setAnswer(currentQuestion.questionId, optionId);
  };

  const handleSubmitQuiz = async () => {
    if (!testSelection || !sessionId || timer.isExpired) return;

    // Stop the timer when manually submitting
    timer.stop();

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
    if (timer.isExpired) return;
    setCurrentQuestion(questionIndex);
  };

  const answeredQuestions = answers.length;
  const totalQuestions = quizData.questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{quizData.quizTitle}</h1>
              <p className="text-sm text-gray-500 font-medium">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600 font-medium">
                <span className="font-semibold text-gray-800">{answeredQuestions}</span> / {totalQuestions} answered
              </div>
              <Timer
                timeRemaining={timer.timeRemaining}
                totalTime={quizData.quizTimer}
                formatTime={timer.formatTime}
                getTimeColor={timer.getTimeColor}
                getWarningLevel={timer.getWarningLevel}
                className="flex-shrink-0 bg-gray-50 px-4 py-2 rounded-full shadow-sm"
              />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5">
              <CardTitle className="text-xl font-semibold">Question {currentQuestionIndex + 1}</CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              {/* Question Text */}
              <div className="mb-8">
                <p className="text-lg leading-relaxed text-gray-800 font-medium">
                  {currentQuestion.questionText}
                </p>
                {currentQuestion.questionImage && (
                  <img
                    src={currentQuestion.questionImage}
                    alt="Question"
                    className="mt-6 max-w-full h-auto rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
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
                      disabled={timer.isExpired}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
                      } transform hover:-translate-y-1`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-base font-bold ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 text-gray-600'
                        } transition-colors duration-300`}>
                          {optionLetter}
                        </div>
                        <span className="text-gray-800 font-medium">{option.optionText}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={isFirstQuestion || timer.isExpired}
                  className="flex items-center text-gray-700 border-gray-300 hover:bg-gray-100 rounded-lg px-4 py-2 transition-all duration-300 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Previous
                </Button>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitDialog(true)}
                    disabled={timer.isExpired}
                    className="flex items-center text-green-600 border-green-600 hover:bg-green-50 rounded-lg px-4 py-2 transition-all duration-300 disabled:text-gray-400 disabled:border-gray-300"
                  >
                    <Flag className="h-5 w-5 mr-2" />
                    Submit Quiz
                  </Button>
                  
                  {!isLastQuestion && (
                    <Button
                      onClick={nextQuestion}
                      disabled={timer.isExpired}
                      className="flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-all duration-300 disabled:bg-gray-400"
                    >
                      Next
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Navigator */}
        <div className="lg:col-span-1">
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gray-50 py-5">
              <CardTitle className="text-lg font-semibold text-gray-900">Questions Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="grid grid-cols-5 gap-3">
                {quizData.questions.map((question, index) => {
                  const isAnswered = answers.some(a => a.questionId === question.questionId);
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={question.questionId}
                      onClick={() => handleQuestionNavigation(index)}
                      disabled={timer.isExpired}
                      className={`w-12 h-12 rounded-lg text-base font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-lg'
                          : isAnswered
                          ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                      } transform hover:-translate-y-1`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded-full mr-3"></div>
                  <span className="text-gray-600 font-medium">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded-full mr-3"></div>
                  <span className="text-gray-600 font-medium">Not answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-600 font-medium">Current</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 rounded-2xl shadow-2xl border-0">
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900">Submit Quiz</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4 text-sm">
                You have answered {answeredQuestions} out of {totalQuestions} questions.
                {answeredQuestions < totalQuestions && ' Unanswered questions will be marked as incorrect.'}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 text-sm font-medium">Time Remaining:</span>
                  <span className={`font-semibold ${timer.getTimeColor(timer.timeRemaining, quizData.quizTimer)}`}>
                    {timer.formatTime(timer.timeRemaining)}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-6 text-sm font-medium">
                Are you sure you want to submit your quiz?
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitDialog(false)}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={submitQuizMutation.isPending || timer.isExpired}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 disabled:bg-gray-400"
                >
                  {submitQuizMutation.isPending ? 'Submitting...' : timer.isExpired ? 'Time Expired' : 'Submit'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Time Expired Overlay */}
      {timer.isExpired && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 rounded-2xl shadow-2xl border-0">
            <CardHeader className="bg-red-50 border-b border-red-200">
              <CardTitle className="text-xl font-semibold text-red-800 flex items-center">
                <Clock className="h-6 w-6 mr-2" />
                Time Expired
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4 text-center text-sm">
                Your quiz time has expired and has been automatically submitted.
              </p>
              <p className="text-sm text-gray-500 text-center font-medium">
                Redirecting to results...
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuizPage;