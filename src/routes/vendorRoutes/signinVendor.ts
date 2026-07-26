import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { db } from "../../firebase";
import { VendorRecord } from "../../types";

interface SigninVendorBody {
  storeCode: string;
  password: string;
}

const signin: RequestHandler<{}, unknown, SigninVendorBody> = async (req, res) => {
  try {
    const { storeCode, password } = req.body;

    if (!storeCode || !password) {
      return res.status(400).json({ error: "Store code and password are required" });
    }

    const snapshot = await db
      .collection("vendors")
      .where("storeCode", "==", storeCode)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({ error: "Invalid store code or password" });
    }

    const vendorDoc = snapshot.docs[0];
    const vendor = vendorDoc.data() as VendorRecord;

    const passwordMatch = await bcrypt.compare(password, vendor.passwordHash);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid store code or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      vendor: {
        id: vendorDoc.id,
        storeCode: vendor.storeCode,
        storeName: vendor.storeName,
        email: vendor.email,
        phone: vendor.phone,
        category: vendor.category,
        bankAccount: {
          accountName: vendor.bankAccount?.accountName ?? "",
          accountNumber: vendor.bankAccount?.accountNumber ?? "",
          bankName: vendor.bankAccount?.bankName ?? "",
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default signin;
