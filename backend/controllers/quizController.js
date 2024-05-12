import Quiz from "../models/quizModels.js";

const createQuiz = async (req, res) => {
    try {
        const { question, answers } = req.body;
        // Create a new quiz document with the provided question and answers
        const newQuiz = await Quiz.create({ question, answers });
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { createQuiz };
