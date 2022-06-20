import { NextFunction, Request, Response } from 'express'
import { prisma } from '../app'
import Comment from '../models/comment'
import { PermissionService } from '../services/permissions/permission_service'
import { Role, Visibility } from '@prisma/client'
import Paginator from '../lib/paginator'

class CommentsController {
  // get all index, moderator and admins only
  async index (req: Request, res: Response, next: NextFunction) {
    const permService = await new PermissionService(res.locals.user, [Role.MODERATOR]).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(403); return next()
    }
    const records = await prisma.comment.findMany()
    res.locals.result = records
    const paginator = new Paginator(req, records)
    res.locals.result = paginator.result
    res.locals.pagination = paginator.pagination
    res.status(200)
    next()
  }

  async create (req: Request, res: Response, next: NextFunction) {
    const permService = await new PermissionService(res.locals.user, [Role.USER, Role.MODERATOR]).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(403); return next()
    }

    const params = Comment.permitParams(req.body?.comment)
    const comment = new Comment({ ...params, userId: res.locals.user.id })
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
      const permService = await new PermissionService(res.locals.user, [Role.USER, Role.MODERATOR], requiredRes.userId).call()
      if (!permService.isAuthorized) {
        res.locals.errors.push(...permService.errors)
        res.status(403); next()
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

    const permService = await new PermissionService(res.locals.user, [Role.USER, Role.MODERATOR], record.userId).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(403); return next()
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

    const permService = await new PermissionService(res.locals.user, [Role.USER, Role.MODERATOR], record.userId).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(403); return next()
    }

    const comment = new Comment(record)
    await comment.destroy()

    res.status(204)
    next()
  }
}

const commentsController = new CommentsController()
export default commentsController
