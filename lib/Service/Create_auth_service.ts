import { prisma } from '../../app'
import Encrypteur from '../Encryption/Encryption'
import { PrismaErrorAdapter } from '../prisma_error_adapter'
import IService from './IService'

export default class CreateAuthService implements IService {
  private _user : any
  errors : string[]
  private _password : string
  constructor (user : any, password : string) {
    this._user = user
    this.errors = []
    this._password = password
  }

  async call (): Promise<this> {
    const enc = new Encrypteur()
    const encrypted = await enc.getPasswordCrypt(this._password)
    if (encrypted === undefined) {
      this.errors.push('Encryption error')
      return this
    }
    try {
      await prisma.authentification.create({
        data: {
          password: Buffer.from(encrypted[0]),
          salt: Buffer.from(encrypted[1]),
          userId: this._user.id
        }
      })
    } catch (error: any) {
      this.errors.push(new PrismaErrorAdapter(error).message)
    }
    return this
  }
}
