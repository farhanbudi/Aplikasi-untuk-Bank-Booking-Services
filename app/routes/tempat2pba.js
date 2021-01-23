const express = require('express')
const router = express.Router()
const controller = require('../controllers/tempat2pba')
const middleware = require('../middleware/middleware')

//routes add list tempat 
router.post('/location/pba/add', middleware.protect, middleware.authorize('pbam'), controller.addLocPBA)

//routes get all list of location
router.get('/location/pba', middleware.protect, middleware.authorize('pbam'), controller.getLocPBA)

module.exports = router;