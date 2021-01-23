const express = require('express')
const router = express.Router()
const controller = require('../controllers/cuti')
const middleware = require('../middleware/middleware')

//routes add jadwal cuti
router.post('/schedule/cuti/add', middleware.protect, middleware.authorize('pbam'), controller.addCuti)

//routes update jadwal cuti
router.put('/schedule/cuti/edit', middleware.protect, middleware.authorize('pbam'), controller.updateCuti)

//routes add jadwal cuti
router.put('/schedule/cuti/delete', middleware.protect, middleware.authorize('pbam'), controller.deleteCuti)

//routes get all jadwal cuti
router.get('/schedule/cuti/find-all', middleware.protect, middleware.authorize('pbam'), controller.getAllCuti)

//routes get jadwal cuti by id
router.get('/schedule/cuti/find/:id', middleware.protect, middleware.authorize('pbam'), controller.getCuti)

module.exports = router;