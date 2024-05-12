import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '10d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', 
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  });
};
 export default generateToken;