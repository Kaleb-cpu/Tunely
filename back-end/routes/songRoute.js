const express = require('express');
const router = express.Router();
const { searchSongs, playSong } = require('../controllers/songController');

// Search for songs
router.get('/search', searchSongs);

// Play a song by ID
// Play a song by ID
router.get("/api/songs/play/:id", playSong);



module.exports = router;
