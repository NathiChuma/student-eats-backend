const express = require("express");
const addOrder = require("./addOrder");
const getOrder = require("./getOrder");
const getUserOrders = require("./getUserOrders");

const router = express.Router();

router.post("/addOrder", addOrder);
router.get("/:id", getOrder);
router.get("/getUserOrders/:email", getUserOrders);

module.exports = router;