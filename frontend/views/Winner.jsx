import Confetti from 'react-confetti';
import { Container, Row, Col } from 'react-bootstrap';

const WinnerPage = () => {
  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md="auto">
          <div className="text-center">
            <h1 style={{ animation: "bounce 1s infinite" }}>Congratulations!</h1>
            <p className="mt-3">You won!</p>
            <Confetti numberOfPieces={200} /> 
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default WinnerPage;
