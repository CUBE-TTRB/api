import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { PrismaErrorAdapter } from '../lib/prisma_error_adapter'
import Encrypteur from '../lib/Encryption/Encryption'
import JwtHandler from '../lib/Encryption/JwtHandler'

const prisma = new PrismaClient()

class UsersController {
  async index (_req: Request, res: Response, next : NextFunction) {
    try {
      const users = await prisma.user.findMany()
      res.status(200)
      res.locals.result = users
      next()
    } catch (error : any) {
      res.status(500)
      res.locals.errors = [new PrismaErrorAdapter(error)]
      next()
    }
  }

  async create (req: Request, res: Response, next : NextFunction) {
    try {
      const user = await prisma.user.create({ data: req.body.user })
      res.status(201)
      res.locals.result = user
      next()
    } catch (error : any) {
      res.status(500)
      res.locals.errors = [new PrismaErrorAdapter(error)]
      next()
    }
  }

  async show (req: Request, res: Response, next : NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) }
      })
      res.status(200)
      res.locals.result = user
      this.createAuth(req, res, next)
    } catch (error) {
      res.status(500)
      res.locals.errors += error
      next()
    }
  }

  // async update(req: Request, res: Response) {
  //
  // }

  // async destroy(req: Request, res: Response) {
  //
  // }

  async createAuth (req : Request, res : Response, next : NextFunction) {
    try {
      const enc = new Encrypteur()
      const encrypted = await enc.getPasswordCrypt(req.body.password)
      let authentification : any
      if (encrypted !== undefined) {
        authentification = await prisma.authentification.create({
          data: {
            password: Buffer.from(encrypted[0]),
            salt: Buffer.from(encrypted[1]),
            userId: req.body.id
          }
        })
      }
      res.status(200).json(authentification)
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  async connect (req : Request, res : Response, next : NextFunction) {
    try {
      const user = await prisma.authentification.findUnique({
        where: { userId: req.body.id }
      })
      if (user === null) {
        return res.status(500).json('error prisma')
      }
      const enc = new Encrypteur()
      const resultat = await enc.getPasswordCrypt(req.body.password, user?.salt)
      if (resultat === undefined) {
        res.status(500).json('error encryption')
      }
      if (Buffer.compare(Buffer.from(resultat![0].buffer), Buffer.from(user!.password)) === 0) {
        const token = await JwtHandler.getToken(user?.id.toString(), 'admin')
        res.status(200)
        res.locals.token = token
        next()
      } else {
        res.status(200).json('Erreur de mot de passe')
      }
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }

  async testtoken (req : Request, res : Response, next : NextFunction) {
    res.status(500)
    try {
      await prisma.user.findUnique(
        { where: { id: req.body.t } }
      )
    } catch (error : any) {
      res.locals.errors = new PrismaErrorAdapter(error)
    }
    next()
  }
}

const usersController = new UsersController()
export default usersController
