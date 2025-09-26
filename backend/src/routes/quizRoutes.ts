import { Router } from 'express';
import { QuizController } from '../controllers/quizController';
import { 
  validateCreateTopic,
  validateAddQuestions,
  validateTakeQuiz,
  validateSubmitQuiz
} from '../validators/quizValidators';
import { handleValidationErrors } from '../middlewares/validation';

const router = Router();
const quizController = new QuizController();

// Create topic
router.post(
  '/topics',
  validateCreateTopic,
  handleValidationErrors,
  quizController.createTopic.bind(quizController)
);

// Get all topics
router.get(
  '/topics',
  quizController.getAllTopics.bind(quizController)
);

// Add questions to topic
router.post(
  '/questions',
  validateAddQuestions,
  handleValidationErrors,
  quizController.addQuestions.bind(quizController)
);

// Take quiz
router.post(
  '/quiz/start',
  validateTakeQuiz,
  handleValidationErrors,
  quizController.takeQuiz.bind(quizController)
);

// Submit quiz
router.post(
  '/quiz/submit',
  validateSubmitQuiz,
  handleValidationErrors,
  quizController.submitQuiz.bind(quizController)
);

export default router;