import { prisma } from '../app'
import { NextFunction, Request, Response } from 'express'
import JwtHandler from '../lib/Encryption/JwtHandler'
import SendMailService from '../services/mail/send_mail_auth'
import { CreateAuthService } from '../services/users/create_auth_service'
import config from '../config/config'

class UsersController {
  async create (req: Request, res: Response, next: NextFunction) {
    const user = await prisma.user.create({
      data: {
        email: req.body.user.email,
        name: req.body.user.name,
        createdAt: new Date()
      }
    })
    res.locals.result = user

    const serviceAuth = await (new CreateAuthService(user, req.body.auth.password)).call()
    if (serviceAuth.hasErrors()) {
      res.status(500)
      res.locals.errors.push(...serviceAuth.errors)
      await prisma.user.delete({ where: { id: user.id } })
      return next()
    }

    if (!config.confirmNewUsers) return next()

    const jwt = await JwtHandler.getToken(user.id.toString(), 'none', 'confirm')
    const serviceMailAuth = new SendMailService(req.body.user.email, jwt, user.id.toString())
    await serviceMailAuth.call()
    if (serviceMailAuth.hasErrors()) {
      res.locals.errors.push(...serviceAuth.errors)
      res.status(500)
      await prisma.user.delete({ where: { id: user.id } })
      return next()
    }
    res.status(201)
    next()
  }

  async confirm (req: Request, res: Response, next : NextFunction) {
    let verifyToken : Promise<Boolean>
    let userId : string
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

    const user = await prisma.user.update({
      where: { id: Number.parseInt(userId) },
      data: { confirmedAt: new Date(Date.now()) }
    })
    res.status(200)
    res.locals.result = user
    next()
  }

  async setCurrentUser (req: Request, res: Response, next: NextFunction) {
    if (!req.body.token) return next()

    const payload = JSON.parse(await JwtHandler.getJwtPayload(req.body?.token))
    res.locals.user = payload.id ? { id: parseInt(payload.id), role: payload.perm } : null
    next()
  }
}

const usersController = new UsersController()
export default usersController
