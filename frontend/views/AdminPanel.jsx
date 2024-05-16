import { Link } from "react-router-dom";
import Profile from "./Profile";
import TrackParticipants from "./TrackParticipants";
 

export const AdminPanel = () => {
  return (
    <>
         <TrackParticipants/>
         You can create a new quiz if you like: <Link to={'/api/quizzes/createQuiz'}>Add a quiz</Link>
         {/*
         se abbiamo un vincitore, facciamolo vedere a tutti!
         */}
        <Profile/>
    </>
  )
}
export default AdminPanel;