const express = require("express");
const getVendors = require("./getAllVendors");
const getVendorById = require("./getVendorById");
const registerVendor = require("./signupVendor");
const signin = require("./signinVendor");
const getVendorStats = require("./getVendorStats");

const router = express.Router();


router.post("/signup", registerVendor);

router.post("/signin", signin);

router.get("/getAllVendors", getVendors);

router.get("/:id", getVendorById);

router.get("/getVendorStats/:vendorId", getVendorStats);

module.exports = router;