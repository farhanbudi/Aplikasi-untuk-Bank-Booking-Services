const express = require('express')
const router = express.Router()
const controller = require('../controllers/user')
const middleware = require('../middleware/middleware')

// Routes PCU
// router.get('/admin/pcu', middleware.protect, middleware.authorize('bpba'), controller.getAllPcu)
router.post('/admin/add/pcu', middleware.protect, middleware.authorize('bpba'), controller.PostPcu)

// Routes PBA
// router.get('/admin/pba', middleware.protect, middleware.authorize('bpba'), controller.getAllPBA)
router.post('/admin/add/pba', middleware.protect, middleware.authorize('bpba'), controller.PostPBA)

// Routes PBAM
// router.get('/admin/pbam', middleware.protect, middleware.authorize('bpba'), controller.getAllPBAM)
router.post('/admin/add/pbam', middleware.protect, middleware.authorize('bpba'), controller.PostPBAM)

// Routes BPBA
//router.post('/admin/add/bpba', middleware.protect, middleware.authorize('bpba'), controller.PostBPBA)
router.post('/admin/add/bpba', controller.PostBPBA)

//Routes get all Users data
router.get('/admin/list-user', middleware.protect, middleware.authorize('bpba'), controller.getAllUser)

//Routes get Users By ID
router.get('/admin/list-user/:id', middleware.protect, middleware.authorize('bpba'), controller.getUserId)

//Routes get users data with role
router.get('/admin/find-by-role/:role', middleware.protect, middleware.authorize('bpba'), controller.getRole)

//Routes get users data with name
router.get('/admin/find-by-name/:name', middleware.protect, middleware.authorize('bpba'), controller.getName)

//Routes get users data with email
router.get('/admin/find-by-email/:email', middleware.protect, middleware.authorize('bpba'), controller.getEmail)

//Routes update user
router.put('/admin/update', middleware.protect, middleware.authorize('bpba'), controller.updateUser)

//Routes update status user
router.put('/admin/status-change', middleware.protect, middleware.authorize('bpba'), controller.updateStatusUser)

//Routes set pbam dari pba
router.put('/admin/set-pbam-dari-pba', middleware.protect, middleware.authorize('bpba'), controller.setPBAMdariPBA)

//Routes set pcu dari pba
router.put('/admin/set-pcu-dari-pba/:id', middleware.protect, middleware.authorize('bpba'), controller.setPCUdariPBA)

//Routes menambah jadwal libur
router.post('/schedule/holiday/add', middleware.protect, middleware.authorize('bpba'), controller.postHoliday)
router.get('/schedule/holiday', middleware.protect, middleware.authorize('bpba'), controller.getAllHolidays)

//router.post('/schedule/holiday/add', controller.postHoliday)
//router.get('/schedule/holiday', controller.getAllHolidays)

//Routes mengedit jadwal libur
router.put('/schedule/holiday/edit', middleware.protect, middleware.authorize('bpba'), controller.updateHolidays)

//router.put('/schedule/holiday/edit', controller.updateHolidays)

//Routes menghapus jadwal libur
router.put('/schedule/holiday/delete', middleware.protect, middleware.authorize('bpba'), controller.deleteHolidays)


module.exports = router;