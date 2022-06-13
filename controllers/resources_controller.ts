import { NextFunction, Request, Response } from 'express'
import JwtHandler from '../lib/Encryption/JwtHandler'
import { prisma } from '../app'
import Paginator from '../lib/paginator'
import Resource from '../models/resource'
import { Resource as ResourcePrisma, Role, Visibility } from '@prisma/client'
import { PermissionService } from '../services/permissions/PermissionService'

class ResourcesController {
  async index (req: Request, res: Response, next: NextFunction) {
    let records : ResourcePrisma[]
    if (req.body.token == null) {
      records = await prisma.resource.findMany({
        where: {
          visibility: 'PUBLIC'
        }
      })
      res.locals.unloggedByPass = true
    } else {
      const payload = JSON.parse(await JwtHandler.getJwtPayload(req.body.token))
      if (payload.perm === undefined) {
        records = await prisma.resource.findMany({
          where: {
            visibility: 'PUBLIC'
          }
        })
      } else if (payload.perm === Role.ADMIN || payload.perm === Role.MODERATOR) {
        records = await prisma.resource.findMany()
      } else if (payload.perm === Role.USER) {
        records = await prisma.resource.findMany({
          where: {
            OR: [
              {
                visibility: 'PUBLIC'
              }, {
                visibility: 'PRIVATE',
                userId: parseInt(payload.id)
                // Creer un champ créateur de la ressource 'userId' ?
              }, {
                visibility: 'SHARED'
                // Creer un champ utilisateurs autorisés à lire la ressource 'sharedUsersIds' ?
              }
            ]
          }
        })
      } else {
        records = await prisma.resource.findMany({
          where: {
            visibility: 'PUBLIC'
          }
        })
      }
    }

    const paginator = new Paginator(req, records)
    res.locals.result = paginator.result
    res.locals.pagination = paginator.pagination
    res.status(200)
    next()
  }

  async create (req: Request, res: Response, next: NextFunction) {
    const params = Resource.permitParams(req.body.resource)

    const permService = await new PermissionService(req, [Role.USER, Role.MODERATOR]).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(401); next()
    }

    const resource = new Resource(params)
    const payload = JSON.parse(await JwtHandler.getJwtPayload(req.body.token))
    resource.userId = Number.parseInt(payload.id)
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
      const permService = await new PermissionService(req, [Role.USER, Role.MODERATOR], record.userId).call()
      if (!permService.isAuthorized) {
        res.locals.errors.push(...permService.errors)
        res.status(401); next()
      }
    }

    res.locals.result = record
    res.status(200)
    next()
  }

  async update (req: Request, res: Response, next: NextFunction) {
    const permService = await new PermissionService(req, [Role.USER, Role.MODERATOR], parseInt(req.params.userId)).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(401); next()
    }

    const record = await prisma.resource.findUnique({
      where: { id: parseInt(req.params.id) }
    })

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
    const permService = await new PermissionService(req, [Role.USER, Role.MODERATOR], parseInt(req.params.userId)).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(401); next()
    }

    const record = await prisma.resource.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    const resource = new Resource(record)
    await resource.destroy()

    res.status(204)
    next()
  }
}

const resourcesController = new ResourcesController()
export default resourcesController
