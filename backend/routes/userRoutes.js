import express from 'express';

const router = express.Router();

router.post("/auth", async (req, res) => {
    res.status(200).json({ message: 'Auth user' })
});

export default router;