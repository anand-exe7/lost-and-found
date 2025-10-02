import express from "express";
import { body, validationResult } from "express-validator";
import Claim from "../models/Claim.js";
import Item from "../models/Item.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/claims - Create a new claim
router.post("/",
  auth,
  [
    body("itemId", "Item ID is required").notEmpty(),
    body("foundLocation", "Found location is required").notEmpty(),
    body("foundDate", "Found date is required").notEmpty(),
    body("foundTime", "Found time is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemId, foundLocation, foundDate, foundTime, additionalDetails } = req.body;

    try {
      const item = await Item.findById(itemId);
      
      if (!item) {
        return res.status(404).json({ msg: "Item not found" });
      }

      if (item.type !== "lost") {
        return res.status(400).json({ msg: "Can only claim lost items" });
      }

      if (item.createdBy.toString() === req.userId) {
        return res.status(400).json({ msg: "You cannot claim your own item" });
      }

      // Check if there's already a pending claim
      const existingClaim = await Claim.findOne({ 
        item: itemId, 
        status: "pending" 
      });

      if (existingClaim) {
        return res.status(400).json({ msg: "There is already a pending claim for this item" });
      }

      // Create claim
      const claim = new Claim({
        item: itemId,
        claimant: req.userId,
        owner: item.createdBy,
        foundLocation,
        foundDate,
        foundTime,
        additionalDetails
      });

      await claim.save();

      // Update item status
      item.claimStatus = "pending";
      await item.save();

      // Get claimant info
      const claimant = await User.findById(req.userId);

      // Create notification for owner
      const notification = new Notification({
        recipient: item.createdBy,
        sender: req.userId,
        type: "found_claim",
        item: itemId,
        message: `${claimant.name} claims to have found your lost item "${item.name}"`,
        additionalInfo: `Location: ${foundLocation} | Date: ${foundDate} at ${foundTime}`,
        actionRequired: true,
        claimId: claim._id
      });

      await notification.save();

      res.status(201).json({ 
        msg: "Claim submitted successfully", 
        claim 
      });
    } catch (err) {
      console.error('Error creating claim:', err);
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
);

// PUT /api/claims/:id/approve - Approve a claim
router.put("/:id/approve", auth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('item')
      .populate('claimant', 'name email');
    
    if (!claim) {
      return res.status(404).json({ msg: "Claim not found" });
    }

    if (claim.owner.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized to approve this claim" });
    }

    if (claim.status !== "pending") {
      return res.status(400).json({ msg: "Claim has already been processed" });
    }

    // Update claim
    claim.status = "approved";
    await claim.save();

    // Update item - change to found and set found details
    const item = await Item.findById(claim.item._id);
    item.type = "found";
    item.foundBy = claim.claimant._id;
    item.foundLocation = claim.foundLocation;
    item.foundDate = claim.foundDate;
    item.foundTime = claim.foundTime;
    item.claimStatus = "claimed";
    item.reporter = claim.claimant.name; // Update reporter to finder's name
    await item.save();

    // Create notification for claimant
    const notification = new Notification({
      recipient: claim.claimant._id,
      sender: req.userId,
      type: "claim_approved",
      item: item._id,
      message: `Your claim for "${item.name}" has been approved!`,
      additionalInfo: "The item has been marked as found with your details.",
      actionRequired: false
    });

    await notification.save();

    res.json({ 
      msg: "Claim approved successfully", 
      claim,
      item 
    });
  } catch (err) {
    console.error('Error approving claim:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// PUT /api/claims/:id/reject - Reject a claim
router.put("/:id/reject", auth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('item')
      .populate('claimant', 'name email');
    
    if (!claim) {
      return res.status(404).json({ msg: "Claim not found" });
    }

    if (claim.owner.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized to reject this claim" });
    }

    if (claim.status !== "pending") {
      return res.status(400).json({ msg: "Claim has already been processed" });
    }

    // Update claim
    claim.status = "rejected";
    await claim.save();

    // Update item status back to unclaimed
    const item = await Item.findById(claim.item._id);
    item.claimStatus = "unclaimed";
    await item.save();

    // Create notification for claimant
    const notification = new Notification({
      recipient: claim.claimant._id,
      sender: req.userId,
      type: "claim_rejected",
      item: item._id,
      message: `Your claim for "${item.name}" has been declined`,
      additionalInfo: "The owner did not recognize this as their item.",
      actionRequired: false
    });

    await notification.save();

    res.json({ 
      msg: "Claim rejected", 
      claim 
    });
  } catch (err) {
    console.error('Error rejecting claim:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// GET /api/claims/item/:itemId - Get claim for an item
router.get("/item/:itemId", auth, async (req, res) => {
  try {
    const claim = await Claim.findOne({ 
      item: req.params.itemId,
      status: "pending"
    })
    .populate('claimant', 'name email')
    .populate('owner', 'name email');
    
    res.json(claim);
  } catch (err) {
    console.error('Error fetching claim:', err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;