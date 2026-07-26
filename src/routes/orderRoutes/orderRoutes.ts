import { Router } from "express";
import addOrder from "./addOrder";
import getOrder from "./getOrder";
import getUserOrders from "./getUserOrders";

const router = Router();

router.post("/addOrder", addOrder);
router.get("/getUserOrders/:email", getUserOrders);
router.get("/:id", getOrder);

export default router;
