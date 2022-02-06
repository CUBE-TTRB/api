import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

class ResourcesController {
  async index (_: Request, res: Response) {
    try {
      const resources = await prisma.resource.findMany()
      res.status(200).json(resources)
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  async create (req: Request, res: Response) {
    // const resource = new Resource(req.body?.resource)
    // try {
    //   prisma.resource.create({ data: resource })
    // } catch (error) {
    //   res.status(201).json(resource)
    // }
  }

  async show (req: Request, res: Response) {
    try {
      const resource = await prisma.resource.findUnique({
        where: { id: parseInt(req.params.id) }
      })
      res.status(200).json(resource)
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  async update (req: Request, res: Response) {
    try {
      const resource = await prisma.resource.update({
        where: { id: parseInt(req.params.id) },
        data: {
          visibility: req.body.visibility,
          category: { connect: { id: req.body.categoryId } }
        }
      })
      res.status(200).json(resource)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error })
    }
  }

  async destroy (req: Request, res: Response) {
    try {
      await prisma.resource.delete({
        where: { id: parseInt(req.params.id) }
      })
      res.status(200).json(null)
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }
}

const resourcesController = new ResourcesController()
export default resourcesController
