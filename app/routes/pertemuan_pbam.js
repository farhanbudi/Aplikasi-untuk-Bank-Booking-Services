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

//pbam get data by id pertemuan dari tabel jadwal pertemuan + feedback
router.get(
  "/meet/find/:id_pertemuan",
  middleware.protect,
  middleware.authorize("pbam"),
  controller.meetFindById
);

//pbam get data by id pba dari tabel jadwal pertemuan + feedback
router.get(
  "/meet/find-by-pba/:id_pba",
  middleware.protect,
  middleware.authorize("pbam"),
  controller.meetFindByPba
);

//get data by id pcu dari tabel jadwal pertemuan + feedback
router.get(
  "/meet/find-by-pcu/:id_pcu",
  middleware.protect,
  middleware.authorize("pbam"),
  controller.meetFindByPcu
);

//routes pbam get semua data dari tabel jadwal pertemuan + feedback
router.get(
  "/meet/find-all",
  middleware.protect,
  middleware.authorize("pbam"),
  controller.meetFindAll
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

// route baru
router.get(
  "/meet/tempat/:tanggal_mulai/:tanggal_selesai",
  controller.findTanggal
);

module.exports = router;
