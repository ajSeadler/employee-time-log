const express = require("express");
const usersRouter = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  getUserByEmail,
  getUserById,
} = require("../db");
const { requireUser } = require("./utils");
const { JWT_SECRET = "somesecretvalue" } = process.env;
const jwt = require("jsonwebtoken");

//

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.send({
      users,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
//NEED TO FIX THIS ROUTE. PROFILE PAGE WORKS WITHOUT IT BUT NOT WITH IT
// usersRouter.get("/:id", async (req, res, next) => {
//   try {
//     const userId = req.params.id;
//     const user = await getUserById(userId); //error is here

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.send({
//       user,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

usersRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both an email and password",
    });
  }
  try {
    const user = await getUser({ email, password });
    console.log("User:", user);
    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "Login successful!",
        token,
      });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (err) {
    next(err);
  }
});

// ROute for the logged in users profile
usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    
    console.log("User profile:",req.user);
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});





usersRouter.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const _user = await getUserByEmail(email);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user with that email already exists",
      });
    }

    const user = await createUser({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      {
        id: user.id,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      message: "Sign up successful!",
      token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;
