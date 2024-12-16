const express = require("express");
const router = express.Router();
const db = require("../config/dbConfig");

// Fetch uploaded songs from the database
router.get("/api/myuploads", async (req, res) => {
  try {
    // Query to fetch artist, song title, and file path
    const results = await db.query("SELECT artist, title, file_path FROM songs");

    // Check if results are empty
    if (results.length === 0) {
      return res.status(404).json({ message: "No uploads found" });
    }

    // Log the results for debugging
    console.log("Fetched songs:", results);

    // Map through results to create the full URL for each song
    const songsWithUrls = results.map(song => ({
      ...song,
      song_url: `http://10.0.0.177:3005/uploads/${encodeURIComponent(song.file_path.replace(/\\/g, "/"))}`
    }));

    // Send the response with the updated song URLs
    res.status(200).json(songsWithUrls);
  } catch (err) {
    console.error("Error fetching uploads:", err.message, err.stack);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
});


module.exports = router;
