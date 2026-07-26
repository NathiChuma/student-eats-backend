import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes/authRoutes";
import vendorRoutes from "./routes/vendorRoutes/vendorRoutes";
import orderRoutes from "./routes/orderRoutes/orderRoutes";

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:8080";

app.use(express.json());

app.use(
  cors({
    origin: CLIENT_ORIGIN, // Only allow the frontend's origin
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/vendors", vendorRoutes);
app.use("/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
