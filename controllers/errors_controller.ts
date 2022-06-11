import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { PrismaErrorAdapter } from '../lib/prisma_error_adapter'
import { InvalidRecordError } from '../models/validators/predicates'

class ErrorsController {
  recordNotFoundHandler (err: any, _req: any, res: any, next: any) {
    if (err.name !== 'NotFoundError') return next(err)

    res.status(404)
    res.locals.errors.push('Record not found')
    next()
  }

  invalidRecordHandler (err: any, _req: any, res: any, next: any) {
    if (!(err instanceof InvalidRecordError)) return next(err)

    res.status(422)
    res.locals.errors.push(...err.errors)
    next()
  }

  prismaErrorHandler (err: any, _req: any, res: any, next: any) {
    if (!(err instanceof PrismaClientKnownRequestError)) return next(err)

    res.status(500)
    res.locals.errors.push(new PrismaErrorAdapter(err))
    next()
  }

  unauthorisedActionErrorHandler (err: any, _req: any, res: any, next: any) {
    if (!(err instanceof PrismaClientKnownRequestError)) return next(err)

    res.status(401)
    res.locals.errors.push(new PrismaErrorAdapter(err))
    next()
  }

  unknownErrorHandler (err: any, _req: any, res: any, next: any) {
    console.error(err)
    res.status(500)
    res.locals.errors.push(err.message)
    next()
  }
}

const errorsController = new ErrorsController()
export default errorsController
