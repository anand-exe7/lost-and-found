import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["found_claim", "claim_approved", "claim_rejected", "comment", "item_update"],
    required: true 
  },
  item: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Item", 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  additionalInfo: { 
    type: String, 
    default: "" 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  actionRequired: { 
    type: Boolean, 
    default: false 
  },
  claimId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Claim",
    default: null 
  }
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);