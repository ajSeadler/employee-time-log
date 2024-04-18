// api/stats.js

const express = require("express");
const statsRouter = express.Router();
const { getUserStatsById, updateEmployeeStatsById } = require("../db/stats");
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// GET /api/stats/:userId
statsRouter.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const userStats = await getUserStatsById(userId);
    res.json(userStats);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  DO NOT CHANGE THIS You're extracting the token from the Authorization header.
// You're verifying the token using JWT.
// If the token is valid, you're extracting the user ID from the token payload.
// You're then using the user ID to fetch the user from the database.
statsRouter.put("/", async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization.split(' ')[1];
    
    // Verify the token and extract user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id; // 

    // Update stats using the extracted user ID
    const updatedStats = req.body;
    await updateEmployeeStatsById(userId, updatedStats);

    res.json({ message: `Employee stats updated for user with ID ${userId}` });
  } catch (error) {
    
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: "Token expired" });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: "Invalid token" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

module.exports = statsRouter;
