import { useState } from 'react';
 import { Form, Button } from 'react-bootstrap';
 import axios from 'axios';

const CreateQuizForm = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([
    { answer: '', isCorrect: false },
    { answer: '', isCorrect: false },
    { answer: '', isCorrect: false },
    { answer: '', isCorrect: false }
  ]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].answer = value;
    setAnswers(updatedAnswers);
  };

  const handleCorrectAnswerChange = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers.forEach((answer, i) => {
      answer.isCorrect = i === index;
    });
    setAnswers(updatedAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
 
    if (!answers.some(answer => answer.isCorrect)) {
    
      alert('Please select a correct answer.');
      return;
    }
    else{
      axios.post('http://localhost:8000/api/quizzes/quiz', { question, answers })
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
    }
    
  };

  return (
    <div className="container">
      <h2>Create Quiz Question</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="question">
          <Form.Label>Question:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </Form.Group>
        {answers.map((answer, index) => (
          <Form.Group controlId={`answer${index}`} key={index}>
            <Form.Label>{`Answer ${index + 1}:`}</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Enter answer ${index + 1}`}
              value={answer.answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              required
            />
            <Form.Check
              type="checkbox"
              label="Correct"
              checked={answer.isCorrect}
              onChange={() => handleCorrectAnswerChange(index)}
            />
          </Form.Group>
        ))}
        <Button variant="primary" type="submit">
          Create Question
        </Button>
      </Form>
    </div>
  );
};

export default CreateQuizForm;
