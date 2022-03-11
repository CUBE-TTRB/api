import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { ApplicationService } from '../application_service'

// mdp sendgrid : cubecube76.99A*A
// async..await is not allowed in global scope, must use a wrapper
export default class SendMailService extends ApplicationService {
  private _mail : string
  private _jwtToken : string
  constructor (mail : string, jwtToken : string) {
    super()
    this._mail = mail
    this._jwtToken = jwtToken
  }

  async call () : Promise<this> {
    const lien = ''
    // create reusable transporter object using the default SMTP transport
    let transporter : nodemailer.Transporter<SMTPTransport.SentMessageInfo> = nodemailer.createTransport()
    try {
      transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'apikey',
          pass: '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' // generated ethereal password
        }
      })
    } catch (e : any) {
      this.errors.push({
        error: e,
        message: 'erreur lors de la creation du transporteur dans le SendMailService'
      })
    }

    try {
    // send mail with defined transport object
      await transporter.sendMail({
        from: '"Cube CORP 👻" <bastien.chevallier@viacesi.fr>', // sender address
        to: this._mail + ', ' + this._mail, // list of receivers
        subject: 'Confirmation de création de compte ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>CLiquez sur le lien de confirmation : ' + lien + '</b>' // html body
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
