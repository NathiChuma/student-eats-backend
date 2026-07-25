const { db } = require('../../firebase.js')
const bcrypt = require("bcrypt");

const signin = async (req, res) => {
  try {
    const { storeCode, password } = req.body;

    const snapshot = await db
      .collection("vendors")
      .where("storeCode", "==", storeCode)
      .limit(1)
      .get();

    console.log("Store Code:", storeCode);
    console.log("Snapshot:", snapshot.empty);

    if (snapshot.empty) {
      return res.status(400).json({ error: "Invalid store code or password" });
    }

    const vendorDoc = snapshot.docs[0];
    const vendor = vendorDoc.data();

    const passwordMatch = await bcrypt.compare(password, vendor.passwordHash);

    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid store code or password" });
    }

    res.status(200).json({
      message: "Login successful",
      vendor: {
        id: vendorDoc.id,
        storeCode: vendor.storeCode,
        storeName: vendor.storeName,
        email: vendor.email,
        phone: vendor.phone,
        category: vendor.category,
        bankAccount: {
          accountName: vendor.bankAccount.accountName,
          accountNumber: vendor.bankAccount.accountNumber,
          bankName: vendor.bankAccount.bankName,
        },
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = signin;