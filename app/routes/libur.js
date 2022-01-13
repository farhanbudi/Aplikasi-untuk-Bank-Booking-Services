const express = require("express");
const router = express.Router();
const controller = require("../controllers/libur");
const middleware = require("../middleware/middleware");

//Routes menambah jadwal libur
router.post(
  "/schedule/holiday/add",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.postHoliday
);

//Routes melihat jadwal libur
router.get(
  "/schedule/holiday",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.getAllHolidays
);

//Routes mengedit jadwal libur
router.put(
  "/schedule/holiday/edit/:id",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.updateHolidays
);

//Routes menghapus jadwal libur
router.put(
  "/schedule/holiday/delete/:id",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.deleteHolidays
);

module.exports = router;
