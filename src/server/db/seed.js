const db = require('./client');

const users = [
  {
    name: 'Emily Johnson',
    email: 'emily@example.com',
    password: 'securepass',
  },
  {
    name: 'Liu Wei',
    email: 'liu@example.com',
    password: 'strongpass',
  },
  {
    name: 'Isabella García',
    email: 'bella@example.com',
    password: 'pass1234',
  },
  {
    name: 'Mohammed Ahmed',
    email: 'mohammed@example.com',
    password: 'mysecretpassword',
  },
  {
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password123',
  },
  // Add more user objects as needed
];  

const salesData = [
  { month: 'January', sales: 10000 },
  { month: 'February', sales: 12000 },
  { month: 'March', sales: 11000 },
  { month: 'April', sales: 10500 },
  { month: 'May', sales: 13000 },
  { month: 'June', sales: 12500 },
  { month: 'July', sales: 14000 },
];

const dropTables = async () => {
  try {
    await db.query('DROP TABLE IF EXISTS users, sales;');
  } catch (error) {
    throw error;
  }
};

const createTables = async () => {
  try {
    await db.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) DEFAULT 'name',
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    await db.query(`
      CREATE TABLE sales (
        id SERIAL PRIMARY KEY,
        month VARCHAR(255) NOT NULL,
        sales INTEGER NOT NULL
      );
    `);
  } catch (error) {
    throw error;
  }
};

const insertUsers = async () => {
  try {
    for (const user of users) {
      await db.query(`
        INSERT INTO users (name, email, password) VALUES ($1, $2, $3);
      `, [user.name, user.email, user.password]);
    }
    console.log('User data inserted successfully.');
  } catch (error) {
    console.error('Error inserting user data:', error);
  }
};

const insertSalesData = async () => {
  try {
    for (const data of salesData) {
      await db.query(`
        INSERT INTO sales (month, sales) VALUES ($1, $2);
      `, [data.month, data.sales]);
    }
    console.log('Sales data inserted successfully.');
  } catch (error) {
    console.error('Error inserting sales data:', error);
  }
};

const seedDatabase = async () => {
  try {
    await db.connect();
    await dropTables();
    await createTables();
    await insertUsers();
    await insertSalesData();
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await db.end();
  }
};

seedDatabase();
