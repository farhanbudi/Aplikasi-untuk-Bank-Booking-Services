const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth");

// Routes Login and logout
router.post("/login", controller.loginUser);
router.get("/logout", controller.logoutUser);

module.exports = router;
