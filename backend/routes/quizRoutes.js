import express from 'express';
import { createQuiz } from '../controllers/quizController.js';
const router = express.Router();


router.post('/quiz', createQuiz);
export default router;