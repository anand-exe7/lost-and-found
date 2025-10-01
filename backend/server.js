import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// --- Main Routes ---
// All requests to /api/auth/* will be handled by authRoutes
app.use("/api/auth", authRoutes);

// All requests to /api/items/* will be handled by itemRoutes
app.use("/api/items", itemRoutes);


// --- REMOVED THE CONFLICTING ROUTES THAT WERE HERE ---


// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));