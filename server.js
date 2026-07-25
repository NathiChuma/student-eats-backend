const express = require("express");
const authRoutes = require("./routes/authRoutes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes/vendorRoutes");
const orderRoutes = require("./routes/orderRoutes/orderRoutes");
const cors = require('cors');

const app = express();

app.use(express.json());

// Use the cors middleware
app.use(cors({
    origin: 'http://localhost:8080' // Only allow this specific origin
}));

app.use("/auth", authRoutes);
app.use("/vendors", vendorRoutes);
app.use("/orders", orderRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});