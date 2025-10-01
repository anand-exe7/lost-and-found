import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = express.Router();

// Route: POST /api/auth/signup
// Desc:  Register a new user
router.post("/signup",
  body("name", "Name is required").notEmpty(),
  body("email", "Please include a valid email").isEmail(),
  body("password", "Password must be 6 or more characters").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "Email already registered" });
      }

      user = new User({ name, email, password });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Optionally, you can also sign in the user right after signup
      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Route: POST /api/auth/login
// Desc:  Authenticate user & get token
router.post("/login",
  body("email", "Please include a valid email").isEmail(),
  body("password", "Password is required").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const payload = { id: user.id }; // Mongoose uses .id as a virtual getter for ._id
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

      // This is the corrected response that includes the user object
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

export default router;