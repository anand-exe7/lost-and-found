import express from "express";
import { body, validationResult } from "express-validator";
import Item from "../models/Item.js";
import auth from "../middleware/auth.js";
import nodemailer from "nodemailer";
import multer from "multer";
const upload = multer({ dest: "uploads/" }); 

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create lost/found item
router.post("/", auth, upload.single("image"), async (req, res, next) => {
  try {
    const { name, category, description, location, date, time } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const item = new Item({
      name,
      category,
      description,
      location,
      date,
      time,
      image,
      createdBy: req.userId
    });

    await item.save();
    res.status(201).json({ msg: "Item created", item });
  } catch (err) {
    next(err);
  }
});

// Mark found + notify
router.post("/found/:id", auth, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ msg: "Item not found" });
  if (item.status === "found") return res.status(400).json({ msg: "Already found" });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: item.contactEmail,
    subject: `Your item "${item.title}" was found`,
    text: `Hello, your item "${item.title}" was found. Contact the finder via app.`
  });

  item.status = "found";
  await item.save();
  res.json({ msg: "Owner notified", item });
});

export default router;
