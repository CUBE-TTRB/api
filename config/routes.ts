import express from 'express'

import baseController from '../controllers/base_controller'
import usersController from '../controllers/users_controller'
import articlesController from '../controllers/articles_controller'
import activitiesController from '../controllers/activities_controller'

const router = express.Router()

router.use(baseController.headers)
router.use(baseController.initLocals)
// router.use(baseController.recordNotFoundHandler)
router.get('/users', usersController.index)
router.post('/users', usersController.create)
router.post('/session', usersController.connect)

router.use('/resources', baseController.tokenCheck)
router.use('/users/:id', baseController.tokenCheck)

router.get('/users/:id', usersController.show)
// router.patch('/users/:id', usersController.update)
// router.delete('/users/:id', usersController.destroy)

router.get('/articles', articlesController.index)
router.post('/articles', articlesController.create)
router.get('/articles/:id', articlesController.show)
router.patch('/articles/:id', articlesController.update)
router.delete('/articles/:id', articlesController.destroy)

router.get('/activities', activitiesController.index)
router.post('/activities', activitiesController.create)
router.get('/activities/:id', activitiesController.show)
router.patch('/activities/:id', activitiesController.update)
router.delete('/activities/:id', activitiesController.destroy)

router.use(baseController.responseHandler)

router.use((_req, res, _next) => {
  res.status(404).send("Sorry can't find that!")
})

export default router
