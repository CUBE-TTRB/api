import { Role } from '@prisma/client'
import { ApplicationService } from '../application_service'

export class PermissionService extends ApplicationService {
  isAuthorized : boolean = false
  private _user: any
  private _requiredRoles : Role[]
  private _requiredUserId : number | null

  constructor (user: any, requiredRoles: Role[] = [Role.USER], requiredUserId: number | null = null) {
    super()
    this._user = user
    this._requiredRoles = requiredRoles
    this._requiredUserId = requiredUserId
  }

  async call (): Promise<this> {
    if (this._user === null || this._user === undefined || !this.authorize()) {
      this.errors.push('Forbidden')
    } else {
      this.isAuthorized = true
    }
    return this
  }

  private authorize (): boolean {
    return (this._user.role === Role.ADMIN) ||
      (this._requiredRoles.includes(this._user.role) && (
        (this._requiredUserId === null) || this._requiredUserId === this._user.id
      ))
  }
}
