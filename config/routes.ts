import express from 'express'

import baseController from '@App/controllers/base_controller'
import errorsController from '@App/controllers/errors_controller'
import usersController from '@App/controllers/users_controller'
import sessionsController from '@App/controllers/sessions_controller'
import resourcesRouter from '@App/config/routers/resources_router'
import usersRouter from '@App/config/routers/users_router'
import commentsRouter from '@App/config/routers/comments_router'
import categoriesRouter from '@App/config/routers/categories_router'

const router = express.Router()

// Initiate response locals and headers
router.use(baseController.initLocals)
router.use(baseController.headers)
router.use(usersController.setCurrentUser)

// Resources routing
router.use('/users', usersRouter)
router.post('/sessions', sessionsController.create)
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
