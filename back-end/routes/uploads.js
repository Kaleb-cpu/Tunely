const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/dbConfig"); // Adjust the path to your dbConfig file

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
  console.log("Request Headers:", req.headers);    // Log headers to check Content-Type
  console.log("Received Body:", req.body);         // Log body to check text fields
  console.log("Received File:", req.file);         // Log the file object (should contain file details)

  const { title, artist, album, genre } = req.body;
  const filePath = req.file ? req.file.path : null;

  if (!title || !filePath) {
    return res.status(400).json({ message: "Title and song file are required" });
  }

  try {
    const query = `
      INSERT INTO songs (title, artist, album, genre, file_path)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.query(query, [title, artist, album, genre, filePath]);

    res.status(201).json({ message: "Song uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading song:", error.message);
    res.status(500).json({ message: "Failed to upload song. Please try again." });
  }
});



module.exports = router;
