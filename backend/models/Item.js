import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  contactEmail: { type: String, required: true, lowercase: true, trim: true },
  status: { type: String, enum: ["lost", "found"], default: "lost" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Item", ItemSchema);
