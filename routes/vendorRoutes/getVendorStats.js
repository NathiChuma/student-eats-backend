const { db } = require('../../firebase.js')

const getVendorStats = async (req, res) => {
  try {
    const { vendorId } = req.params;

    // get all orders for this vendor
    const snapshot = await db
      .collection("orders")
      .where("vendorId", "==", vendorId)
      .get();

    if (snapshot.empty) {
      return res.status(200).json({
        totalOrders: 0,
        pendingOrders: 0,
        readyOrders: 0,
        revenue: 0,
        completedToday: 0
      });
    }

    let totalOrders = 0;
    let pendingOrders = 0;
    let readyOrders = 0;
    let revenue = 0;
    let completedToday = 0;

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

    snapshot.docs.forEach(doc => {
      const order = doc.data();

      totalOrders++;

      // count statuses
      if (order.status === "pending" || order.status === "preparing") {
        pendingOrders++;
      }

      if (order.status === "ready") {
        readyOrders++;
      }

      // check if today
      const orderDate = new Date(order.createdAt)
        .toISOString()
        .split("T")[0];

      const isToday = orderDate === todayStr;

      // revenue + completed today
      if (isToday && order.status === "collected") {
        revenue += Number(order.totalAmount) || 0;
        completedToday++;
      }
    });

    return res.status(200).json({
      totalOrders,
      pendingOrders,
      readyOrders,
      revenue,
      completedToday
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};

module.exports = getVendorStats;