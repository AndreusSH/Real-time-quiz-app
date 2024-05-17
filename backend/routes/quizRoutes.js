import express from 'express';
import { createQuiz, getAllQuizzes, selectAQuiz } from '../controllers/quizController.js';
const router = express.Router();


router.post('/quiz', createQuiz);

router.get('/allQuizzes', getAllQuizzes);
router.get('/playQuiz/:id', selectAQuiz);

export default router;