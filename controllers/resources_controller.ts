import { NextFunction, Request, Response } from 'express'
import { prisma } from '../app'
import Paginator from '../lib/paginator'
import Resource from '../models/resource'

class ResourcesController {
  async index (req: Request, res: Response, next: NextFunction) {
    const records = await prisma.resource.findMany()
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
