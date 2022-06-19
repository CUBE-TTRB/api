import { NextFunction, Request, Response } from 'express'
import { prisma } from '../app'
import Paginator from '../lib/paginator'
import Resource from '../models/resource'
import { Resource as ResourcePrisma, Role, Visibility } from '@prisma/client'
import { PermissionService } from '../services/permissions/permission_service'

class ResourcesController {
  async index (req: Request, res: Response, next: NextFunction) {
    let records : ResourcePrisma[]

    if (!res.locals.user || res.locals.user.perm === Role.USER) {
      records = await prisma.resource.findMany({
        where: {
          OR: [
            { visibility: 'PUBLIC' },
            { visibility: 'PRIVATE', userId: res.locals.user.id },
            { visibility: 'SHARED', userId: res.locals.user.id }
          ]
        }
      })
    } else { // ADMIN OR MODERATOR
      records = await prisma.resource.findMany()
    }

    const paginator = new Paginator(req, records)
    res.locals.result = paginator.result
    res.locals.pagination = paginator.pagination
    res.status(200)
    next()
  }

  async create (req: Request, res: Response, next: NextFunction) {
    const params = Resource.permitParams(req.body.resource)

    const permService = await new PermissionService(res.locals.user, [Role.USER, Role.MODERATOR]).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(403); return next()
    }

    const resource = new Resource({ ...params, userId: res.locals.user.id })
    await resource.save()

    res.status(201)
    res.locals.result = resource.record
    next()
  }

  async show (req: Request, res: Response, next: NextFunction) {
    const record = await prisma.resource.findUnique({
      where: { id: parseInt(req.params.id) }
    })
    if (record.visibility === Visibility.PRIVATE) {
      const permService = await new PermissionService(res.locals.user, [Role.USER, Role.MODERATOR], record.userId).call()
      if (!permService.isAuthorized) {
        res.locals.errors.push(...permService.errors)
        res.status(403); return next()
      }
    }

    res.locals.result = record
    res.status(200)
    next()
  }

  async update (req: Request, res: Response, next: NextFunction) {
    const record = await prisma.resource.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    const permService = await new PermissionService(res.locals.user, [Role.USER, Role.MODERATOR], record.userId).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(403); return next()
    }

    const resource = new Resource(record)
    const params = Resource.permitParams({
      type: record.type,
      ...req.body.resource
    })

    await resource.update(params)

    res.status(200)
    res.locals.result = resource.record
    next()
  }

  async destroy (req: Request, res: Response, next: NextFunction) {
    const record = await prisma.resource.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    const permService = await new PermissionService(res.locals.user, [Role.USER, Role.MODERATOR], record.userId).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(403); return next()
    }

    const resource = new Resource(record)
    await resource.destroy()

    res.status(204)
    next()
  }
}

const resourcesController = new ResourcesController()
export default resourcesController
