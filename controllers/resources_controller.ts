import { NextFunction, Request, Response } from 'express'
import JwtHandler from '../lib/Encryption/JwtHandler'
import { prisma } from '../app'
import Paginator from '../lib/paginator'
import Resource from '../models/resource'
import { Resource as ResourcePrisma } from '@prisma/client'

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

      if (payload.perm === 'admin') { // il faut créer un répertoire pour les permission, enum prisma ?
        records = await prisma.resource.findMany()
      } else if (payload.perm === 'user') {
        records = await prisma.resource.findMany({
          where: {
            AND: [
              {
                visibility: 'PUBLIC'
              }, {
                visibility: 'PRIVATE'
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
    // à créer ici : ajouter les resources shared ou private à l'utilisateur

    const paginator = new Paginator(req, records)
    res.locals.result = paginator.result
    res.locals.pagination = paginator.pagination
    res.status(200)
    next()
  }

  async create (req: Request, res: Response, next: NextFunction) {
    const params = Resource.permitParams(req.body.resource)
    const resource = new Resource(params)
    await resource.save()

    res.status(201)
    res.locals.result = resource.record
    next()
  }

  async show (req: Request, res: Response, next: NextFunction) {
    const record = await prisma.resource.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    res.locals.result = record
    res.status(200)
    next()
  }

  async update (req: Request, res: Response, next: NextFunction) {
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
