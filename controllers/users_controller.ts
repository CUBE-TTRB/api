import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { PrismaErrorAdapter } from '../lib/prisma_error_adapter'
import CreateAuthService from '../lib/Service/Create_auth_service'
import CreateSessionsService from '../lib/Service/Create_session_service'

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
    try {
      const user = await prisma.user.create({ data: req.body.user })
      res.locals.result = user
      const authService = new CreateAuthService(user, req.body.auth.password)
      await authService.call()
      if (authService.errors.length !== 0) {
        res.status(500)
        res.locals.errors = res.locals.errors.concat(authService.errors)
        await prisma.user.delete({ where: { id: user.id } })
        next()
      } else {
        res.status(201)
      }
    } catch (error: any) {
      res.status(500)
      console.log(error)
      res.locals.errors.push(new PrismaErrorAdapter(error))
    }
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

  async connect (req : Request, res : Response, next : NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: req.body.email }
      })
      if (user === null) {
        res.status(500)
        res.locals.errors.push('Authentification error')
        next()
        return
      }
      const authentification = await prisma.authentification.findUnique({
        where: { userId: user!.id }
      })
      if (authentification === null) {
        res.status(500)
        res.locals.errors.push('Authentification error')
        next()
        return
      }
      const session = new CreateSessionsService(authentification, req.body.password)
      await session.call()
      if (session.errors.length !== 0) {
        res.status(500)
        res.locals.errors = res.locals.errors.concat(session.errors)
        next()
        return
      }
      res.status(200)
      res.locals.token = session.token
    } catch (error) {
      res.status(500)
      res.locals.errors.push(error)
    }
    next()
  }
}

const usersController = new UsersController()
export default usersController
