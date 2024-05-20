import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

export const QuizDetail = () => {
    const location = useLocation()
    const quizId = location.state.quizId // Get the quizId from location.state

    const [quiz, setQuiz] = useState(null) // Initialize quiz state as null

    useEffect(() => {
        // Fetch quiz details only if quizId exists
        if (quizId) {
            axios
                .get(`https://real-time-quiz-app-backend.onrender.com/api/quizzes/playQuiz/${quizId}`)
                .then(response => {
                    setQuiz(response.data.quiz) // Set the quiz details in the state
                })
                .catch(error => {
                    console.error('Error fetching quiz:', error)
                })
        }
    }, [quizId]) // Execute effect only when quizId changes

    return (
        <div>
            {quiz ? (
                // Render quiz details if quiz is not null
                <div>
                    <h2>Quiz Details</h2>
                    <p>Question: {quiz.question}</p>
                    <ul>
                        {quiz.answers.map((answer, i) => (
                            <li key={i}>
                                {answer.answer} - {answer.isCorrect ? 'Correct' : 'Incorrect'}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                // Render loading message while fetching quiz details
                <p>Loading quiz details...</p>
            )}
        </div>
    )
}

export default QuizDetail
