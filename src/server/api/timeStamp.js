const express = require('express');
const timeStampRouter = express.Router();
const { getTimeStampsByUserId, addTimeStamp } = require('../db/timeStamp');

// GET /api/timestamps/:userId
timeStampRouter.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const timeStamps = await getTimeStampsByUserId(userId);
    res.json(timeStamps);
  } catch (error) {
    console.error('Error fetching timestamps by user ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/timestamps/update
timeStampRouter.post('/update', async (req, res) => {
  const { userId, action } = req.body;
  try {
    let eventType;
    if (action === 'clock_in') {
      eventType = 'clock_in';
    } else if (action === 'clock_out') {
      eventType = 'clock_out';
    } else {
      throw new Error('Invalid action');
    }

    // Add a new timestamp for the user
    await addTimeStamp(userId, eventType);
    res.status(200).json({ message: 'Timestamp added successfully' });
  } catch (error) {
    console.error('Error adding timestamp:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

module.exports = timeStampRouter;
