const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth')

// Routes Login
router.post('/login', controller.loginUser)
router.get('/logout', controller.logoutUser)
router.put('/forgotpassword', controller.forgotPassword)
router.put('/resetpassword', controller.resetPassword)

module.exports = router;