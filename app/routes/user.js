const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");
const middleware = require("../middleware/middleware");

// Routes PCU
// router.get('/admin/pcu', middleware.protect, middleware.authorize('bpba'), controller.getAllPcu)

// Routes PBA
// router.get('/admin/pba', middleware.protect, middleware.authorize('bpba'), controller.getAllPBA)

// Routes PBAM
// router.get('/admin/pbam', middleware.protect, middleware.authorize('bpba'), controller.getAllPBAM)

// Routes BPBA
//router.post('/admin/add/bpba', middleware.protect, middleware.authorize('bpba'), controller.getAllBPBA)\

//Routes add new user
router.post(
  "/admin/add",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.CreateNewUser
);

//Routes get all Users data
router.get(
  "/admin/list-user",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.getAllUser
);

//Routes get users data with role
router.get(
  "/admin/find-by-role/:role",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.getRole
);

//Routes get users data with name
router.get(
  "/admin/find-by-name/:name",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.getName
);

//Routes get users data with email
router.get(
  "/admin/find-by-email/:email",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.getEmail
);

//Routes update user
router.put(
  "/admin/update/:email",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.updateUser
);

//Routes update status user
router.put(
  "/admin/delete/:email",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.deleteUser
);

//Routes set pbam dari pba
router.put(
  "/admin/set-pba-dari-pbam",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.setPBAMdariPBA
);

//Routes set pcu dari pba
router.put(
  "/admin/set-pcu-dari-pba",
  middleware.protect,
  middleware.authorize("bpba"),
  controller.setPCUdariPBA
);

module.exports = router;
