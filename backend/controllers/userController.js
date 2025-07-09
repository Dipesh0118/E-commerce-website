import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import Order from '../models/OrderModel.js';  // ensure this path is correct

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });
  generateToken(res, user._id);
  res.status(201).json({ _id: user._id, name: user.name, email: user.email });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({ _id: user._id, name: user.name, email: user.email });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
export const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, createdAt: updated.createdAt });
};
export const getUsers = async (req, res) => {
  // 1) Fetch all users with the fields we need
  const users = await User.find({}, 'name email role').lean();

  // 2) Aggregate orders by user to compute count & sum
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$user',
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalPrice' },
      },
    },
  ]);

  // 3) Convert stats to a map for easy lookup
  const statsMap = stats.reduce((map, s) => {
    map[s._id.toString()] = s;
    return map;
  }, {});

  // 4) Attach stats to each user (default to zero)
  const usersWithStats = users.map((u) => {
    const s = statsMap[u._id.toString()] || {};
    return {
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      totalOrders: s.totalOrders || 0,
      totalSpent: s.totalSpent || 0,
    };
  });

  res.json(usersWithStats);
};