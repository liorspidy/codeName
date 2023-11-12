const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username or email is already registered
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email is already taken' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      // Additional user-related fields can be added here
    });

    await newUser.save();

    // Create and send a JWT token for the registered user
    const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: '1h' });

    return res.status(201).json({ token, user: { username: newUser.username, email: newUser.email } });
  } catch (error) {
    console.error('Error registering user:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create and send a JWT token for the authenticated user
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    return res.status(200).json({ token, user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error logging in:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const profile = async (req, res) => {
  try {
    // Retrieve user information from the authenticated request
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { register, login, profile };
