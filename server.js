require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Schema
const feedbackSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: String,
  palette: Array,
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// API route
app.post("/api/feedback", async (req, res) => {
  try {
    const { fullName, rating, comment, palette } = req.body;

    if (!fullName || !rating) {
      return res.status(400).json({ message: "Name and rating are required" });
    }

    await Feedback.create({ fullName, rating, comment, palette });
    res.json({ message: "Feedback saved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 IMPORTANT FOR VERCEL
module.exports = app;
