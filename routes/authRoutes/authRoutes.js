const express = require("express");
const signup = require("./signup");
const signin = require("./signin");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

module.exports = router;