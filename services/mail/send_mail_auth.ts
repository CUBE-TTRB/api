import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { ApplicationService } from '../application_service'
import JwtHandler from '../../lib/Encryption/JwtHandler'
import config from '../../config/config'

// async..await is not allowed in global scope, must use a wrapper
export default class SendMailService extends ApplicationService {
  private _mail : string
  private _jwtToken : string
  private _userId : string
  constructor (mail : string, jwtToken : string, userId : string) {
    super()
    this._mail = mail
    this._jwtToken = jwtToken
    this._userId = userId
  }

  async call () : Promise<this> {
    let link = `${config.hostUrl}/users/confirm/`
    // create reusable transporter object using the default SMTP transport
    // todo : make a verify on the connection with the SMTP host at the beginning
    let transporter : nodemailer.Transporter<SMTPTransport.SentMessageInfo>
    try {
      transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpPort === 465, // true for 465, false for other ports
        connectionTimeout: 10000,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPassword
        }
      })
    } catch (e : any) {
      this.errors.push({
        error: e,
        message: 'erreur lors de la creation du transporteur dans le SendMailService'
      })
    }
    try {
      this._jwtToken = await JwtHandler.getToken(this._userId, 'none', 'validMail')
      link += this._jwtToken
      link += '?' + this._userId
    } catch (e : any) {
      this.errors.push({
        error: e,
        message: 'erreur lors de la creation du token de validation'
      })
      return this
    }
    try {
    // send mail with defined transport object
      await transporter!.sendMail({
        from: '"Cube CORP 👻" <noreply@cubecorp.com>', // sender address
        to: this._mail + ', ' + this._mail, // list of receivers
        subject: 'Confirmation de création de compte ✔', // Subject line
        html: 'CLiquez sur le lien de confirmation : <a href="' + link + '">lien</a>' // html body
      })
    } catch (e : any) {
      this.errors.push({
        error: e,
        message: 'erreur lors de l\'envoi du mail dans le SendMailService'
      })
    }
    return this
  }
}
