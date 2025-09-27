import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuizStore } from '@/store/quizStore';
import { Trophy, Target, RotateCcw, Home, Star, Award, CheckCircle2, XCircle } from 'lucide-react';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { quizResult, quizData, testSelection, resetQuiz } = useQuizStore();

  React.useEffect(() => {
    // Redirect if no quiz result
    if (!quizResult) {
      navigate('/');
    }
  }, [quizResult, navigate]);

  if (!quizResult || !quizData || !testSelection) {
    return null;
  }

  const percentage = parseFloat(quizResult.percentage);
  const correctAnswers = quizResult.score;
  const incorrectAnswers = quizResult.totalQuestions - quizResult.score;
  const attemptedQuestions = quizResult.attemptedQuestions;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Outstanding!", icon: Trophy, color: "text-yellow-600" };
    if (percentage >= 80) return { message: "Excellent!", icon: Award, color: "text-blue-600" };
    if (percentage >= 70) return { message: "Good Job!", icon: Star, color: "text-green-600" };
    if (percentage >= 60) return { message: "Not Bad!", icon: Target, color: "text-orange-600" };
    return { message: "Keep Practicing!", icon: RotateCcw, color: "text-red-600" };
  };

  const performance = getPerformanceMessage();
  const PerformanceIcon = performance.icon;

  const handleRetakeQuiz = () => {
    resetQuiz();
    navigate('/');
  };

  const handleNewQuiz = () => {
    resetQuiz();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          <p className="text-lg text-gray-600">Here are your results</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Score Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-2xl flex items-center">
                  <PerformanceIcon className={`mr-3 h-8 w-8`} />
                  {performance.message}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Score Circle */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${percentage * 2.51} 251.2`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">{percentage.toFixed(0)}%</div>
                        <div className="text-gray-600">Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Statistics */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-center mb-2">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-800">{correctAnswers}</div>
                    <div className="text-green-600 font-medium">Correct</div>
                  </div>
                  
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex justify-center mb-2">
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-red-800">{incorrectAnswers}</div>
                    <div className="text-red-600 font-medium">Incorrect</div>
                  </div>
                </div>

                {/* Performance Message */}
                <div className={`mt-6 p-4 rounded-lg border text-center ${
                  percentage >= 80 ? 'bg-green-50 border-green-200 text-green-800' :
                  percentage >= 60 ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                  'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="font-semibold">
                    {percentage >= 80 ? 'Great job! You have a strong understanding of this topic.' :
                     percentage >= 60 ? 'Good effort! Consider reviewing the topics you missed.' :
                     'Keep studying! Practice makes perfect.'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Details */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-lg text-gray-900">Quiz Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Topic:</span>
                  <span className="font-medium">{quizData.quizTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`font-medium ${
                    testSelection.difficulty === 'easy' ? 'text-green-600' :
                    testSelection.difficulty === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {testSelection.difficulty.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-medium">{quizResult.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attempted:</span>
                  <span className="font-medium">{attemptedQuestions}/{quizResult.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Score:</span>
                  <span className="font-medium">{correctAnswers}/{quizResult.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Percentage:</span>
                  <span className="font-medium">{percentage.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRetakeQuiz}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake This Quiz
              </Button>
              
              <Button
                onClick={handleNewQuiz}
                variant="outline"
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Take New Quiz
              </Button>
            </div>

            {/* Achievement Badge */}
            {percentage >= 90 && (
              <Card className="shadow-lg border-0 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="font-semibold text-yellow-800">Perfect Score!</div>
                  <div className="text-sm text-yellow-700">You've mastered this topic!</div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Question Analysis Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
              <CardTitle className="text-2xl flex items-center">
                <Target className="mr-3 h-6 w-6" />
                Question Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {quizResult.questionAnalysis.map((analysis, index) => (
                  <div key={analysis.questionId} className="border rounded-lg p-6 bg-gray-50">
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Question {index + 1}
                        </h3>
                        <p className="text-gray-700 mb-4">{analysis.questionText}</p>
                      </div>
                      <div className="ml-4">
                        {analysis.isCorrect ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle2 className="h-6 w-6 mr-1" />
                            <span className="font-semibold">Correct</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <XCircle className="h-6 w-6 mr-1" />
                            <span className="font-semibold">
                              {analysis.userSelectedOption ? 'Incorrect' : 'Not Attempted'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="grid gap-3">
                      {analysis.options.map((option, optionIndex) => {
                        const isCorrect = option.optionId === analysis.correctOption;
                        const isUserSelected = option.optionId === analysis.userSelectedOption;
                        const optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D
                        
                        let optionClass = "p-3 rounded-lg border-2 ";
                        if (isCorrect && isUserSelected) {
                          // User selected the correct answer
                          optionClass += "border-green-500 bg-green-100 text-green-800";
                        } else if (isCorrect) {
                          // Correct answer (not selected by user)
                          optionClass += "border-green-400 bg-green-50 text-green-700";
                        } else if (isUserSelected) {
                          // User selected wrong answer
                          optionClass += "border-red-500 bg-red-100 text-red-800";
                        } else {
                          // Regular option
                          optionClass += "border-gray-200 bg-white text-gray-700";
                        }

                        return (
                          <div key={option.optionId} className={optionClass}>
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                                isCorrect && isUserSelected
                                  ? 'border-green-600 bg-green-600 text-white'
                                  : isCorrect
                                  ? 'border-green-500 bg-green-500 text-white'
                                  : isUserSelected
                                  ? 'border-red-600 bg-red-600 text-white'
                                  : 'border-gray-400 text-gray-600'
                              }`}>
                                {optionLetter}
                              </div>
                              <span className="font-medium flex-1">{option.optionText}</span>
                              <div className="flex items-center space-x-2">
                                {isCorrect && (
                                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-semibold">
                                    Correct Answer
                                  </span>
                                )}
                                {isUserSelected && (
                                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                    isCorrect 
                                      ? 'bg-green-200 text-green-800' 
                                      : 'bg-red-200 text-red-800'
                                  }`}>
                                    Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Not attempted message */}
                    {!analysis.userSelectedOption && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center text-yellow-800">
                          <div className="text-sm font-medium">
                            You did not attempt this question. The correct answer was option {String.fromCharCode(65 + analysis.options.findIndex(opt => opt.optionId === analysis.correctOption))}.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;