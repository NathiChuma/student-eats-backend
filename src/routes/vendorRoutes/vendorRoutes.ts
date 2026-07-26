import { Router } from "express";
import getAllVendors from "./getAllVendors";
import getVendorById from "./getVendorById";
import getVendorStats from "./getVendorStats";
import signinVendor from "./signinVendor";
import signupVendor from "./signupVendor";

const router = Router();

router.get("/getAllVendors", getAllVendors);
router.get("/getVendorStats/:vendorId", getVendorStats);
router.post("/signup", signupVendor);
router.post("/signin", signinVendor);
router.get("/:id", getVendorById);

export default router;
