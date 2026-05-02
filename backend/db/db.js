const oracledb = require("oracledb");
require("dotenv").config();

// Try to initialize Oracle Client (optional - uses Thin mode if unavailable)
try {
  oracledb.initOracleClient();
} catch (err) {
  console.warn("Oracle Client not found - using Thin mode (requires network connection to DB)");
}

async function connectDB() {
  try {
    return await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT
    });
  } catch (err) {
    console.error("Database connection error:", err.message);
    throw err;
  }
}

module.exports = connectDB;