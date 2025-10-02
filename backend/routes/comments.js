import express from "express";
import { body, validationResult } from "express-validator";
import Comment from "../models/Comment.js";
import Item from "../models/Item.js";
import Notification from "../models/Notification.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/comments/item/:itemId - Get all comments for an item
router.get("/item/:itemId", auth, async (req, res) => {
  try {
    const comments = await Comment.find({ 
      item: req.params.itemId,
      parentComment: null // Only get top-level comments
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('user', 'name email')
          .sort({ createdAt: 1 });
        
        return {
          ...comment.toObject(),
          replies
        };
      })
    );

    res.json(commentsWithReplies);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// POST /api/comments - Add a new comment
router.post("/",
  auth,
  [
    body("itemId", "Item ID is required").notEmpty(),
    body("text", "Comment text is required").notEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemId, text, parentCommentId } = req.body;

    try {
      const item = await Item.findById(itemId);
      
      if (!item) {
        return res.status(404).json({ msg: "Item not found" });
      }

      // Create comment
      const comment = new Comment({
        item: itemId,
        user: req.userId,
        text,
        parentComment: parentCommentId || null
      });

      await comment.save();

      // Populate user info
      await comment.populate('user', 'name email');

      // Create notification for item owner if commenter is not the owner
      if (item.createdBy.toString() !== req.userId) {
        const notification = new Notification({
          recipient: item.createdBy,
          sender: req.userId,
          type: "comment",
          item: itemId,
          message: `${comment.user.name} commented on your ${item.type} item "${item.name}"`,
          additionalInfo: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
          actionRequired: false
        });

        await notification.save();
      }

      res.status(201).json({ 
        msg: "Comment added successfully", 
        comment 
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
);

// DELETE /api/comments/:id - Delete a comment
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized to delete this comment" });
    }

    // Delete comment and its replies
    await Comment.deleteMany({ parentComment: req.params.id });
    await Comment.findByIdAndDelete(req.params.id);

    res.json({ msg: "Comment deleted successfully" });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;