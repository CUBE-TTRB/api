import { NextFunction, Request, Response } from 'express'
import { CreateSessionService } from '../services/sessions/create_session_service'

class SessionsController {
  async create (req: Request, res: Response, next: NextFunction) {
    const service = new CreateSessionService(req)
    if ((await service.call()).hasErrors()) {
      res.status(403)
      res.locals.errors.push(...service.errors)
      next(); return
    }

    res.status(200)
    res.locals.token = service.token
    next()
  }
}

export default new SessionsController()
