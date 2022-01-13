const express = require("express");
const router = express.Router();
const controller = require("../controllers/pertemuan");
const middleware = require("../middleware/middleware");

//routes pbam menambah jadwal pertemuan
router.post(
  "/meet/add",
  middleware.protect,
  middleware.authorize("pbam"),
  controller.addMeet
);

//routes pbam mengubah jadwal pertemuan
router.put(
  "/meet/change/:id_pertemuan",
  middleware.protect,
  middleware.authorize("pbam"),
  controller.pcuMeetChange
);

//routes pbam membatalkan pertemuan
router.put(
  "/meet/cancel/:id_pertemuan",
  middleware.protect,
  middleware.authorize("pbam"),
  controller.pcuMeetCancel
);

module.exports = router;
