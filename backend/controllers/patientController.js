const connectDB = require("../db/db");

exports.addPatient = async (req, res) => {
  let conn;
  try {
    const { name, age, contact } = req.body;
    conn = await connectDB();

    await conn.execute(
      `INSERT INTO patients (name, age, contact)
       VALUES (:name, :age, :contact)`,
      { name, age, contact },
      { autoCommit: true }
    );

    res.json({ message: "Patient added" });
  } catch (err) {
    console.error("Error adding patient:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
};

exports.getPatients = async (req, res) => {
  let conn;
  try {
    conn = await connectDB();
    const result = await conn.execute(`SELECT * FROM patients`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching patients:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing connection:", err.message);
      }
    }
  }
};