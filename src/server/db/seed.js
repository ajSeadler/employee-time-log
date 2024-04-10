const db = require("./client");
const { createUser } = require("./users");

const users = [
  {
    name: "Emily Johnson",
    email: "emily@example.com",
    password: "pass",
    is_admin:true, 
  },
  {
    name: "Liu Wei",
    email: "liu@example.com",
    password: "strongpass",
  },
  {
    name: "Isabella García",
    email: "bella@example.com",
    password: "pass1234",
  },
  {
    name: "Mohammed Ahmed",
    email: "mohammed@example.com",
    password: "mysecretpassword",
  },
  {
    name: "John Smith",
    email: "john@example.com",
    password: "password123",
  },
];



const dropTables = async () => {
  try {
    await db.query(`DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS restaurants;
    DROP TABLE IF EXISTS users;`);
  } catch (err) {
    throw err;
  }
};

// users table has a primary key on the id field.
// restaurants table has a primary key on the id field.
// reviews table has a primary key on the id field.
// The user_id field in the reviews table is a foreign key that references the id field in the users table, establishing a relationship between reviews and users.
// The restaurant_id field in the reviews table is a foreign key that references the id field in the restaurants table, establishing a relationship between reviews and restaurants.

const createTables = async () => {
  try {
    await db.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) DEFAULT 'name',
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            is_admin BOOLEAN NOT NULL DEFAULT FALSE
            
        );`

    )
  } catch (err) {
    throw err;
  }
};

// Your seed script
const insertUsers = async () => {
  try {
    for (const [index, user] of users.entries()) {
      const isEmily = user.name === "Emily Johnson";
      const createdUser = await createUser({
        name: user.name,
        email: user.email,
        password: user.password,
        is_admin: isEmily, // Set is_admin to true for Emily Johnson
      });

      console.log("User inserted:", createdUser);

      if (isEmily) {
        console.log("Making Emily an admin...");
        await db.query("UPDATE users SET is_admin = true WHERE id = $1", [createdUser.id]);
      }
    }
    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error inserting seed data:", error);
  }
};

const seedDatabse = async () => {
  try {
    db.connect();
    await dropTables();
    await createTables();
    await insertUsers();
  } catch (err) {
    
  }
};

seedDatabse();
