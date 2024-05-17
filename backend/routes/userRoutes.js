import express from 'express';
import { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post("/", registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);



router
.route('/profile')
.get(protect, getUserProfile)
//.put(updateUserProfile);


export default router;