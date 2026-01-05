require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

let isConnected = false;

// MongoDB connection (serverless-safe)
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
}
connectDB();

// Schema
const feedbackSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: String,
  palette: Array,
  createdAt: { type: Date, default: Date.now }
});

const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

// Route
app.post("/api/feedback", async (req, res) => {
  try {
    const { fullName, rating, comment, palette } = req.body;

    if (!fullName || !rating) {
      return res.status(400).json({ message: "Name and rating required" });
    }

    await Feedback.create({ fullName, rating, comment, palette });
    res.json({ message: "Feedback saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = app;
