import baseController from '../../controllers/base_controller'
import resourcesController from '../../controllers/resources_controller'
import express from 'express'

const resourcesRouter = express.Router()

resourcesRouter.get('/', resourcesController.index)

resourcesRouter.post('/', baseController.tokenCheck)
resourcesRouter.post('/', resourcesController.create)

resourcesRouter.get('/:id', resourcesController.show)

resourcesRouter.patch('/:id', baseController.tokenCheck)
resourcesRouter.patch('/:id', resourcesController.update)

resourcesRouter.delete('/:id', baseController.tokenCheck)
resourcesRouter.delete('/:id', resourcesController.destroy)

export default resourcesRouter
