import { RequestHandler } from "express";
import { db } from "../../firebase";
import { VendorRecord, MenuItem, AddOn } from "../../types";

interface GetVendorParams {
  id: string;
}

const getVendorById: RequestHandler<GetVendorParams> = async (req, res) => {
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
    // Never expose passwordHash on the public vendor detail endpoint.
    const { passwordHash: _omit, ...vendorData } = vendorDoc.data() as VendorRecord;

    // get menu items
    const menuSnapshot = await db
      .collection("vendors")
      .doc(vendorDoc.id)
      .collection("menuItems")
      .get();

    const menuItems: MenuItem[] = [];

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

      const addOns: AddOn[] = addOnSnapshot.docs.map((addOnDoc) => ({
        id: addOnDoc.id,
        ...(addOnDoc.data() as Omit<AddOn, "id">),
      }));

      menuItems.push({
        id: menuDoc.id,
        ...(menuData as Omit<MenuItem, "id" | "addOns">),
        addOns,
      });
    }

    const vendor = {
      ...vendorData,
      menuItems,
    };

    return res.status(200).json(vendor);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default getVendorById;
