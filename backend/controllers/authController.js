const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    const lowerCaseUsername = username.toLowerCase();


    const existingUser = await User.findOne({ $or: [{ lowerCaseUsername }, { email }] });
    if (existingUser) {
      if (existingUser.username === lowerCaseUsername) {
        return res
          .status(409)
          .json({ error: "Conflict - Username is already taken" });
      } else {
        return res
          .status(410)
          .json({ error: "Conflict - Email is already taken" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const randColorGenerator = () => {
      let randomColor = Math.floor(Math.random() * 16777215).toString(16);
      let color = "#" + randomColor;
      while (color === "#ffffff") {
        randomColor = Math.floor(Math.random() * 16777215).toString(16);
        color = "#" + randomColor;
      }
      return color;
    };

    const randColor = randColorGenerator();

    const newUser = new User({
      username: lowerCaseUsername,
      email,
      password: hashedPassword,
      fullName,
      randColor: randColor,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        name: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        randColor: newUser.randColor,
      },
      "your-secret-key",
      {
        expiresIn: "1h",
      }
    );

    return res.status(201).json({
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Convert input username to lowercase
    const lowerCaseUsername = username.toLowerCase();

    // Find user in the database using the lowercase username
    const user = await User.findOne({ username: lowerCaseUsername });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        name: user.username,
        email: user.email,
        fullName: user.fullName,
        randColor: user.randColor,
      },
      "your-secret-key",
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const profile = async (req, res) => {
  try {
    // Retrieve user information from the authenticated request
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { register, login, profile };
