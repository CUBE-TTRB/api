import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import JwtHandler from '../lib/Encryption/JwtHandler'
import SendMailService from '../services/mail/send_mail_auth'
import { CreateAuthService } from '../services/users/create_auth_service'
import config from '../config/config'
import QuillHelper from '../lib/quill_helper'
import AttachedFile from '../models/attached_file'

const prisma = new PrismaClient()

class UsersController {
  async testDelta (req: Request, res: Response, next: NextFunction) {
    const test = QuillHelper.parseJsonToQuillDeltaObject(req.body.delta)
    console.log(1)
    const firstLoop = new Promise<void>((resolve, reject) => {
      const maxLenght = Object.keys(test.contents).length;
      let count = 0;
      Object.keys(test.contents).forEach(async element => {
        const attechedFile = await new AttachedFile({ key: element, contentType: 'f', resourceId: 1 }).uploadAs(test.contents[element])
        console.log(2)
        await prisma.attachedFile.create({
          data: {
            key: attechedFile.key,
            contentType: attechedFile.contentType,
            resourceId: attechedFile.resourceId
          }
        })
        count++
        if (maxLenght === count) resolve();
      })
    })
    firstLoop.then(() => {
      console.log(5)
      const linksByKey : {[key:string] : string} = {}
      const secondLoop = new Promise<void>((resolve, reject) => {
        const maxLenght = Object.keys(test.contents).length;
        let count = 0;
        Object.keys(test.contents).forEach(async element => {
          // const testS3 = new PutObjectService(element)
          const attachedFile = await prisma.attachedFile.findUnique({
            where: { key: element }
          })
          console.log(6)
          const result = await new AttachedFile(attachedFile).getPresignedUrl()
          linksByKey[element] = result
          console.log(7)


          count++
          if (maxLenght === count) resolve();
        })
        return Promise.resolve()
      })
      console.log(8)

      secondLoop.then(() => {
        const testKey = QuillHelper.replaceKeysByLinks(test.json, linksByKey)
        return res.json((testKey))
      })
    })
  }

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

    const user = await prisma.user.update({
      where: { id: Number.parseInt(userId) },
      data: { confirmedAt: new Date(Date.now()) }
    })
    res.status(200)
    res.locals.result = user
    next()
  }
}

const usersController = new UsersController()
export default usersController
