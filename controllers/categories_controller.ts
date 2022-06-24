import { Request, Response, NextFunction } from 'express'
import { prisma } from '../app'

class CategoriesController {
  async index (req: Request, res: Response, next: NextFunction) {
    const records = await prisma.category.findMany()
    res.locals.result = records
    res.status(200)
    return next()
  }
}

export default new CategoriesController()
