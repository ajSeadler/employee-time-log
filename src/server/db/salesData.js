const db = require('./client');

const createSale = async (month, sales) => {
  try {
    const { rows } = await db.query(`
      INSERT INTO sales (month, sales)
      VALUES ($1, $2)
      RETURNING *;
    `, [month, sales]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const getSalesByMonth = async (month) => {
  try {
    const { rows } = await db.query(`
      SELECT *
      FROM sales
      WHERE month = $1;
    `, [month]);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getAllSales = async () => {
  try {
    const { rows } = await db.query('SELECT * FROM sales;');
    return rows;
  } catch (error) {
    throw error;
  }
};

const updateSale = async (id, month, sales) => {
  try {
    const { rows } = await db.query(`
      UPDATE sales
      SET month = $2, sales = $3
      WHERE id = $1
      RETURNING *;
    `, [id, month, sales]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const deleteSale = async (id) => {
  try {
    const { rows } = await db.query(`
      DELETE FROM sales
      WHERE id = $1
      RETURNING *;
    `, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createSale,
  getSalesByMonth,
  getAllSales,
  updateSale,
  deleteSale,
};
