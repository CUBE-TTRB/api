import { Request, Response } from 'express'

class BaseController {
  headers (_req: Request, res: Response, next: any) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', '*')
    next()
  }
}

const baseController = new BaseController()
export default baseController
