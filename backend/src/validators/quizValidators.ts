import { body, param, query } from 'express-validator';
import { Difficulty } from '../types';

export const validateCreateTopic = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('difficulty')
    .isIn(Object.values(Difficulty))
    .withMessage('Difficulty must be easy, medium, or hard')
];

export const validateAddQuestions = [
  body('questions')
    .isArray({ min: 1 })
    .withMessage('Questions array is required and must not be empty'),
  
  body('questions.*.questionText')
    .trim()
    .notEmpty()
    .withMessage('Question text is required')
    .isLength({ max: 500 })
    .withMessage('Question text must not exceed 500 characters'),
  
  body('questions.*.options')
    .isArray({ min: 2, max: 4 })
    .withMessage('Question must have 2-4 options'),
  
  body('questions.*.options.*.optionId')
    .notEmpty()
    .withMessage('Option ID is required'),
  
  body('questions.*.options.*.optionText')
    .trim()
    .notEmpty()
    .withMessage('Option text is required')
    .isLength({ max: 300 })
    .withMessage('Option text must not exceed 300 characters'),
  
  body('questions.*.correctOption')
    .notEmpty()
    .withMessage('Correct option is required'),
  
  body('questions.*.topicId')
    .notEmpty()
    .withMessage('Topic ID is required')
];

export const validateTakeQuiz = [
  body('topicId')
    .notEmpty()
    .withMessage('Topic ID is required'),
  
  body('numberOfQuestions')
    .isInt({ min: 1, max: 50 })
    .withMessage('Number of questions must be between 1 and 50'),
  
  body('difficulty')
    .isIn(Object.values(Difficulty))
    .withMessage('Difficulty must be easy, medium, or hard')
];

export const validateSubmitQuiz = [
  body('topicId')
    .notEmpty()
    .withMessage('Topic ID is required'),
  
  body('answers')
    .isObject()
    .withMessage('Answers must be an object')
    .custom((value) => {
      if (Object.keys(value).length === 0) {
        throw new Error('Answers cannot be empty');
      }
      return true;
    })
];

export const validateTopicId = [
  param('id')
    .notEmpty()
    .withMessage('Topic ID is required')
];