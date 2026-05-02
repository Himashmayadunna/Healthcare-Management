const express = require("express");
const cors = require("cors");
require("dotenv").config();

const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const connectDB = require("./db/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const conn = await connectDB();
    await conn.close();
    res.json({ status: "Database connected successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database connection failed: " + err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(`Database connection string: ${process.env.DB_CONNECT}`);
});