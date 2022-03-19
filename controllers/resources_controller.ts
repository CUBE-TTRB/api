import { NextFunction, Request, Response } from 'express'
import { prisma } from '../app'
import Paginator from '../lib/paginator'
import { PrismaErrorAdapter } from '../lib/prisma_error_adapter'
import Resource from '../models/resource'
import { InvalidRecordError } from '../models/validators/predicates'

class ResourcesController {
  async index (req: Request, res: Response, next: NextFunction) {
    let records
    try {
      records = await prisma.resource.findMany()
    } catch (error: any) {
      res.status(500)
      res.locals.errors.push(new PrismaErrorAdapter(error))
      next(); return
    }

    const paginator = new Paginator(req, records)
    res.locals.result = paginator.result
    res.locals.pagination = paginator.pagination
    console.log(paginator)
    res.status(200)
    next()
  }

  async create (req: Request, res: Response, next: NextFunction) {
    const params = Resource.permitParams(req.body.resource)
    const resource = new Resource(params)

    try {
      await resource.save()
    } catch (error: any) {
      if (error instanceof InvalidRecordError) {
        res.status(422)
        res.locals.errors.push(...resource.errors)
        next(); return
      } else {
        res.status(500)
        res.locals.errors.push(new PrismaErrorAdapter(error))
        next(); return
      }
    }

    res.status(201)
    res.locals.result = resource.record
    next()
  }

  async show (req: Request, res: Response, next: NextFunction) {
    let record

    try {
      record = await prisma.resource.findUnique({
        where: { id: parseInt(req.params.id) }
      })
    } catch (error: any) {
      res.status(500)
      res.locals.errors.push(new PrismaErrorAdapter(error))
      next(); return
    }

    if (record === null) {
      res.status(404)
      next(); return
    }

    res.status(200)
    res.locals.result = record
    next()
  }

  async update (req: Request, res: Response, next: NextFunction) {
    let record

    try {
      record = await prisma.resource.findUnique({
        where: { id: parseInt(req.params.id) }
      })
    } catch (error: any) {
      res.status(500)
      res.locals.errors.push(new PrismaErrorAdapter(error))
      next(); return
    }

    if (record === null) {
      res.status(404)
      next(); return
    }

    const resource = new Resource(record)
    const params = Resource.permitParams({
      type: record.type,
      ...req.body.resource
    })

    try {
      await resource.update(params)
    } catch (error: any) {
      if (error instanceof InvalidRecordError) {
        res.status(422)
        res.locals.errors.push(...resource.errors)
        next(); return
      } else {
        res.status(500)
        res.locals.errors.push(new PrismaErrorAdapter(error))
        next(); return
      }
    }

    res.status(200)
    res.locals.result = resource.record
    next()
  }

  async destroy (req: Request, res: Response, next: NextFunction) {
    let record

    try {
      record = await prisma.resource.findUnique({
        where: { id: parseInt(req.params.id) }
      })
    } catch (error: any) {
      res.status(500)
      res.locals.errors.push(new PrismaErrorAdapter(error))
      next(); return
    }

    if (record === null) {
      res.status(404)
      next(); return
    }

    const resource = new Resource(record)

    try {
      await resource.destroy()
    } catch (error: any) {
      res.status(500)
      res.locals.errors.push(new PrismaErrorAdapter(error))
      next(); return
    }

    res.status(200)
    res.locals.result = null
    next()
  }
}

const resourcesController = new ResourcesController()
export default resourcesController
