require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
const dbstring = process.env.DBSTRING;
mongoose.connect(dbstring)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Schema: Lost Item
const lostSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  location: String,
  date: Date,
  email: String,
  status: { type: String, default: "open" }
});

const Lost = mongoose.model("Lost", lostSchema);

// Schema: Found Item
const foundSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  location: String,
  date: Date,
  image: String,
  matchedLostId: { type: mongoose.Schema.Types.ObjectId, ref: "Lost" },
  status: { type: String, default: "new" }
});

const Found = mongoose.model("Found", foundSchema);

// Routes
app.post("/lost", async (req, res) => {
  const lostItem = new Lost(req.body);
  await lostItem.save();
  res.json({ message: "Lost item reported", lostItem });
});

app.post("/found", async (req, res) => {
  const foundItem = new Found(req.body);
  await foundItem.save();
  res.json({ message: "Found item reported", foundItem });
});

app.get("/lost", async (req, res) => {
  const items = await Lost.find();
  res.json(items);
});

app.get("/found", async (req, res) => {
  const items = await Found.find();
  res.json(items);
});

// Start Server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
