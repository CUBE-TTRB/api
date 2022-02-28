import { Request, Response } from 'express'
import JwtHandler from '../lib/Encryption/JwtHandler'
import JwtProducer from '../lib/Encryption/JwtProducer'

class BaseController {
  headers (_req: Request, res: Response, next: any) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', '*')
    next()
  }

  async tokenCheck (_req: Request, res: Response, next: any) {
    const token = _req.body.token
    if (token === undefined || token === null) {
      res.status(503).json('Erreur, token manquant')
      return
    }
    if (_req.body.token) {
      if (await JwtHandler.verifyToken(_req.body.token)) {
        // token validé
        const jwt = new JwtProducer()
        const newToken = await jwt.refreshToken(_req.body.token)
        res.locals.token = newToken
        next()
        // next()
      } else {
        // TEST DATE
        // const val = encrypteur.decode64(_req.body.token.split('.')[1])
        // const val2 = JSON.parse(val).exp
        // const val3 = Number.parseInt(val2) - Date.now()

        // TEST TOKEN HASH
        // const jwt = _req.body.token.split('.')
        // const val2 = await jwtProducer.getSignature(jwt[0], jwt[1])
        // const val3 = jwt[2]
        res.status(500).json('Erreur, token invalide ')
      }
    }
  }

  responseHandler (_req: Request, res: Response, next: any) {
    if (res.statusCode >= 200 && res.statusCode <= 400) {
      res.json({ token: res.locals.token, result: res.locals.result })
    } else {
      res.json({ token: res.locals.token, errors: res.locals.errors })
    }
  }
  // recordNotFoundHandler (_req: Request, res: Response, next: any) {
  //   try {
  //     next()
  //   } catch (error) {
  //     res.status(404).send()
  //   }
  // }
}

const baseController = new BaseController()
export default baseController
