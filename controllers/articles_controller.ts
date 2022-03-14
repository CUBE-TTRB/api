// import { NextFunction, Request, Response } from 'express'
// import { PrismaErrorAdapter } from '../lib/prisma_error_adapter'
// import { Article } from '../models/article'
// import { ArticleValidator } from '../models/validators/article_validator'

// class ArticlesController {
//   private static permitParams (initiator: any) {
//     if (initiator === null || initiator === undefined) return {}

//     return Object.fromEntries(Object.entries(initiator).filter(([key, _]) => {
//       return this.permittedParams().includes(key)
//     }))
//   }

//   private static permittedParams (): string[] {
//     return [
//       'visibility',
//       'state',
//       'title',
//       'body',
//       'categoryId'
//     ]
//   }

//   // GET /articles
//   async index (_req: Request, res: Response, next: NextFunction) {
//     try {
//       const articles = await Article.all()
//       res.status(200)
//       res.locals.result = articles
//     } catch (error: any) {
//       res.status(500)
//       res.locals.errors = [new PrismaErrorAdapter(error)]
//     }
//     next()
//   }

//   // POST /articles
//   async create (req: Request, res: Response, next: NextFunction) {
//     const params = ArticlesController.permitParams(req.body?.article)
//     const article = new Article(params)

//     const validator = new ArticleValidator(article)
//     if (!validator.validate()) {
//       res.status(422)
//       res.locals.errors = validator.errors
//       next()
//     }

//     try {
//       await article.save()
//       res.status(201)
//       res.locals.result = article
//     } catch (error: any) {
//       console.log(error)
//       res.status(500)
//       res.locals.errors = [new PrismaErrorAdapter(error)]
//     }
//     next()
//   }

//   // GET /articles/:id
//   async show (req: Request, res: Response, next: NextFunction) {
//     try {
//       const article = await Article.findBy({ id: parseInt(req.params.id) })
//       if (article === null) {
//         res.status(404)
//         res.locals.errors = 'Article inexistant'
//         next()
//       } else {
//         res.status(200)
//         res.locals.result = article
//       }
//     } catch (error: any) {
//       res.status(500)
//       res.locals.errors = [new PrismaErrorAdapter(error)]
//     }
//     next()
//   }

//   // PATCH /articles/:id
//   async update (req: Request, res: Response, next: NextFunction) {
//     const article = await Article.findBy({ id: parseInt(req.params.id) })
//     if (article === null) {
//       res.status(404)
//       res.locals.errors = 'Article introuvable'
//       next()
//     }

//     const params = ArticlesController.permitParams(req.body?.article)
//     article.setAttributes(params)

//     const validator = new ArticleValidator(article)
//     if (!validator.validate()) {
//       res.status(422)
//       res.locals.errors = validator.errors
//       next()
//     }

//     try {
//       await article.save()
//       res.status(200)
//       res.locals.result = article
//     } catch (error: any) {
//       res.status(500)
//       res.locals.errors = [new PrismaErrorAdapter(error)]
//     }
//     next()
//   }

//   // DELETE /articles/:id
//   async destroy (req: Request, res: Response, next: NextFunction) {
//     const article = await Article.findBy({ id: parseInt(req.params.id) })

//     if (article === null) {
//       res.status(404)
//       res.locals.errors = 'Article introuvable'
//       next()
//     }

//     try {
//       await article.destroy()
//       res.status(204)
//       res.locals.result = 'Article supprimé'
//     } catch (error: any) {
//       res.status(500)
//       res.locals.errors = [new PrismaErrorAdapter(error)]
//     }
//   }
// }

// const articlesController = new ArticlesController()
// export default articlesController
