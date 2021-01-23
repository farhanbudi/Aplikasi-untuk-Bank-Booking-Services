const express = require('express')
const router = express.Router()
const controller = require('../controllers/user')
const middleware = require('../middleware/middleware')

//PBAM melihat data PBA
router.get('/manager/list-pba', middleware.protect, middleware.authorize('pbam'), controller.getAllpba)


//PBAM edit Assisted_by data PBA 
router.put('/manager/update/assisted-by-change', middleware.protect, middleware.authorize('pbam'), controller.updateAssisted)


module.exports = router;