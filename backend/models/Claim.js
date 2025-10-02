import mongoose from "mongoose";

const ClaimSchema = new mongoose.Schema({
  item: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Item", 
    required: true 
  },
  claimant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  foundLocation: { 
    type: String, 
    required: true 
  },
  foundDate: { 
    type: String, 
    required: true 
  },
  foundTime: { 
    type: String, 
    required: true 
  },
  additionalDetails: { 
    type: String, 
    default: "" 
  },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"],
    default: "pending" 
  }
}, { timestamps: true });

export default mongoose.models.Claim || mongoose.model("Claim", ClaimSchema);