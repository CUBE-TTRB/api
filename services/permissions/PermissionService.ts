import { Role } from '@prisma/client'
import { Request } from 'express'
import JwtHandler from '../../lib/Encryption/JwtHandler'
import { ApplicationService } from '../application_service'

export class PermissionService extends ApplicationService {
  isAuthorized : Boolean = false
  private _request: Request
  private _roleRequested : Role[]
  private _idRequested : number

  constructor (request: Request, roleReq : Role[] = [Role.USER], idReq : number = -1) {
    super()
    this._request = request
    this._roleRequested = roleReq
    this._idRequested = idReq
  }

  async call (): Promise<this> {
    this.isAuthorized = true

    if (typeof (this._request.body.token) === 'undefined') {
      this.invalidService()
      return Promise.resolve(this)
    }

    const payload = JSON.parse(await JwtHandler.getJwtPayload(this._request.body.token))
    console.log(payload.perm)
    this.isAuthorized = true
    if (payload.perm === Role.ADMIN) {
      return Promise.resolve(this)
    } else if (this._roleRequested.includes(Role.MODERATOR) && payload.perm === Role.MODERATOR) {
      return Promise.resolve(this)
    } else if (this._idRequested !== -1 && payload.userId === this._idRequested) {
      return Promise.resolve(this)
    } else if (this._roleRequested.includes(Role.USER) && this._idRequested === -1 && payload.perm === Role.USER) {
      return Promise.resolve(this)
    }
    this.invalidService()
    return Promise.resolve(this)
  }

  invalidService () {
    this.errors.push('UnautorizedError')
    this.isAuthorized = false
  }
}
