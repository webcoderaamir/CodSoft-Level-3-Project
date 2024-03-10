const express = require("express");
const router = express.Router();
const user = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ error: errors.array()[0].msg });
  };
};

// Validation rules
const createUserValidations = [
  body("name", "Name must be at least 5 characters long").isLength({ min: 5 }),
  body("email", "Invalid email format").isEmail(),
  body("password", "Password must be at least 5 characters long").isLength({ min: 5 }),
];

const loginUserValidations = [
  body("email", "Invalid email format").isEmail(),
  body("password", "Password must be at least 5 characters long").isLength({ min: 5 }),
];

// Route to create a new user
router.post("/createUser", validate(createUserValidations), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await user.create({ name, email, password: hashedPassword });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: "This email is already registered" });
  }
});

// Route to login user
router.post("/loginUser", validate(loginUserValidations), async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await user.findOne({ email });
    if (!userData) {
      return res.status(400).json({ error: "This email is not registered" });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const authToken = jwt.sign({ id: userData._id }, secretKey);
    res.json({
      success: true,
      authToken,
      userName: userData.name,
      userId: userData._id,
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Route to get user IDs
router.get("/userId", async (req, res) => {
  try {
    const data = await user.find({}, "email");
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
