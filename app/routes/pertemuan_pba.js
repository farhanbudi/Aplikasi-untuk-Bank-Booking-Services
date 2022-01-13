const express = require("express");
const router = express.Router();
const controller = require("../controllers/pertemuan");
const middleware = require("../middleware/middleware");

//routes konfirmasi pertemuan
router.put(
  "/meet/confirmed/:id_pertemuan",
  middleware.protect,
  middleware.authorize("pba"),
  controller.pbaConfirmed
);

//routes konfirmasi pertemuan
router.put(
  "/meet/rejected/:id_pertemuan",
  middleware.protect,
  middleware.authorize("pba"),
  controller.pbaRejected
);

//routes pcu memberi feedback
router.put(
  "/feedback/:id_pertemuan",
  middleware.protect,
  middleware.authorize("pba"),
  controller.pbaAddFeedback
);

//get data by id pertemuan dari tabel jadwal pertemuan + feedback
router.get(
  "/meet/find/:id_pertemuan",
  middleware.protect,
  middleware.authorize("pba"),
  controller.meetFindById
);

//get data by id pba dari tabel jadwal pertemuan + feedback
router.get(
  "/meet/find-by-pba/:id_pba",
  middleware.protect,
  middleware.authorize("pba"),
  controller.meetFindByPba
);

//get semua data dari tabel jadwal pertemuan + feedback
router.get(
  "/meet/find-all",
  middleware.protect,
  middleware.authorize("pba"),
  controller.meetFindAll
);

module.exports = router;
