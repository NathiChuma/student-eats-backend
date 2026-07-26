import { RequestHandler } from "express";
import { db } from "../../firebase";
import { Order } from "../../types";

type AddOrderBody = Order;

const addOrder: RequestHandler<{}, unknown, AddOrderBody> = async (req, res) => {
  try {
    const {
      id,
      userEmail,
      vendorId,
      vendorName,
      items,
      totalAmount,
      status,
      createdAt,
      paymentReference,
    } = req.body;

    if (
      !id ||
      !userEmail ||
      !vendorId ||
      !vendorName ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      totalAmount === undefined ||
      !status ||
      !createdAt ||
      !paymentReference
    ) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const existingOrderSnapshot = await db
      .collection("orders")
      .where("id", "==", id)
      .limit(1)
      .get();

    if (!existingOrderSnapshot.empty) {
      return res.status(400).json({ error: "Order with this id already exists" });
    }

    const orderRef = db.collection("orders").doc();

    const order: Order = {
      id,
      userEmail,
      vendorId,
      vendorName,
      items,
      totalAmount,
      status,
      createdAt,
      paymentReference,
    };

    await orderRef.set(order);

    return res.status(201).json({
      message: "Order added successfully",
      firestoreDocId: orderRef.id,
      orderId: id,
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default addOrder;
