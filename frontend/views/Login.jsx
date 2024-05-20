import { useState } from "react";
import { useNavigate  } from "react-router-dom"; 
import axios from 'axios';
 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Use useNavigate hook instead of useHistory

  console.log('email', email);
  console.log('password', password);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://real-time-quiz-app-backend.onrender.com/api/users/login', { email, password })
      .then(res => {
        console.log(res);
        // Redirect to profile page on successful login
        navigate('/api/users/admin'); // Use navigate instead of history.push
      })
      .catch(err => {
        console.log('here we have an error', err);
        alert('Email or password are not valid');
      });
  };
  

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


 

export default Login;
