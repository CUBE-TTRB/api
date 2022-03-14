import express from 'express'

import baseController from '../controllers/base_controller'
import usersController from '../controllers/users_controller'
import resourcesController from '../controllers/resources_controller'
import sessionsController from '../controllers/sessions_controller'

const router = express.Router()

router.use(baseController.initLocals)
router.use(baseController.headers)

// router.use(baseController.recordNotFoundHandler)

router.get('/users', usersController.index)
router.post('/users', usersController.create)

router.post('/sessions', sessionsController.create)
router.use('/users/:id', baseController.tokenCheck)
router.get('/users/:id', usersController.show)
// router.patch('/users/:id', usersController.update)
// router.delete('/users/:id', usersController.destroy)

router.use('/resources', baseController.tokenCheck)

router.get('/resources', resourcesController.index)
router.post('/resources', resourcesController.create)
router.get('/resources/:id', resourcesController.show)
router.patch('/resources/:id', resourcesController.update)
router.delete('/resources/:id', resourcesController.destroy)

router.use(baseController.responseHandler)

router.use((_req, res, _next) => {
  res.status(404).send("Sorry can't find that!")
})

export default router
