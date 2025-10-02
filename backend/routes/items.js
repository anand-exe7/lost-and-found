import express from "express";
import { body, validationResult } from "express-validator";
import Item from "../models/Item.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// GET /api/items - Fetch items by type (lost or found)
router.get("/", auth, async (req, res) => {
  try {
    const { type } = req.query; // Get type from query params
    
    if (!type || !["lost", "found"].includes(type)) {
      return res.status(400).json({ msg: "Invalid or missing type parameter. Must be 'lost' or 'found'." });
    }

    const items = await Item.find({ type })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }); // Most recent first

    // Transform items to include reporter name
    const transformedItems = items.map(item => ({
      ...item.toObject(),
      reporter: item.createdBy?.name || "Anonymous"
    }));

    res.json(transformedItems);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// POST /api/items - Create a new lost/found item
router.post(
  "/",
  auth,
  upload.single("image"),
  [
    body("name", "Item name is required").notEmpty().trim(),
    body("category", "Category is required").notEmpty().trim(),
    body("description", "Description is required").notEmpty().trim(),
    body("location", "Location is required").notEmpty().trim(),
    body("date", "Date is required").notEmpty(),
    body("time", "Time is required").notEmpty(),
    body("type", "Type must be 'lost' or 'found'").isIn(["lost", "found"]),
  ],
  async (req, res, next) => {
    try {
      // Validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, category, description, location, date, time, type } = req.body;
      
      // Get user info for reporter name and email
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Handle uploaded image
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      // Create new item
      const item = new Item({
        name,
        category,
        description,
        location,
        date,
        time,
        image,
        type,
        contactEmail: user.email,
        reporter: user.name,
        createdBy: req.userId
      });

      await item.save();

      res.status(201).json({ 
        msg: `${type === 'lost' ? 'Lost' : 'Found'} item created successfully`, 
        item 
      });
    } catch (err) {
      console.error('Error creating item:', err);
      next(err);
    }
  }
);

// GET /api/items/:id - Get single item by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    const transformedItem = {
      ...item.toObject(),
      reporter: item.createdBy?.name || "Anonymous"
    };

    res.json(transformedItem);
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// POST /api/items/found/:id - Mark item as found and notify owner
router.post("/found/:id", auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    
    if (item.type === "found") {
      return res.status(400).json({ msg: "This item is already marked as found" });
    }

    // Send email notification
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: item.contactEmail,
        subject: `Great News! Your item "${item.name}" was found`,
        html: `
          <h2>Good News!</h2>
          <p>Someone has reported finding your item: <strong>${item.name}</strong></p>
          <p><strong>Location:</strong> ${item.location}</p>
          <p><strong>Description:</strong> ${item.description}</p>
          <p>Please log in to the app to contact the finder.</p>
        `
      });
    } catch (emailErr) {
      console.error('Error sending email:', emailErr);
      // Continue even if email fails
    }

    item.type = "found";
    await item.save();

    res.json({ msg: "Owner notified successfully", item });
  } catch (err) {
    console.error('Error marking item as found:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// DELETE /api/items/:id - Delete an item (only by creator)
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    // Check if user is the creator
    if (item.createdBy.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized to delete this item" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ msg: "Item deleted successfully" });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;