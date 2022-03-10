import { NextFunction, Request, Response } from 'express'
import { PrismaErrorAdapter } from '../lib/prisma_error_adapter'
import { Activity } from '../models/activity'
import { ActivityValidator } from '../models/validators/activity_validator'

class ActivitiesController {
  private static permitParams (initiator: any) {
    if (initiator === null || initiator === undefined) return {}

    return Object.fromEntries(Object.entries(initiator).filter(([key, _]) => {
      return this.permittedParams().includes(key)
    }))
  }

  private static permittedParams (): string[] {
    return [
      'visibility',
      'state',
      'title',
      'date',
      'location',
      'categoryId'
    ]
  }

  // GET /activities
  async index (_req: Request, res: Response, next : NextFunction) {
    try {
      const activities = await Activity.all()
      res.status(200)
      res.locals.result = activities
    } catch (error: any) {
      res.status(500)
      res.locals.errors = [new PrismaErrorAdapter(error)]
    }
    next()
  }

  // POST /activities
  async create (req: Request, res: Response, next : NextFunction) {
    const params = ActivitiesController.permitParams(req.body?.activity)
    const activity = new Activity(params)

    const validator = new ActivityValidator(activity)
    if (!validator.validate()) {
      res.status(422)
      res.locals.errors = validator.errors
      next()
    }

    try {
      await activity.save()
      res.status(201)
      res.locals.result = activity
    } catch (error: any) {
      console.log(error)
      res.status(500)
      res.locals.errors = [new PrismaErrorAdapter(error)]
    }
    next()
  }

  // GET /activities/:id
  async show (req: Request, res: Response, next : NextFunction) {
    try {
      const activity = await Activity.findBy({ id: parseInt(req.params.id) })
      if (activity === null) {
        res.status(404)
        res.locals.errors = { error: 'Activity not found' }
        next()
      } else {
        res.status(200)
        res.locals.result = activity
      }
    } catch (error: any) {
      res.status(500)
      res.locals.errors = [new PrismaErrorAdapter(error)]
    }
    next()
  }

  // PATCH /activities/:id
  async update (req: Request, res: Response, next : NextFunction) {
    const activity = await Activity.findBy({ id: parseInt(req.params.id) })
    if (activity === null) {
      res.status(404)
      res.locals.errors = { error: 'Activity not found' }
      next()
    }

    const params = ActivitiesController.permitParams(req.body?.activity)
    activity.setAttributes(params)

    const validator = new ActivityValidator(activity)
    if (!validator.validate()) {
      res.status(422)
      res.locals.errors = validator.errors
      next()
    }

    try {
      await activity.save()
      res.status(200)
      res.locals.result = activity
    } catch (error: any) {
      res.status(500)
      res.locals.errors = [new PrismaErrorAdapter(error)]
    }
    next()
  }

  // DELETE /activities/:id
  async destroy (req: Request, res: Response, next: NextFunction) {
    const activity = await Activity.findBy({ id: parseInt(req.params.id) })

    if (activity === null) {
      res.status(404)
      res.locals.errors = 'Activité inexistante'
      return
    }

    try {
      await activity.destroy()
      res.status(204)
      res.locals.result = 'Activité supprimée'
    } catch (error: any) {
      res.status(500)
      res.locals.errors = [new PrismaErrorAdapter(error)]
    }
    next()
  }
}

const activitiesController = new ActivitiesController()
export default activitiesController
