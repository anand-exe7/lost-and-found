import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  item: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Item", 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  text: { 
    type: String, 
    required: true,
    trim: true 
  },
  parentComment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Comment",
    default: null 
  }
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);