const { db } = require('../../firebase.js')

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const snapshot = await db
      .collection("orders")
      .where("id", "==", id)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        error: "Order not found"
      });
    }

    const orderDoc = snapshot.docs[0];
    const orderData = orderDoc.data();

    return res.status(200).json(orderData);
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};

module.exports = getOrder;