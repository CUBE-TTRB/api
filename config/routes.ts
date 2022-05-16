import express from 'express'

import baseController from '../controllers/base_controller'
import errorsController from '../controllers/errors_controller'
import usersController from '../controllers/users_controller'
import resourcesController from '../controllers/resources_controller'
import sessionsController from '../controllers/sessions_controller'

const router = express.Router()

// Initiate response locals and headers
router.use(baseController.initLocals)
router.use(baseController.headers)

// Users
router.post('/users', usersController.create)
router.post('/sessions', sessionsController.create)
router.get('/users/confirm/:token', usersController.confirm)
// router.use('/users/:id', baseController.tokenCheck)
// router.patch('/users/:id', usersController.update)
// router.delete('/users/:id', usersController.destroy)

// Resources
router.get('/resources', resourcesController.index)
router.use('/resources', baseController.tokenCheck)
router.post('/resources', resourcesController.create)
router.get('/resources/:id', resourcesController.show)
router.patch('/resources/:id', resourcesController.update)
router.delete('/resources/:id', resourcesController.destroy)

// Error handling
router.use(errorsController.recordNotFoundHandler)
router.use(errorsController.invalidRecordHandler)
router.use(errorsController.prismaErrorHandler)
router.use(errorsController.unknownErrorHandler)

// Final response formatting
router.use(baseController.responseHandler)

export default router
