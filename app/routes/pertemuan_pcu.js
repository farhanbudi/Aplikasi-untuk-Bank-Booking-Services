const express = require('express')
const router = express.Router()
const controller = require('../controllers/pertemuan')
const middleware = require('../middleware/middleware')

//routes add jadwal cuti
router.post('/meet/add', middleware.protect, middleware.authorize('pcu'), controller.addMeet)

//routes pcu ganti jadwal
router.put('/meet/change/:id_pertemuan', middleware.protect, middleware.authorize('pcu'), controller.pcuMeetChange)

//routes pcu membatalkan pertemuan
router.put('/meet/cancel/:id_pertemuan', middleware.protect, middleware.authorize('pcu'), controller.pcuMeetCancel)

//routes pcu memberi feedback
router.put('/feedback/add/:id_pertemuan', middleware.protect, middleware.authorize('pcu'), controller.pcuAddFeedback)

//get data by id dari tabel jadwal pertemuan + feedback
router.get('/meet/find/:id_pertemuan', middleware.protect, middleware.authorize('pcu'), controller.meetFindById)

//get data by id pcu dari tabel jadwal pertemuan + feedback
router.get('/meet/find-by-pcu/:id_pcu', middleware.protect, middleware.authorize('pcu'), controller.meetFindByPcu)

//get semua data dari tabel jadwal pertemuan + feedback
router.get('/meet/find-all', middleware.protect, middleware.authorize('pcu'), controller.meetFindAll)

//get tempat yang dapat dipilih oleh pba tertentu
router.get('/tempat2pba/find/:id_pba', controller.getTempat2Pba)

module.exports = router;