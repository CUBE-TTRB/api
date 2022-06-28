import usersController from '../../controllers/users_controller'
import express from 'express'

const usersRouter = express.Router()
export default usersRouter

usersRouter.post('/', usersController.create)
usersRouter.get('/confirm/:token', usersController.confirm)
