const connectDB = require("../db/db");
const oracledb = require("oracledb");

exports.createPrescription = async (req, res) => {
  let conn;
  try {
    const { appointment_id, medicines } = req.body;

    conn = await connectDB();

    // Insert prescription
    const result = await conn.execute(
      `INSERT INTO prescriptions (appointment_id)
       VALUES (:appointment_id)
       RETURNING prescription_id INTO :id`,
      {
        appointment_id,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    const prescriptionId = result.outBinds.id[0];

    // Insert medicines
    for (let med of medicines) {
      await conn.execute(
        `INSERT INTO prescription_items (prescription_id, medicine_id, quantity)
         VALUES (:pid, :mid, :qty)`,
        {
          pid: prescriptionId,
          mid: med.medicine_id,
          qty: med.quantity
        },
        { autoCommit: true }
      );
    }

    res.json({ message: "Prescription created" });
  } catch (err) {
    console.error("Error creating prescription:", err.message);
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
