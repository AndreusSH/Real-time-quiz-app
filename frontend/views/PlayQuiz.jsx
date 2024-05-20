import { useState, useEffect } from 'react'
import { Button, Container, Row, Col, Alert } from 'react-bootstrap'
import io from 'socket.io-client'
import WinnerPage from './Winner'
import { useDispatch, useSelector } from 'react-redux'
import { setWinner } from '../src/features/winner/winnerSlice'

const socket = io.connect('https://real-time-quiz-app-backend.onrender.com', {
  transports: ['websocket', 'polling']
})

const PlayQuiz = () => {
  const winner = useSelector(state => state.winner)
  console.log('winner', winner)
  const dispatch = useDispatch()

 
  /*
    const quiz = useSelector(state => state.quiz);

  const timer = useSelector(state => state.timer);
  const isPaused = useSelector(state => state.isPaused);
  const newTimer = useSelector(state => state.newTimer);
  const answer = useSelector(state => state.answer);
  */

  const [quiz, setQuiz] = useState(null)
  const [timer, setTimer] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [newTimer, setNewTimer] = useState(0)
  const [answer, setAnswer] = useState(null)
  /*
    const [winner, setWinner] = useState(false)

  */

  useEffect(() => {
    socket.on('quizData', quizData => {
      setQuiz(quizData)
      setTimer(30) // Assuming the quiz duration is 30 seconds
      setNewTimer(10)
      setIsPaused(false)
    })

    socket.on('hello', message => {
      console.log(message)
      alert('Somebody booked to answer')
      setIsPaused(true)
      setQuiz(null)
    })

    socket.on('newQuiz', () => {
      setQuiz(null)
    })

    socket.on('winner', () => {
      console.log('socket on winner')
      dispatch(setWinner())
      //setWinner(true)
      setQuiz(null)
    })

    return () => {
      socket.off('quizData')
      socket.off('hello')
      socket.off('prova')
      socket.off('winner')
    }
  }, [dispatch])

  const evaluateAnswer = answer => {
    if (isPaused) {
      if (answer.isCorrect) {
        setAnswer(true)
        socket.emit('scoreUpdate', { score: 1, timestamp: Date.now() })
      } else {
        setAnswer(false)
      }
      setQuiz(null)
      setIsPaused(true)
    } else {
      alert('You must stop the timer before answering')
    }
  }

  const handleTimerTick = () => {
    if (!isPaused && timer > 0) {
      setTimer(prevTimer => prevTimer - 1)
    }

    if (isPaused && newTimer > 0) {
      setNewTimer(prevTimer => prevTimer - 1)
    }

    if (timer === 0 || newTimer === 0) {
      setQuiz(null)
    }
  }

  useEffect(() => {
    const interval = setInterval(handleTimerTick, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [isPaused, timer, newTimer])

  const stopTimer = () => {
    setIsPaused(true)
    setNewTimer(10)
    socket.emit('pauseNotification', { message: 'Somebody booked to answer' })
  }

  return (
    <>
      {quiz ? (
        <Container>
          <Row className='justify-content-md-center'>
            <Col xs={12} md={8}>
              <h2>Quiz Result</h2>
              <p>Question: {quiz.question}</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                Time left: {!isPaused ? timer : newTimer} seconds
              </p>
              {!isPaused ? (
                <Button
                  variant='danger'
                  onClick={stopTimer}
                  className='mr-3 mb-3'
                >
                  Stop Timer
                </Button>
              ) : null}
              <ul className='list-unstyled'>
                {quiz.answers.map((answer, i) => (
                  <li key={i} className='mr-3 mb-3'>
                    <Button
                      variant='outline-primary'
                      onClick={() => evaluateAnswer(answer)}
                    >
                      {answer.answer} -{' '}
                      {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </Button>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Container>
      ) : winner.hasWinner ? (
        <WinnerPage />
      ) : answer === null ? (
        <Col xs={12} md={8}>
          <Alert>You will be notified when there is a new question</Alert>
        </Col>
      ) : (
        <Container>
          <Row className='justify-content-md-center'>
            <Col xs={12} md={8}>
              <Alert variant={answer ? 'success' : 'danger'}>
                Your answer was {answer ? 'Correct' : 'Incorrect'} - You will be
                notified when there is a question available
              </Alert>
            </Col>
          </Row>
        </Container>
      )}
    </>
  )
}

export default PlayQuiz
