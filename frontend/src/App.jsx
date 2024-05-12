import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from '../views/Login' 
import AdminPanel from '../views/AdminPanel'
import Profile from '../views/Profile'
import CreateQuizForm from '../views/CreateQuizForm'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/api/users/profile' element={<Profile />} />
        <Route path='/api/users/admin' element={<AdminPanel />} />
        <Route path='/api/quizzes/createQuiz' element={<CreateQuizForm />} />
      </Routes>
    </Router>
  )
}

export default App
