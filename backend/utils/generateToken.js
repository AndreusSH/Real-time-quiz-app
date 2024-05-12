import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
console.log("res to create a token", res)
console.log("userId", userId)
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
console.log(`This is the token which has been generated ${generateToken}`)
export default generateToken;