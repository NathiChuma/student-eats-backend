import { RequestHandler } from "express";
import { db } from "../../firebase";
import { VendorRecord } from "../../types";

const getAllVendors: RequestHandler = async (_req, res) => {
  try {
    const snapshot = await db.collection("vendors").get();

    // Never expose passwordHash on the public vendor listing.
    const vendors = snapshot.docs.map((doc) => {
      const { passwordHash: _omit, id: _omitId, ...publicData } = doc.data() as VendorRecord;
      return { id: doc.id, ...publicData };
    });

    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export default getAllVendors;
