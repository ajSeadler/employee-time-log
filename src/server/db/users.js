const db = require('./client')
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

const createUser = async({ name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    try {
        const { rows: [user ] } = await db.query(`
        INSERT INTO users(name, email, password)
        VALUES($1, $2, $3)
        ON CONFLICT (email) DO NOTHING
        RETURNING *`, [name, email, hashedPassword]);

        return user;
    } catch (err) {
        throw err;
    }
}

const getUserByEmail = async(email) => {
    try {
        const { rows: [ user ] } = await db.query(`
        SELECT * 
        FROM users
        WHERE email=$1;`, [ email ]);

        if(!user) {
            return;
        }
        return user;
    } catch (err) {
        throw err;
    }
}

const getUser = async ({ email, password }) => {
    try {
        if (!email || !password) {
            throw new Error('Missing email or password');
        }

        const user = await getUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const hashedPassword = user.password;
        const passwordsMatch = await bcrypt.compare(password, hashedPassword);
        if (!passwordsMatch) {
            throw new Error('Incorrect password');
        }

        // Omitting password from the user object
        delete user.password;
        return user;
    } catch (err) {
        throw err;
    }
};




const getAllUsers = async () => {
    try {
        const { rows } = await db.query('SELECT * FROM users');
        return rows;
    } catch (error) {
        throw error;
    }
}


  const getUserById = async (userId) => {
    try {
      const { rows: [user] } = await db.query( 
        `
        SELECT *
        FROM users
        WHERE id = $1;
        `,
        [userId]
      );
  
      if (!user) return null;
  
      // Omitting password from the user object
      const sanitizedUser = { ...user };
      delete sanitizedUser.password;
  
      return sanitizedUser;
    } catch (error) {
      throw error;
    }
  };
  

  




module.exports = {
    createUser,
    getUser,
    getUserByEmail,
    getAllUsers, 
    getUserById,
};