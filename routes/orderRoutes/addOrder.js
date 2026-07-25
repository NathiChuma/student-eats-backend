const { db } = require('../../firebase.js')

const addOrder = async (req, res) => {
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
      paymentReference
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
      return res.status(400).json({
        error: "Missing required order fields"
      });
    }

    const existingOrderSnapshot = await db
      .collection("orders")
      .where("id", "==", id)
      .limit(1)
      .get();

    if (!existingOrderSnapshot.empty) {
      return res.status(400).json({
        error: "Order with this id already exists"
      });
    }

    const orderRef = db.collection("orders").doc();

    await orderRef.set({
      id,
      userEmail,
      vendorId,
      vendorName,
      items,
      totalAmount,
      status,
      createdAt,
      paymentReference
    });

    return res.status(201).json({
      message: "Order added successfully",
      firestoreDocId: orderRef.id,
      orderId: id
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};

module.exports = addOrder;