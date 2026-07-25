const { db } = require("../../firebase");

const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    // find vendor by field id
    const vendorSnapshot = await db
      .collection("vendors")
      .where("id", "==", id)
      .limit(1)
      .get();

    if (vendorSnapshot.empty) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    const vendorDoc = vendorSnapshot.docs[0];
    const vendorData = vendorDoc.data();

    // get menu items
    const menuSnapshot = await db
      .collection("vendors")
      .doc(vendorDoc.id)
      .collection("menuItems")
      .get();

    const menuItems = [];

    for (const menuDoc of menuSnapshot.docs) {
      const menuData = menuDoc.data();

      // get addOns for this menu item
      const addOnSnapshot = await db
        .collection("vendors")
        .doc(vendorDoc.id)
        .collection("menuItems")
        .doc(menuDoc.id)
        .collection("addOns")
        .get();

      const addOns = addOnSnapshot.docs.map(addOnDoc => ({
        id: addOnDoc.id,
        ...addOnDoc.data()
      }));

      menuItems.push({
        id: menuDoc.id,
        ...menuData,
        addOns
      });
    }

    const vendor = {
      ...vendorData,
      menuItems
    };

    res.status(200).json(vendor);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = getVendorById;