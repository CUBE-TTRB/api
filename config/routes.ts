import express from 'express'

import baseController from '../controllers/base_controller'
import usersController from '../controllers/users_controller'

const router = express.Router()

router.use(baseController.headers)

router.get('/users', usersController.index)
router.post('/users', usersController.create)
router.get('/users/:id', usersController.show)
// router.patch('/users/:id', usersController.update)
// router.delete('/users/:id', usersController.destroy)

export default router
