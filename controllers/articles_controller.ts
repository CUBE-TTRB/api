import { Request, Response } from 'express'
import { PrismaErrorAdapter } from '../lib/prisma_error_adapter'
import { Article } from '../models/article'
import { ArticleValidator } from '../models/validators/article_validator'

class ArticlesController {
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
      'body',
      'categoryId'
    ]
  }

  // GET /articles
  async index (_req: Request, res: Response) {
    try {
      const articles = await Article.all()
      res.status(200).json(articles)
    } catch (error: any) {
      res.status(500).json({ errors: [new PrismaErrorAdapter(error)] })
    }
  }

  // POST /articles
  async create (req: Request, res: Response) {
    const params = ArticlesController.permitParams(req.body?.article)
    const article = new Article(params)

    const validator = new ArticleValidator(article)
    if (!validator.validate()) {
      res.status(422).json({ errors: validator.errors })
      return
    }

    try {
      await article.save()
      res.status(201).json(article)
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ errors: [new PrismaErrorAdapter(error)] })
    }
  }

  // GET /articles/:id
  async show (req: Request, res: Response) {
    try {
      const article = await Article.findBy({ id: parseInt(req.params.id) })
      article === null ? res.status(404).send() : res.status(200).json(article)
    } catch (error: any) {
      res.status(500).json({ errors: [new PrismaErrorAdapter(error)] })
    }
  }

  // PATCH /articles/:id
  async update (req: Request, res: Response) {
    const article = await Article.findBy({ id: parseInt(req.params.id) })
    if (article === null) {
      res.status(404).send()
      return
    }

    const params = ArticlesController.permitParams(req.body?.article)
    article.setAttributes(params)

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

  // DELETE /articles/:id
  async destroy (req: Request, res: Response) {
    const article = await Article.findBy({ id: parseInt(req.params.id) })

    if (article === null) {
      res.status(404).send()
      return
    }

    try {
      await article.destroy()
      res.status(204).send()
    } catch (error: any) {
      res.status(500).json({ errors: [new PrismaErrorAdapter(error)] })
    }
  }
}

const articlesController = new ArticlesController()
export default articlesController
