const connectDB = require("../db/db");

exports.getAppointments = async (req, res) => {
  let conn;
  try {
    conn = await connectDB();
    const result = await conn.execute(`SELECT * FROM appointments`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching appointments:", err.message);
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

exports.createAppointment = async (req, res) => {
  let conn;
  try {
    const { patient_id, doctor_id, appointment_date } = req.body;

    conn = await connectDB();

    await conn.execute(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, status)
       VALUES (:pid, :did, :date, 'Pending')`,
      { pid: patient_id, did: doctor_id, date: appointment_date },
      { autoCommit: true }
    );

    res.json({ message: "Appointment created" });
  } catch (err) {
    console.error("Error creating appointment:", err.message);
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