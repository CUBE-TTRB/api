import usersController from '../../controllers/users_controller'
import express from 'express'
import baseController from '@App/controllers/base_controller'

const usersRouter = express.Router()
export default usersRouter

usersRouter.post('/', usersController.create)
usersRouter.get('/:id', usersController.show)

usersRouter.patch('/:id', baseController.tokenCheck)
usersRouter.patch('/:id', usersController.update)

usersRouter.get('/confirm/:token', usersController.confirm)
