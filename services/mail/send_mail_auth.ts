import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { ApplicationService } from '../application_service'
import JwtHandler from '../../lib/Encryption/JwtHandler'

// mdp sendgrid : cubecube76.99A*A
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
    let lien = 'http://localhost:3000/users/confirm/'
    // create reusable transporter object using the default SMTP transport
    let transporter : nodemailer.Transporter<SMTPTransport.SentMessageInfo>
    try {
      transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'apikey',
          pass: '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'
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
      lien += this._jwtToken
      lien += '?' + this._userId
    } catch (e : any) {
      this.errors.push({
        error: e,
        message: 'erreur lors de la creation du token de validation'
      })
    }

    if (this.errors.length > 0) {
      return this
    }

    try {
    // send mail with defined transport object
      await transporter!.sendMail({
        from: '"Cube CORP 👻" <bastien.chevallier@viacesi.fr>', // sender address
        to: this._mail + ', ' + this._mail, // list of receivers
        subject: 'Confirmation de création de compte ✔', // Subject line
        text: 'Bonjour :D', // plain text body
        html: '<b>CLiquez sur le lien de confirmation : <a href="' + lien + '">lien<a/></b>' // html body
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
