const db = require('../config/dbConfig');
const path = require('path');

// Search for songs
const searchSongs = async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    // Search in title, artist, album, or genre
    const searchQuery = `
      SELECT id, title, artist, album, genre, release_date 
      FROM songs 
      WHERE LOWER(title) LIKE LOWER(?) 
         OR LOWER(artist) LIKE LOWER(?)
         OR LOWER(album) LIKE LOWER(?)
         OR LOWER(genre) LIKE LOWER(?)
    `;
    const searchValue = `%${query}%`;
    const results = await db.query(searchQuery, [searchValue, searchValue, searchValue, searchValue]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No songs found.' });
    }

    res.status(200).json({ songs: results });
  } catch (error) {
    console.error('Error during song search:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Play a song
const playSong = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `SELECT file_path FROM songs WHERE id = ?`;
    const results = await db.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Song not found.' });
    }

    const filePath = results[0].file_path;
    const songUrl = `http://10.0.0.177:3005/uploads/${encodeURIComponent(filePath.replace(/\\/g, "/"))}`;
    res.status(200).json({ songUrl });
  } catch (error) {
    console.error('Error during song playback:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = { searchSongs, playSong };
