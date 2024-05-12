import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminPanel from '../views/AdminPanel'
import { Profile } from '../views/Profile'
import CreateQuizForm from '../views/CreateQuizForm'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AdminPanel />} />
        <Route path='/api/users/profile' element={<Profile />} />
        <Route path='/api/users/createQuiz' element={<CreateQuizForm />} />
      </Routes>
    </Router>
  )
}

export default App
