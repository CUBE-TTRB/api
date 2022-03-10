import Encrypteur from '../Encryption/Encryption'
import JwtHandler from '../Encryption/JwtHandler'
import IService from './IService'

export default class CreateSessionsService implements IService {
  private _authentification : any
  errors : string[]
  token : string = ''
  private _password : string
  constructor (authentification : any, password : string) {
    this._authentification = authentification
    this.errors = []
    this._password = password
  }

  async call (): Promise<this> {
    const enc = new Encrypteur()
    const resultat = await enc.getPasswordCrypt(this._password, this._authentification.salt)
    if (resultat === undefined) {
      // res.status(500)
      this.errors.push('Authentification error')
      return this
    }
    if (Buffer.compare(Buffer.from(resultat![0].buffer), Buffer.from(this._authentification!.password)) === 0) {
      const token = await JwtHandler.getToken(this._authentification.id.toString(), 'admin')
      // res.status(200)
      if (token === '') {
        this.errors.push('Erreur d\'encryption')
        return this
      }
      console.log(token + '   TOKEN')
      this.token = token!
    } else {
      this.errors.push('Erreur de mot de passe')
    }
    return this
  }
}
