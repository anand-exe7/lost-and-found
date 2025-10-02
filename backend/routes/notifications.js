import express from "express";
import Notification from "../models/Notification.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/notifications - Get all notifications for current user
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .populate('sender', 'name email')
      .populate('item', 'name category type')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// GET /api/notifications/unread-count - Get unread notification count
router.get("/unread-count", auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      recipient: req.userId, 
      read: false 
    });
    res.json({ count });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// PUT /api/notifications/mark-all-read - Mark all notifications as read
router.put("/mark-all-read", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.userId, read: false },
      { read: true }
    );

    res.json({ msg: "All notifications marked as read" });
  } catch (err) {
    console.error('Error marking all as read:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete("/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ msg: "Notification deleted" });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;