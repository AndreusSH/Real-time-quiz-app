import User from '../models/userModels.js';
import createToken from '../utils/createToken.js'


//route POST /api/users/
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  const user = await User.create({
    name,
    email,
    password
  })

  if(user){
    createToken(res, user._id);
    res.status(201).json({
        _id: user.id,
        name: user.name,
        password: user.password
    })
  }
  else{
    res.status(400);
    throw new Error('Invalid User');
  }

 
}

//route POST /api/users/login
const loginUser = async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    createToken(res, user._id)
    res.status(201).json({
      _id: user.id,
      name: user.name,
      password: user.password
    })
  } else {
    res.status(401)
    throw new Error('Invalid Email or password')
  }
 }

 //route POST /api/users/logout
 const logoutUser = async (req, res) => {
  console.log(res)
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: 'User logged out' })
}
 

export { createUser, loginUser, logoutUser }
