const express = require("express");
const router = express.Router();
const { createPrescription, getPrescriptions } = require("../controllers/prescriptionController");

router.post("/", createPrescription);
router.get("/", getPrescriptions);

module.exports = router;