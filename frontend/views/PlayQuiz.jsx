import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:8000/', {
  transports: ['websocket', 'polling']
});

const PlayQuiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [newTimer, setNewTimer] = useState(0); // Initialize newTimer state
  const [winner, setWinner] = useState(false)
  const [answer, setAnswer] = useState(null)
  useEffect(() => {
    // Listen for "quizData" event from the server
    socket.on('quizData', quizData => {
      console.log('Received quiz data:', quizData);
      setQuiz(quizData);
      // Start the timer when quiz data is received
      setTimer(30); // Assuming the quiz duration is 30 seconds
      setNewTimer(10); // Reset the new timer to 10 when quiz data is received
      setIsPaused(false); // Ensure timer is not paused
    });

    socket.on('hello', message => {
      console.log('Received pause notification:', message);
      // Pause the timer when receiving pause notification
      alert('Somebody booked to answer');
      setIsPaused(true);
      setQuiz(null);

    });

    socket.on('newQuiz', prova => {
      console.log('Received prova message:', prova);
      setQuiz(null);
    });

    socket.on('winner', winner => {
      console.log('we got a winner and that is dope:', winner);
      setWinner(true);
      setQuiz(null);
    });
    
    

    // Clean up event listeners on component unmount
    return () => {
      socket.off('quizData');
      socket.off('hello');
      socket.off('prova');
    };
  }, []);

  // Function to handle answer evaluation
  const evaluateAnswer = (answer) => {
    if (answer.isCorrect) {
      console.log('congrats this is the correct answer')
      setAnswer(true)
      // Emit score update to the server
       socket.emit('scoreUpdate', { score: 1, timestamp: Date.now() });
    }
    else{
      console.log('this answer is absolutely not true')
      setAnswer(false)

    }

    // Pause the timer when answering
    setQuiz(null);
    setIsPaused(true);
  };

  // Function to handle timer tick
  const handleTimerTick = () => { 
    if (!isPaused && timer > 0) {
      setTimer(prevTimer => prevTimer - 1);
    }

    // When the initial timer reaches 0, start the new countdown
    if (isPaused && newTimer > 0) {
      setNewTimer(prevTimer => prevTimer - 1);
    }
  
  };

  // Start the timer countdown
  useEffect(() => {
    const interval = setInterval(handleTimerTick, 1000);

    // Clean up timer interval on component unmount or when timer reaches 0
    return () => {
      clearInterval(interval);
    };
  }, [isPaused, timer, newTimer]); // Re-run the timer effect when isPaused, timer, or newTimer changes

  // Function to handle timer stopping
  const stopTimer = () => {
    setIsPaused(true);
    //setTimer(10); // Set the initial timer to 10 seconds
    setNewTimer(10); // Reset the new timer to 10 seconds
    socket.emit('pauseNotification', { message: 'Somebody booked to answer' });
  };
  return (
    <>
      {quiz ? (
        <div>
          <h2>Quiz Result</h2>
          <p>Question: {quiz.question}</p>
          <p>Time left: {!isPaused ? timer : newTimer} seconds</p> {/* Display the current timer */}
          <button onClick={stopTimer}>Stop Timer</button>
          <ul>
            {quiz.answers.map((answer, i) => (
              <li key={i}>
                <button onClick={() => evaluateAnswer(answer)}>
                  {answer.answer} - {answer.isCorrect ? 'Correct' : 'Incorrect'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : winner ? (
        <p>Congrats you won</p>
      ) : answer === null ? (
        <p>You will be notified when there is a new question</p>
      ) : (
        <p>Your answer was {answer ? 'Correct' : 'Incorrect'} - You will be notified when there is a question available</p>
      )}
    </>
  );
}  

export default PlayQuiz;
