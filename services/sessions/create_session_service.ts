import { Request } from 'express'
import { prisma } from '../../app'
import Encrypteur from '../../lib/Encryption/Encryption'
import JwtHandler from '../../lib/Encryption/JwtHandler'
import { PrismaErrorAdapter } from '../../lib/prisma_error_adapter'
import { ApplicationService } from '../application_service'

export class CreateSessionService extends ApplicationService {
  token: string | null
  private _request: Request

  constructor (request: Request) {
    super()
    this.token = ''
    this._request = request
  }

  async call (): Promise<this> {
    // Get the user (and its Authentification)
    const user = await this.findUser()
    if (user === null) return this

    // Ensure Authentification presence
    if (user?.Authentification === null || user?.Authentification === undefined) { // WHY UNDEFINED ? t('-'t)
      this.errors.push('Unauthenticable user')
      return this
    }

    const encryptedReceivedPassword = await new Encrypteur().getPasswordCrypt(
      this._request.body.password, user.Authentification.salt
    )
    if (encryptedReceivedPassword === undefined) { // DUUUUUUH
      this.errors.push('Error caused by f****** undefined')
      return this
    }

    // i dont know how to properly name and exctract this whole process so let it rot in there
    const test = Buffer.from(encryptedReceivedPassword![0].buffer)
    const actual = Buffer.from(user.Authentification.password)
    if (Buffer.compare(test, actual) === 0) {
      const token = await JwtHandler.getToken(user.Authentification.id.toString(), 'admin')
      if (token === '') {
        this.errors.push('Erreur d\'encryption')
        return this
      }
      this.token = token!
    } else {
      this.errors.push('Erreur de mot de passe')
    }
    return this
  }

  private async findUser () {
    let user
    try {
      user = await prisma.user.findUnique({
        where: {
          email: this._request.body.email
        },
        include: {
          Authentification: true
        }
      })
    } catch (error: any) {
      this.errors.push(new PrismaErrorAdapter(error).message)
    }

    return user
  }
}
