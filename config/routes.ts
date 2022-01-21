import express from 'express'

import baseController from '../controllers/base_controller'
import indexController from '../controllers/index_controller'

const router = express.Router()
router.use(baseController.headers)
router.get('/index', indexController.index)

export default router
