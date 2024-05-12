import express from 'express';
import { createQuiz, getAllQuizzes } from '../controllers/quizController.js';
const router = express.Router();


router.post('/quiz', createQuiz);
router.get('/allQuizzes', getAllQuizzes);

export default router;