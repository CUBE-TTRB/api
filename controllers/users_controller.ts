import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import JwtHandler from '../lib/Encryption/JwtHandler'
import { PrismaErrorAdapter } from '../lib/prisma_error_adapter'
import SendMailService from '../services/mail/send_mail_auth'
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
    const serviceAuth = await (new CreateAuthService(user, req.body.auth.password)).call()
    if (serviceAuth.hasErrors()) {
      res.status(500)
      res.locals.errors.concat(serviceAuth.errors)
      try {
        await prisma.user.delete({ where: { id: user.id } })
      } catch (error: any) {
        console.log(error)
        res.locals.errors.push(new PrismaErrorAdapter(error))
      }
      next(); return
    }
    const jwt = await JwtHandler.getToken(user.id.toString(), 'none', 'confirm')
    const serviceMailAuth = new SendMailService(req.body.user.email, jwt, user.id.toString())
    await serviceMailAuth.call()
    if (serviceMailAuth.hasErrors()) {
      res.locals.errors.concat(serviceAuth.errors)
      res.status(500)
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

  async confirm (req: Request, res: Response, next : NextFunction) {
    let verifyToken : Promise<Boolean>
    let userId : string
    console.log(req.params.token)
    try {
      verifyToken = JwtHandler.verifyToken(req.params.token)
      if (!verifyToken) {
        res.locals.errors.push('Token expiré')
        next(); return
      }
      let payload : string
      try {
        payload = await JwtHandler.getJwtPayload(req.params.token)
      } catch (error : any) {
        res.locals.errors.push(error)
        next(); return
      }
      userId = JSON.parse(payload).id
    } catch (error : any) {
      res.locals.errors.push(error)
      next(); return
    }

    try {
      const user = await prisma.user.update({
        where: { id: Number.parseInt(userId) },
        data: { confirmedAt: new Date(Date.now()) }
      })
      res.status(200)
      res.locals.result = user
    } catch (error : any) {
      console.log(error)
      res.status(500)
      res.locals.errors.push(new PrismaErrorAdapter(error))
    }
    next()
  }
}

const usersController = new UsersController()
export default usersController
