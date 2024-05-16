import Quiz from '../models/quizModels.js'

const createQuiz = async (req, res) => {
  try {
    const { question, answers } = req.body
    // Create a new quiz document with the provided question and answers
    const newQuiz = await Quiz.create({ question, answers })
    res.status(201).json(newQuiz)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getAllQuizzes = async (req, res) => {
  try {
    const { question, answers } = req.body
    // Create a new quiz document with the provided question and answers
    const allQuizzes = await Quiz.find()
    res.status(201).json(allQuizzes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const selectAQuiz = async (req, res) => {
  try {
    const quizId = req.params.id // Get the quiz ID from the request parameters
    console.log('Quiz ID:', quizId) // Log the quiz ID for debugging

    // Find the quiz by its ID
    const quiz = await Quiz.findById(quizId)

    if (!quiz) {
      // If quiz is not found, return a 404 Not Found response
      return res.status(404).json({ message: 'Quiz not found' })
    }

    // If quiz is found, return it in the response
    return res.status(200).json({ quiz })
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching quiz:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export { createQuiz, getAllQuizzes, selectAQuiz }
