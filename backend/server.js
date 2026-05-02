const express = require("express");
const cors = require("cors");
require("dotenv").config();

const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const connectDB = require("./db/db");

const app = express();

// CORS configuration for Vercel deployment
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5000",
    /https:\/\/.*\.vercel\.app$/,
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
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

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database connection string: ${process.env.DB_CONNECT}`);
  });
}

// Export for Vercel serverless
module.exports = app;