import axios from 'axios';
import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import io from 'socket.io-client';

const socket = io.connect('https://real-time-quiz-app-backend.onrender.com', {
  transports: ['websocket', 'polling']
});

const Profile = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);

  useEffect(() => {
    axios
      .get('https://real-time-quiz-app-backend.onrender.com/api/quizzes/allQuizzes')
      .then(response => {
        setQuizzes(response.data);
      })
      .catch(error => {
        console.error('Error fetching quizzes:', error);
      });
  }, []);

  const sendQuiz = quiz => {
    if (selectedQuizzes.includes(quiz)) {
      // Alert if clicked again
      alert('You have already selected this quiz');
    } else {
      // Add quiz to selected quizzes
      setSelectedQuizzes([...selectedQuizzes, quiz]);
      socket.emit('selectedQuiz', quiz);
    }
  };

  return (
    <div>
      <div className='row'>
        {quizzes.map((quiz, index) => (
          <div className='col-md-4 mb-4' key={index}>
            <Card style={{ backgroundColor: selectedQuizzes.includes(quiz) ? 'brown' : 'white' }}>
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
  );
};

export default Profile;
