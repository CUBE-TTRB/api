import baseController from '@App/controllers/base_controller'
import commentsController from '@App/controllers/comments_controller'
import express from 'express'

const commentsRouter = express.Router()
export default commentsRouter

commentsRouter.get('/', commentsController.index)
commentsRouter.get('/:id', commentsController.show)

commentsRouter.post('/', baseController.tokenCheck)
commentsRouter.post('/', commentsController.create)

commentsRouter.patch('/:id', baseController.tokenCheck)
commentsRouter.patch('/:id', commentsController.update)

commentsRouter.delete('/:id', baseController.tokenCheck)
commentsRouter.delete('/:id', commentsController.destroy)
