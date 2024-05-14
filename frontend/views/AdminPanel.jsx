import { Link } from "react-router-dom";
import Profile from "./Profile";

export const AdminPanel = () => {
  return (
    <>
         You can create a new quiz if you like: <Link to={'/api/quizzes/createQuiz'}>Add a quiz</Link>
        <Profile/>
    </>
  )
}
export default AdminPanel;