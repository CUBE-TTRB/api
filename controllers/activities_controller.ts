import { Request, Response } from 'express'
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
  async index (_req: Request, res: Response) {
    try {
      const activitys = await Activity.all()
      res.status(200).json(activitys)
    } catch (error: any) {
      res.status(500).json({ errors: [new PrismaErrorAdapter(error)] })
    }
  }

  // POST /activities
  async create (req: Request, res: Response) {
    const params = ActivitiesController.permitParams(req.body?.activity)
    const activity = new Activity(params)

    const validator = new ActivityValidator(activity)
    if (!validator.validate()) {
      res.status(422).json({ errors: validator.errors })
      return
    }

    try {
      await activity.save()
      res.status(201).json(activity)
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ errors: [new PrismaErrorAdapter(error)] })
    }
  }

  // GET /activities/:id
  async show (req: Request, res: Response) {
    try {
      const activity = await Activity.findBy({ id: parseInt(req.params.id) })
      activity === null ? res.status(404).send() : res.status(200).json(activity)
    } catch (error: any) {
      res.status(500).json({ errors: [new PrismaErrorAdapter(error)] })
    }
  }

  // PATCH /activities/:id
  async update (req: Request, res: Response) {
    const activity = await Activity.findBy({ id: parseInt(req.params.id) })
    if (activity === null) {
      res.status(404).send()
      return
    }

    const params = ActivitiesController.permitParams(req.body?.activity)
    activity.setAttributes(params)

    const validator = new ActivityValidator(activity)
    if (!validator.validate()) {
      res.status(422).json({ errors: validator.errors })
      return
    }

    try {
      await activity.save()
      res.status(200).json(activity)
    } catch (error: any) {
      res.status(500).json({ errors: [new PrismaErrorAdapter(error)] })
    }
  }

  // DELETE /activities/:id
  async destroy (req: Request, res: Response) {
    const activity = await Activity.findBy({ id: parseInt(req.params.id) })

    if (activity === null) {
      res.status(404).send()
      return
    }

    try {
      await activity.destroy()
      res.status(204).send()
    } catch (error: any) {
      res.status(500).json({ errors: [new PrismaErrorAdapter(error)] })
    }
  }
}

const activitiesController = new ActivitiesController()
export default activitiesController
