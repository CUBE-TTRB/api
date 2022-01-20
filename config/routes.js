const express = require('express')

const baseController = require('../controllers/base_controller')
const indexController = require('../controllers/index_controller')

const router = express.Router()

router.use(baseController.headers)
router.get('/index', indexController.index)

module.exports = router
