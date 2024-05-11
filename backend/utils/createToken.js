import jwt from 'jsonwebtoken';


const createToken = (res, userid) => {
const token = jwt.sign({userid}, process.env.JWT_SECRET,{
    expiresIn: '10d',
});

res.cookie('jwt', token, {
    httpOnly:true,
    secure: process.env.NODE_ENV !== 'development',  
    maxAge: 10 * 24 * 60 * 60 * 1000,  
})
}

export default createToken;