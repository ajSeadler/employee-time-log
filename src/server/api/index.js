const express = require("express");
const apiRouter = express.Router();

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const volleyball = require("volleyball");
const { getUserById } = require("../db");
apiRouter.use(volleyball);

// TO BE COMPLETED - set `req.user` if possible, using token sent in the request header
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    // TODO - Get JUST the token out of 'auth'
    const token = auth.slice(prefix.length);

    try {
      const parsedToken = jwt.verify(token, JWT_SECRET);

      const id = parsedToken && parsedToken.id;
      if (id) {
        req.user = await getUserById(id)
        next();
      }
    } catch (error) {
      next(error);
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);



module.exports = apiRouter;
