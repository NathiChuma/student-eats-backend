import { RequestHandler } from "express";
import { db } from "../../firebase";
import { Order, VendorStats } from "../../types";

interface GetVendorStatsParams {
  vendorId: string;
}

const getVendorStats: RequestHandler<GetVendorStatsParams> = async (req, res) => {
  try {
    const { vendorId } = req.params;

    // get all orders for this vendor
    const snapshot = await db
      .collection("orders")
      .where("vendorId", "==", vendorId)
      .get();

    const emptyStats: VendorStats = {
      totalOrders: 0,
      pendingOrders: 0,
      readyOrders: 0,
      revenue: 0,
      completedToday: 0,
    };

    if (snapshot.empty) {
      return res.status(200).json(emptyStats);
    }

    const stats: VendorStats = { ...emptyStats };

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

    snapshot.docs.forEach((doc) => {
      const order = doc.data() as Order;

      stats.totalOrders++;

      // count statuses
      if (order.status === "pending" || order.status === "preparing") {
        stats.pendingOrders++;
      }

      if (order.status === "ready") {
        stats.readyOrders++;
      }

      // check if today
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      const isToday = orderDate === todayStr;

      // revenue + completed today
      if (isToday && order.status === "collected") {
        stats.revenue += Number(order.totalAmount) || 0;
        stats.completedToday++;
      }
    });

    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default getVendorStats;
