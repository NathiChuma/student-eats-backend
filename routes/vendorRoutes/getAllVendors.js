const { db } = require("../../firebase.js");

const getAllVendors = async (req, res) => {
  try {
    const snapshot = await db.collection("vendors").get();

    const vendors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(vendors);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = getAllVendors;