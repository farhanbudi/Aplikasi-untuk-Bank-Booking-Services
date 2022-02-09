const express = require("express");
const router = express.Router();
const controller = require("../controllers/tempat");
const middleware = require("../middleware/middleware");

//routes add list tempat
router.post(
  "/location/add",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.addLoc
);

//routes get all list of location
router.get(
  "/location/find-all",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.getAllLoc
);

//routes update list of location
router.put(
  "/location/edit/:id",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.updateLoc
);

// route baru
// router.get("/pertemuan/tempat/:tempat", controller.getPertemuanTempat);

module.exports = router;
