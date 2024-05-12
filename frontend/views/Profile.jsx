 
 
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

const Profile = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/quizzes/allQuizzes')
      .then(response => {
        setQuizzes(response.data);
      })
      .catch(error => {
        console.error('Error fetching quizzes:', error);
      });
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <h3>Your Quizzes</h3>
      <div className="row">
        {quizzes.map((quiz, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <Card>
              <Card.Body>
                <Card.Title>Question: {quiz.question}</Card.Title>
                <Card.Text>
                  <ul>
                    {quiz.answers.map((answer, i) => (
                      <li key={i}>
                        {answer.answer} - {answer.isCorrect ? 'Correct' : 'Incorrect'}
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
