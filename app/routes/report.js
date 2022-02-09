const express = require("express");
const router = express.Router();
const controller = require("../controllers/pertemuan");
const middleware = require("../middleware/middleware");

// routes pbam melihat rangking pba
router.get(
  "/report/ranking/:tanggal",
  middleware.protect,
  middleware.authorize("pbam"),
  controller.reportRankPBA
);

//routes pbam melihat laporan harian
router.get(
  "/report/:tanggal",
  middleware.protect,
  middleware.authorize("pbam"),
  controller.pbaReportDaily
);

//routes pbam melihat laporan harian tiap pba
router.get(
  "/report/:tanggal/:id_pba",
  middleware.protect,
  middleware.authorize("pbam"),
  controller.pbaReportDailyById
);

module.exports = router;
