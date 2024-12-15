const express = require("express");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const router = express.Router();
const dbConfig = require("../config/dbConfig");  // Database configuration

// Create Account Endpoint
router.post("/create-account", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    let pool = await sql.connect(dbConfig);

    // Check if the email already exists in the database
    let checkUser = await pool
      .request()
      .input("Email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE Email = @Email");

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Insert the new user into the Users table with the hashed password
    await pool
      .request()
      .input("Name", sql.VarChar, name)
      .input("Email", sql.VarChar, email)
      .input("PasswordHash", sql.VarChar, hashedPassword)  // Store hashed password
      .input("ConfirmPasswordHash", sql.VarChar, confirmHashedPassword)
      .query(
        "INSERT INTO Users (Name, Email, PasswordHash) VALUES (@Name, @Email, @PasswordHash)"
      );

    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    sql.close();
  }
});

module.exports = router;
