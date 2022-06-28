import { prisma } from '../app'
import { NextFunction, Request, Response } from 'express'
import JwtHandler from '../lib/Encryption/JwtHandler'
import SendMailService from '../services/mail/send_mail_auth'
import { CreateAuthService } from '../services/users/create_auth_service'
import config from '../config/config'
import User from '../models/user'
import { filterProperties } from '../lib/object_helpers'
import { PermissionService } from '../services/permissions/permission_service'
import { Role } from '@prisma/client'

class UsersController {
  public static permitParams (rawParams: any): any {
    return filterProperties(rawParams, [
      'name', 'lastName', 'email', 'backgroundImage', 'bornedAt', 'profilePicture'
    ])
  }

  async create (req: Request, res: Response, next: NextFunction) {
    const user = new User(UsersController.permitParams(req.body?.user))
    await user.save()
    res.locals.result = user.record

    const serviceAuth = new CreateAuthService(user, req.body?.auth?.password)
    await serviceAuth.call()
    if (serviceAuth.hasErrors()) {
      res.status(500)
      res.locals.errors.push(...serviceAuth.errors)
      await prisma.user.delete({ where: { id: user.id } })
      return next()
    }

    res.status(201)
    if (!config.confirmNewUsers) return next()

    const jwt = await JwtHandler.getToken(user.id.toString(), 'none', 'confirm')
    const serviceMailAuth = new SendMailService(req.body.user.email, jwt, user.id.toString())
    await serviceMailAuth.call()
    if (serviceMailAuth.hasErrors()) {
      res.locals.errors.push(...serviceAuth.errors)
      res.status(500)
      await prisma.user.delete({ where: { id: user.id } })
    }
    next()
  }

  async show (req: Request, res: Response, next: NextFunction) {
    const record = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) }
    })
    res.locals.result = record
    res.status(200)
    next()
  }

  async update (req: Request, res: Response, next: NextFunction) {
    const record = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    const permService = await new PermissionService(res.locals.user, [Role.USER], record.id).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(403); return next()
    }

    const user = new User(record)
    const params = UsersController.permitParams({ ...req.body.user })

    await user.update(params)

    res.status(200)
    res.locals.result = user.record
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

    await prisma.user.update({
      where: { id: Number.parseInt(userId) },
      data: { confirmedAt: new Date(Date.now()) }
    })
    res.status(200).send('<p>User confirmed!</p>')
  }

  async setCurrentUser (req: Request, res: Response, next: NextFunction) {
    if (!req.body?.token) return next()

    const payload = JSON.parse(await JwtHandler.getJwtPayload(req.body.token))
    res.locals.user = payload.id ? { id: parseInt(payload.id), role: payload.perm } : null
    next()
  }
}

const usersController = new UsersController()
export default usersController
