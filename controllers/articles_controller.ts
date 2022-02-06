import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { Article, ArticleValidator } from '../models/resource'
import { PrismaErrorAdapter } from '../lib/prisma_error_adapter'

const prisma = new PrismaClient()

class ArticlesController {
  async create (req: Request, res: Response) {
    const article = new Article(Article.permitParams(req.body?.article))

    const validator = new ArticleValidator(article)
    if (!validator.validate()) {
      res.status(422).json({ errors: validator.errors })
      return
    }

    try {
      await article.save()
      res.status(201).json(article)
    } catch (error: any) {
      console.error(error)
      res.status(500).json({ errors: [new PrismaErrorAdapter(error)] })
    }
  }

  async update (req: Request, res: Response) {
    const article = Article.findById(req.params.id)
    article.setAttributes(Article.permitParams(req.body?.article))

    const validator = new ArticleValidator(article)
    if (!validator.validate()) {
      res.status(422).json({ errors: validator.errors })
      return
    }

    try {
      await article.save()
      res.status(200).json(article)
    } catch (error: any) {
      res.status(500).json({ errors: [new PrismaErrorAdapter(error)] })
    }
  }
}

const articlesController = new ArticlesController()
export default articlesController
