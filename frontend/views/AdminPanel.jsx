
import { Link } from 'react-router-dom'
import Profile from './Profile'
import TrackParticipants from './TrackParticipants'
import { Fragment } from 'react'
 import { useSelector } from 'react-redux'
import { selectWinner } from '../src/features/winner/winnerSlice'

 
export const AdminPanel = () => {
  const winner = useSelector(selectWinner)
  console.log('has a winner', winner)
     
  
  return (
    <>
      <h1>Admin page</h1>
      <Fragment>
        Here you can create a new quiz or choose an existing one
      </Fragment>
      <div>
        <TrackParticipants />
      </div>
      You can create a new quiz if you like:{' '}
      <Link to={'/api/quizzes/createQuiz'}>Add a quiz</Link>
       {winner ? (<h2>We have a winner</h2>) : (null)}
      <Profile />
    </>
  )
}
export default AdminPanel
