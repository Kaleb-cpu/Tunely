// server.js
const express = require("express");
const db = require('./config/dbConfig'); 
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const uploadsRoutes = require("./routes/uploads");
const songRoutes = require('./routes/songRoute');
const myuploadsRoute = require("./routes/myuploads"); 
const app = express();
const port = 3005;

app.use(cors());
app.use(bodyParser.json());

// Create Account Endpoint
app.post("/create-account", async (req, res) => { // Move 'async' before (req, res)
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if the email already exists
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUser] = await db.query(checkUserQuery, [email]);
  
    // Check if user exists in the database
    if (existingUser && existingUser.length > 0) {
      // Custom message for existing user
      return res.status(400).json({ message: "Account already exists. Please log in." });
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Insert the new user into the database
    const insertUserQuery = `
      INSERT INTO users (name, email, passwordHash)
      VALUES (?, ?, ?)
    `;
    await db.query(insertUserQuery, [name, email, hashedPassword]);
  
    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    console.error("Error creating account:", error.message);
    res.status(500).json({ message: "Account already exists. Please log in instead." });
  }
  
});

// login api

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Execute the query to find the user by email
    const result = await db.query("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email]);

    // Log the query result for debugging
    console.log("Full Query Result:", result);

    // Extract user from the query result
    const user = Array.isArray(result) ? result[0] : result.rows?.[0];

    if (!user) {
      console.error("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Extracted User:", user);

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Login successful
    res.status(200).json({
      message: "Login successful",
      user: { id: user.UserID, name: user.Name, email: user.Email },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.use("/api", uploadsRoutes);
app.use('/api/songs', songRoutes);
app.use(myuploadsRoute);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
