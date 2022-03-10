import { prisma } from '../../app'
import Encrypteur from '../../lib/Encryption/Encryption'
import { PrismaErrorAdapter } from '../../lib/prisma_error_adapter'
import { ApplicationService } from '../application_service'

export class CreateAuthService extends ApplicationService {
  private _user : any
  private _password : string

  constructor (user : any, password : string) {
    super()
    this._user = user
    this._password = password
  }

  async call (): Promise<this> {
    let encryptedPassword
    try {
      encryptedPassword = await new Encrypteur().getPasswordCrypt(this._password)
    } catch (error) {
      this.errors.push('Encryption error')
      return this
    }

    if (encryptedPassword === undefined) {
      this.errors.push('Encryption error')
      return this
    }

    try {
      await prisma.authentification.create({
        data: {
          password: Buffer.from(encryptedPassword[0]),
          salt: Buffer.from(encryptedPassword[1]),
          userId: this._user.id
        }
      })
    } catch (error: any) {
      this.errors.push(new PrismaErrorAdapter(error).message)
    }
    return this
  }
}
