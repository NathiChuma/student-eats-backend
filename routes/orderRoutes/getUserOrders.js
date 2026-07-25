const { db } = require('../../firebase.js')

const getUserOrders = async (req, res) => {
  try {
    const { email } = req.params;

    const snapshot = await db
      .collection("orders")
      .where("userEmail", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]); // no orders yet, not an error
    }

    const orders = snapshot.docs.map(doc => ({
      id: doc.data().id,
      ...doc.data()
    }));

    // optional: sort newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json(orders);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};

module.exports = getUserOrders;