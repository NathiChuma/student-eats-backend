import { Router } from "express";
import signup from "./signup";
import signin from "./signin";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
