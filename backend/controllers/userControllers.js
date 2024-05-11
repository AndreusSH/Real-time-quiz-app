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

  res.status(200).json({ message: 'Create user' });

}

export { createUser }
