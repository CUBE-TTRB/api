import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { PrismaErrorAdapter } from '../lib/prisma_error_adapter'
import { CreateAuthService } from '../services/users/create_auth_service'

const prisma = new PrismaClient()

class UsersController {
  async index (_req: Request, res: Response, next : NextFunction) {
    try {
      const users = await prisma.user.findMany()
      res.status(200)
      res.locals.result = users
      next()
    } catch (error : any) {
      res.status(500)
      res.locals.errors.push(new PrismaErrorAdapter(error))
      next()
    }
  }

  async create (req: Request, res: Response, next: NextFunction) {
    let user
    try {
      user = await prisma.user.create({
        data: {
          email: req.body.user.email,
          name: req.body.user.name
        }
      })
      res.locals.result = user
    } catch (error: any) {
      console.log(error)
      res.status(500)
      res.locals.errors.push(new PrismaErrorAdapter(error))
      next(); return
    }

    const service = await (new CreateAuthService(user, req.body.auth.password)).call()
    if (service.hasErrors()) {
      res.status(500)
      res.locals.errors.push(...service.errors)
      try {
        await prisma.user.delete({ where: { id: user.id } })
      } catch (error: any) {
        console.log(error)
        res.locals.errors.push(new PrismaErrorAdapter(error))
      }
      next(); return
    }

    res.status(201)
    next()
  }

  async show (req: Request, res: Response, next : NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) }
      })
      res.status(200)
      res.locals.result = user
    } catch (error) {
      res.status(500)
      res.locals.errors.push(error)
    }
    next()
  }
}

const usersController = new UsersController()
export default usersController
