import express from 'express'

import baseController from '../controllers/base_controller'
import usersController from '../controllers/users_controller'
import resourcesController from '../controllers/resources_controller'
import articlesController from '../controllers/articles_controller'
// import activitiesController from '../controllers/acitivities_controller'

const router = express.Router()

router.use(baseController.headers)

router.get('/users', usersController.index)
router.post('/users', usersController.create)
router.get('/users/:id', usersController.show)
// router.patch('/users/:id', usersController.update)
// router.delete('/users/:id', usersController.destroy)

router.get('/resources', resourcesController.index)
router.post('/resources', resourcesController.create)
router.get('/resources/:id', resourcesController.show)
router.patch('/resources/:id', resourcesController.update)
router.delete('/resources/:id', resourcesController.destroy)

router.post('/articles', articlesController.create)

// router.post('/activities', activitiesController.create)

export default router
