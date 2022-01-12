/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");
const connect = require("connect-ensure-login");

// import models so we can interact with the database
const User = require("./models/user");
const Level = require("./models/level");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

// initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  return res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  }
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// posting a new level
router.post("/level", auth.ensureLoggedIn, (req, res) => {
  const newLevel = new Level({
    creator: "Creator",
    name: req.body.name,
    start: req.body.start,
    exit: req.body.exit,
    platforms: req.body.platforms,
    decoration: req.body.decoration,
    coins: req.body.coins,
    obstacles: req.body.obstacles,
    funness: req.body.funness,
    difficulty: req.body.difficulty,
  });

  newLevel.save().then((level) => {
    console.log("level from backend: ", level);
    res.send(level);
  });
});

// getting all or filtered levels
router.get("/levels", (req, res) => {
  let actualQuery;
  if (
    req.query.name.length === 0
    && req.query.difficulty.length === 0
    && req.query.funness.length === 0
  ) {
    actualQuery = {};
  } else {
    actualQuery = {
      name: req.query.name,
      difficulty: req.query.difficulty,
      funness: req.query.funness,
    };
  }
  Level.find(actualQuery, (err, levels) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.send(levels);
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
