import categoriesController from '../../controllers/categories_controller'
import express from 'express'

const categoriesRouter = express.Router()
export default categoriesRouter

categoriesRouter.get('/categories', categoriesController.index)
