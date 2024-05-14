import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from '../views/Login' 
import AdminPanel from '../views/AdminPanel'
import Profile from '../views/Profile'
import CreateQuizForm from '../views/CreateQuizForm'
import PlayQuiz from '../views/PlayQuiz'
//import QuizDetail from '../views/QuizDetail'


//console.log('socket', socket)
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/api/users/profile' element={<Profile />} />
        <Route path='/api/users/admin' element={<AdminPanel />} />
        <Route path='/api/quizzes/createQuiz' element={<CreateQuizForm />} />
        {/*<Route path="/quiz/:id" element={<QuizDetail />} /> */}
        <Route path='/api/quizzes/playQuiz' element={<PlayQuiz />} />
      </Routes>
    </Router>
  )
}

export default App
