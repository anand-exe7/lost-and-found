import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  location: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  image: { type: String, default: null },
  contactEmail: { type: String, required: true, lowercase: true, trim: true },
  type: { type: String, enum: ["lost", "found"], required: true },
  reporter: { type: String, default: "Anonymous" },
  urgent: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  // New fields for found items
  foundBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    default: null 
  },
  foundLocation: { 
    type: String, 
    default: null 
  },
  foundDate: { 
    type: String, 
    default: null 
  },
  foundTime: { 
    type: String, 
    default: null 
  },
  claimStatus: {
    type: String,
    enum: ["unclaimed", "pending", "claimed"],
    default: "unclaimed"
  }
}, { timestamps: true });

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);