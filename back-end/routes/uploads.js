const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/dbConfig"); // Adjust the path to your dbConfig file

const fs = require("fs");
const { release } = require("os");
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Ensure each file has a unique name
  },
});

const upload = multer({ storage });

// POST /upload-song: Handle file uploads
router.post("/upload-song", upload.single("song"), async (req, res) => {
  console.log("Request Headers:", req.headers); // Log headers to check Content-Type
  console.log("Received Body:", req.body); // Log body to check text fields
  console.log("Received File:", req.file); // Log the file object (should contain file details)

  const { title, artist, genre, releaseDate } = req.body;

  const filePath = req.file ? req.file.path : null;

  if (!title || !filePath) {
    return res
      .status(400)
      .json({ message: "Title and song file are required" });
  }

  if (!releaseDate) {
    return res.status(400).json({ message: "Release date is required" });
  }

  try {
    const query = `
      INSERT INTO songs (title, artist, genre, file_path, release_date)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(query, [title, artist, genre, filePath, releaseDate]);

    res.status(201).json({ message: "Song uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading song:", error.message);
    res
      .status(500)
      .json({ message: "Failed to upload song. Please try again." });
  }
});

module.exports = router;
