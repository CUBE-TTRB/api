import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

class UsersController {
  async index (_req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany()
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  async create (req: Request, res: Response) {
    try {
      const user = await prisma.user.create({ data: req.body.user })
      res.status(201).json(user)
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  async show (req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) }
      })
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  // async update(req: Request, res: Response) {
  //
  // }

  // async destroy(req: Request, res: Response) {
  //
  // }
}

const usersController = new UsersController()
export default usersController
