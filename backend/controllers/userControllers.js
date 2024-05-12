import User from '../models/userModels.js'
import generateToken from '../utils/generateToken.js'

//route POST /api/users/auth
//@access Public
const authUser = async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id)
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

//route POST /api/users
//@access Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body
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

  if (user) {
    generateToken(res, user._id)
    res.status(201).json({
      _id: user.id,
      name: user.name,
      password: user.password
    })
  } else {
    res.status(400)
    throw new Error('Invalid User')
  }
 }

//route POST /api/users/logout
//@access Public
const logoutUser = async (req, res) => {
  console.log(res)
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: 'User logged out' })
}

//route GET /api/users/profile
//@access Private
const getUserProfile = async (req, res) => {
  console.log(req.user)
  const user = {
    __id: req.user.id,
    name: req.user.name,
    email: req.user.email
  }
  res.status(200).json(user)
}

//route PUT /api/users/profile
//@access Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.name = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updateUser = await user.save();
    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email
    })
  } else {
    res.status(400)
    throw new Error('User not found')
  }
 }

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile }
