import express from 'express';
import { createUser } from '../controllers/userControllers.js';

const router = express.Router();

router.post("/", createUser);

export default router;