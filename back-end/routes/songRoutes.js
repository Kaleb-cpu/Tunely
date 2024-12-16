// songRoute.js (or wherever your song routes are defined)
const express = require('express');
const router = express.Router();
const { searchSongs, playSong } = require('../controllers/songController');

// Search songs
router.get('/search', searchSongs);

// Play song by ID
router.get('/play/:id', playSong);  // This is the route you're trying to access

module.exports = router;
