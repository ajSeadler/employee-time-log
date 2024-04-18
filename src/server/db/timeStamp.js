const db = require("./client");

const getTimeStampsByUserId = async (userId) => {
  try {
    const query = `
      SELECT timestamp, event_type
      FROM employee_timestamps
      WHERE user_id = $1
      ORDER BY timestamp DESC;
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error("Error fetching employee timestamps:", error);
    throw error;
  }
};


const addTimeStamp = async (userId, eventType) => {
  try {
    const timestamp = new Date(); // Get the current timestamp
    const query = `
      INSERT INTO employee_timestamps (user_id, timestamp, event_type)
      VALUES ($1, $2, $3)
    `;
    await db.query(query, [userId, timestamp, eventType]);
    console.log("Timestamp added successfully for user ID:", userId);
  } catch (error) {
    console.error("Error adding timestamp for user ID:", userId, error);
    throw error;
  }
};

module.exports = {
  getTimeStampsByUserId,
  addTimeStamp,
};

