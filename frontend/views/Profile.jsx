import axios from 'axios'
import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:8000/', {
  transports: ['websocket', 'polling']
})

const Profile = () => {
  const [quizzes, setQuizzes] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/quizzes/allQuizzes')
      .then(response => {
        setQuizzes(response.data)
      })
      .catch(error => {
        console.error('Error fetching quizzes:', error)
      })
  }, [])
  const sendQuiz = quiz => {
    socket.emit('selectedQuiz', quiz)
  }

  return (
    <div>
       
      <h3>Your Quizzes</h3>
      <div className='row'>
        {quizzes.map((quiz, index) => (
          <div className='col-md-4 mb-4' key={index}>
     
              <Card>
                <Card.Body onClick={() => sendQuiz(quiz)}>
                  <Card.Title>Question: {quiz.question}</Card.Title>
                  <Card.Text>
                    <ul>
                      {quiz.answers.map((answer, i) => (
                        <li key={i}>
                          {answer.answer} -{' '}
                          {answer.isCorrect ? 'Correct' : 'Incorrect'}
                        </li>
                      ))}
                    </ul>
                  </Card.Text>
                </Card.Body>
              </Card>
           </div>
        ))}
      </div>
    </div>
  )
}
export default Profile
