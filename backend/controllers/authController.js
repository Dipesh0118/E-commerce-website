import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role, // Include the role in the response
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  };
//   export const getCurrentUser = async (req, res) => {
//     const user = await User.findById(req.user._id).select('-password');
//     if (user) return res.json(user);
//     res.status(404).json({ message: 'User not found' });
//   };
// New admin creation route (only for admins)
const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

//   if (!req.user.isAdmin) {
//     res.status(403);
//     throw new Error('Only admins can create other admins');
//   }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const admin = await User.create({
    name,
    email,
    password,
    isAdmin: true,
    role: 'admin',
  });

  res.status(201).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    isAdmin: admin.isAdmin,
    role: admin.role,
  });
};

export { loginUser, createAdmin };
