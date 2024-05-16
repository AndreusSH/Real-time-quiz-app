import { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Alert } from 'react-bootstrap';
import io from 'socket.io-client';
import WinnerPage from './Winner';

const socket = io.connect('http://localhost:8000/', {
  transports: ['websocket', 'polling']
});

const PlayQuiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [newTimer, setNewTimer] = useState(0);
  const [winner, setWinner] = useState(false);
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    socket.on('quizData', quizData => {
      setQuiz(quizData);
      setTimer(30); // Assuming the quiz duration is 30 seconds
      setNewTimer(10);
      setIsPaused(false);
    });

    socket.on('hello', message => {
      console.log(message)
      alert('Somebody booked to answer');
      setIsPaused(true);
      setQuiz(null);
    });

    socket.on('newQuiz', () => {
      setQuiz(null);
    });

    socket.on('winner', () => {
      setWinner(true);
      setQuiz(null);
    });

    return () => {
      socket.off('quizData');
      socket.off('hello');
      socket.off('prova');
    };
  }, []);

  const evaluateAnswer = (answer) => {
    if (isPaused) {
      if (answer.isCorrect) {
        setAnswer(true);
        socket.emit('scoreUpdate', { score: 1, timestamp: Date.now() });
      } else {
        setAnswer(false);
      }
      setQuiz(null);
      setIsPaused(true);
    } else {
      alert("You must stop the timer before answering");
    }
  };

  const handleTimerTick = () => {
    if (!isPaused && timer > 0) {
      setTimer(prevTimer => prevTimer - 1);
    }

    if (isPaused && newTimer > 0) {
      setNewTimer(prevTimer => prevTimer - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(handleTimerTick, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [isPaused, timer, newTimer]);

  const stopTimer = () => {
    setIsPaused(true);
    setNewTimer(10);
    socket.emit('pauseNotification', { message: 'Somebody booked to answer' });
  };

  return (
    <>
      {quiz ? (
        <Container>
          <Row className="justify-content-md-center">
            <Col xs={12} md={8}>
              <h2>Quiz Result</h2>
              <p>Question: {quiz.question}</p>
              <p>Time left: {!isPaused ? timer : newTimer} seconds</p>
              <Button variant="danger" onClick={stopTimer} className="mr-3 mb-3">Stop Timer</Button>
              <ul className="list-unstyled">
                {quiz.answers.map((answer, i) => (
                  <li key={i} className="mr-3 mb-3">
                    <Button variant="outline-primary" onClick={() => evaluateAnswer(answer)}>
                      {answer.answer} - {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </Button>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Container>
      ) : winner ? (
        <WinnerPage />
      ) : answer === null ? (
        <p>You will be notified when there is a new question</p>
      ) : (
        <Container>
          <Row className="justify-content-md-center">
            <Col xs={12} md={8}>
              <Alert variant={answer ? 'success' : 'danger'}>
                Your answer was {answer ? 'Correct' : 'Incorrect'} - You will be notified when there is a question available
              </Alert>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default PlayQuiz;
