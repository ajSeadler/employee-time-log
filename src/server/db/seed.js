const db = require("./client");
const { createUser } = require("./users");

const users = [
  {
    name: "John Doe",
    email: "john@e.com",
    password: "pass",
    is_admin: true,
  },
  {
    name: "Liu Wei",
    email: "liu@example.com",
    password: "strongpass",
  },
  // Add more users if needed
];

const employeeStats = [
  {
    userId: 1,
    weeklyHours: 0,
    monthlyHours: 40,
    paidTimeOff: 10,
    hourlyWage: 14, // New hourly wage field
  },
  {
    userId: 2,
    weeklyHours: 35,
    monthlyHours: 150,
    paidTimeOff: 8,
    hourlyWage: 25, // New hourly wage field
  },
  // Add more employee stats if needed
];

const dropTables = async () => {
  try {
    await db.query(`
    DROP TABLE IF EXISTS employee_timestamps;
    DROP TABLE IF EXISTS employee_stats;
    DROP TABLE IF EXISTS users;`);
  } catch (err) {
    throw err;
  }
};

const createTables = async () => {
  try {
    await db.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) DEFAULT 'name',
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            is_admin BOOLEAN NOT NULL DEFAULT FALSE
        );

        CREATE TABLE employee_stats(
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          weekly_hours INTEGER,
          monthly_hours INTEGER,
          expected_salary DECIMAL(10, 2),
          earnings_so_far DECIMAL(10, 2),
          paid_time_off INTEGER,
          hourly_wage DECIMAL(10, 2),
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
      );

      CREATE TABLE employee_timestamps (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        employee_stats_id INTEGER REFERENCES employee_stats(id), 
        timestamp TIMESTAMP NOT NULL,
        event_type VARCHAR(50) NOT NULL
    );
    
    `);
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
    throw err;
  }
};


const insertUsers = async () => {
  try {
    for (const [index, user] of users.entries()) {
      const isJohn = user.name === "John Doe";
      const createdUser = await createUser({
        name: user.name,
        email: user.email,
        password: user.password,
        is_admin: isJohn, 
      });

      console.log("User inserted:", createdUser);

      if (isJohn) {
        console.log("Making Emily an admin...");
        await db.query("UPDATE users SET is_admin = true WHERE id = $1", [createdUser.id]);
      }
    }
    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error inserting seed data:", error);
  }
};

const insertEmployeeStats = async () => {
  try {
    for (const stat of employeeStats) {
      const { userId, weeklyHours, monthlyHours, hourlyWage } = stat;
      
      // Check if the user with the given userId exists
      const userExists = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
      if (userExists.rows.length === 0) {
        console.error(`User with id ${userId} does not exist. Skipping insertion of stats.`);
        continue;
      }
      
      // Calculate earnings so far based on weekly hours and hourly wage
      const earningsSoFar = weeklyHours * hourlyWage;

      // Calculate expected salary
      const expectedSalary = monthlyHours * hourlyWage;

      // Insert new stats
      const insertStatsQuery = `
        INSERT INTO employee_stats (user_id, weekly_hours, monthly_hours, expected_salary, earnings_so_far, paid_time_off, hourly_wage)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, last_updated;`; // Include last_updated field in the RETURNING clause

      const statsResult = await db.query(insertStatsQuery, [
        userId, weeklyHours, monthlyHours, expectedSalary, earningsSoFar, stat.paidTimeOff, hourlyWage
      ]);

      const statsId = statsResult.rows[0].id;
      const lastUpdated = statsResult.rows[0].last_updated; // Get the timestamp

      // Insert timestamp for stats update
      const timestamp = new Date().toISOString();
      await db.query(`
        INSERT INTO employee_timestamps (user_id, employee_stats_id, timestamp, event_type)
        VALUES ($1, $2, $3, $4)
      `, [userId, statsId, timestamp, 'stats_update']);
    }
    console.log("Employee stats and timestamps inserted successfully.", employeeStats);
  } catch (error) {
    console.error("Error inserting employee stats and timestamps:", error);
  }
};


const insertFakeTimestamps = async () => {
  try {
    // Retrieve all user IDs from the database
    const usersResult = await db.query('SELECT id FROM users');
    const userIds = usersResult.rows.map(row => row.id);

    const fakeTimestamps = [];

    // Generate fake timestamps for each user
    for (const userId of userIds) {
      // Generate fake timestamps for each weekday (Monday to Friday)
      for (let i = 0; i < 6; i++) { // iterate 6 times for 6 days
        // Create clock in timestamp at 9 AM
        const clockInTimestamp = new Date();
        clockInTimestamp.setHours(9, 0, 0, 0); // Set time to 9 AM
        clockInTimestamp.setDate(clockInTimestamp.getDate() - (i + 1)); // Get date of (i + 1) days ago

        // Create clock out timestamp at 5 PM
        const clockOutTimestamp = new Date(clockInTimestamp);
        clockOutTimestamp.setHours(17, 0, 0, 0); // Set time to 5 PM

        fakeTimestamps.push({ userId, timestamp: clockInTimestamp, event_type: 'clock_in' });
        fakeTimestamps.push({ userId, timestamp: clockOutTimestamp, event_type: 'clock_out' });
      }
    }

    // Insert fake timestamps into the database
    for (const timestamp of fakeTimestamps) {
      const { userId, timestamp: ts, event_type } = timestamp;

      await db.query(`
        INSERT INTO employee_timestamps (user_id, timestamp, event_type)
        VALUES ($1, $2, $3)
      `, [userId, ts, event_type]);
    }
    console.log("Fake timestamps inserted successfully.");
  } catch (error) {
    console.error("Error inserting fake timestamps:", error);
  }
};




const seedDatabase = async () => {
  try {
    await db.connect();
    await dropTables();
    await createTables();
    await insertUsers();
    await insertEmployeeStats();
    await insertFakeTimestamps();
    console.log("Database seeded successfully.");
    
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await db.end();
  }
};

seedDatabase();
