import express from 'express'

import baseController from '../controllers/base_controller'
import errorsController from '../controllers/errors_controller'
import usersController from '../controllers/users_controller'
import sessionsController from '../controllers/sessions_controller'
import resourcesRouter from './routers/resources_router'
import usersRouter from './routers/users_router'
import commentsRouter from './routers/comments_router'
import categoriesRouter from './routers/categories_router'

const router = express.Router()

// Initiate response locals and headers
router.use(baseController.initLocals)
router.use(baseController.headers)
router.use(usersController.setCurrentUser)

// Users
router.use('/users', usersRouter)
router.post('/sessions', sessionsController.create)

// Resources
router.use('/resources', resourcesRouter)
router.use('/comments', commentsRouter)
router.use('/categories', categoriesRouter)

// Error handling
router.use(errorsController.recordNotFoundHandler)
router.use(errorsController.invalidRecordHandler)
router.use(errorsController.prismaErrorHandler)
router.use(errorsController.unknownErrorHandler)

// Final response formatting
router.use(baseController.responseHandler)

export default router
