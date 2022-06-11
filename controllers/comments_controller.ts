import { NextFunction, Request, Response } from 'express'
import JwtHandler from '../lib/Encryption/JwtHandler'
import { prisma } from '../app'
import Comment from '../models/comment'
import { PermissionService } from '../services/permissions/PermissionService'
import { Role, Visibility } from '@prisma/client'
import Paginator from '../lib/paginator'

class CommentController {
  // get all index, moderator and admins only
  async index (req: Request, res: Response, next: NextFunction) {
    const permService = await new PermissionService(req, [Role.MODERATOR]).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(401); next()
    }
    const records = await prisma.comment.findMany()
    console.log(records)
    res.locals.result = records
    const paginator = new Paginator(req, records)
    res.locals.result = paginator.result
    res.locals.pagination = paginator.pagination
    res.status(200)
    next()
    res.status(200)
    next()
  }

  async create (req: Request, res: Response, next: NextFunction) {
    const permService = await new PermissionService(req, [Role.USER, Role.MODERATOR]).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(401); next()
    }

    const params = Comment.permitParams(req.body.comment)
    const payload = JSON.parse(await JwtHandler.getJwtPayload(req.body.token))
    params.userId = parseInt(payload.id)
    console.log(params)
    const comment = new Comment(params)
    await comment.save()

    res.status(201)
    res.locals.result = comment.record
    next()
  }

  async show (req: Request, res: Response, next: NextFunction) {
    const requiredRes = await prisma.resource.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    })
    if (requiredRes.visibility === Visibility.PRIVATE) {
      const permService = await new PermissionService(req, [Role.USER, Role.MODERATOR], requiredRes.userId).call()
      if (!permService.isAuthorized) {
        res.locals.errors.push(...permService.errors)
        res.status(401); next()
      }
    }

    const record = await prisma.comment.findMany({
      where: { id: parseInt(req.params.id) }
    })

    res.locals.result = record
    res.status(200)
    next()
  }

  async update (req: Request, res: Response, next: NextFunction) {
    const record = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    const permService = await new PermissionService(req, [Role.USER, Role.MODERATOR], record.userId).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(401); next()
    }

    const comment = new Comment(record)
    const params = Comment.permitParams({
      ...req.body.comment
    })

    await comment.update(params)

    res.status(200)
    res.locals.result = comment.record
    next()
  }

  async destroy (req: Request, res: Response, next: NextFunction) {
    const record = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    const permService = await new PermissionService(req, [Role.USER, Role.MODERATOR], record.userId).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(401); next()
    }

    const comment = new Comment(record)
    await comment.destroy()

    res.status(204)
    next()
  }
}

const commentController = new CommentController()
export default commentController
