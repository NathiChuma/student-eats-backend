import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { db } from "../../firebase";
import { VendorRecord } from "../../types";

interface SignupVendorBody {
  storeCode: string;
  storeName: string;
  email: string;
  phone: string;
  category: string;
  password: string;
}

const registerVendor: RequestHandler<{}, unknown, SignupVendorBody> = async (req, res) => {
  try {
    const { storeCode, storeName, email, phone, category, password } = req.body;

    // basic validation
    if (!storeCode || !storeName || !email || !phone || !category || !password) {
      return res.status(400).json({ error: "Missing required vendor fields" });
    }

    // prevent duplicate vendor by storeCode OR email
    const existingVendor = await db
      .collection("vendors")
      .where("storeCode", "==", storeCode)
      .limit(1)
      .get();

    if (!existingVendor.empty) {
      return res.status(400).json({ error: "Vendor with this storeCode already exists" });
    }

    const existingEmail = await db
      .collection("vendors")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingEmail.empty) {
      return res.status(400).json({ error: "Vendor with this email already exists" });
    }

    // hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // create new vendor doc with auto ID
    const vendorRef = db.collection("vendors").doc();

    const vendorData: VendorRecord = {
      id: vendorRef.id, // same as document id
      storeCode,
      storeName,
      passwordHash,
      email,
      phone,
      category,
      isBusy: false,
      isOpen: false,
      description: "",
      estimatedPrepTime: 0,
      bankAccount: {
        accountName: "",
        accountNumber: "",
        bankName: "",
      },
      createdAt: new Date().toISOString(),
    };

    await vendorRef.set(vendorData);

    // Never return the password hash to the client.
    const { passwordHash: _omit, ...vendorPublicData } = vendorData;

    return res.status(200).json({
      message: "Vendor registered successfully",
      vendorId: vendorRef.id,
      vendor: vendorPublicData,
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default registerVendor;
