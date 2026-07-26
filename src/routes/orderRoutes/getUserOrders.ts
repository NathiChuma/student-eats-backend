import { RequestHandler } from "express";
import { db } from "../../firebase";
import { Order } from "../../types";

interface GetUserOrdersParams {
  email: string;
}

const getUserOrders: RequestHandler<GetUserOrdersParams> = async (req, res) => {
  try {
    const { email } = req.params;

    const snapshot = await db
      .collection("orders")
      .where("userEmail", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]); // no orders yet, not an error
    }

    const orders: Order[] = snapshot.docs.map((doc) => doc.data() as Order);

    // sort newest first
    orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default getUserOrders;
