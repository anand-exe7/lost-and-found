import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // Changed from 'title' to 'name'
  category: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  location: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  image: { type: String, default: null }, // Path to uploaded image
  contactEmail: { type: String, required: true, lowercase: true, trim: true },
  type: { type: String, enum: ["lost", "found"], required: true }, // Changed from 'status' to 'type'
  reporter: { type: String, default: "Anonymous" }, // Reporter name
  urgent: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

// Prevent model overwrite error during hot reloads
export default mongoose.models.Item || mongoose.model("Item", ItemSchema);