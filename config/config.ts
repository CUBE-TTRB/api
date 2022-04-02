import 'dotenv/config'

class Config {
  jwtSecret : string
  hostUrl : string
  sendgridUser : string
  sendgridPassword : string
  confirmNewUsers : string | undefined
  constructor () {
    this.jwtSecret = process.env.JWT_SECRET || ''
    this.hostUrl = process.env.HOST_URL || ''
    this.sendgridUser = process.env.SENDGRID_USER || ''
    this.sendgridPassword = process.env.SENDGRID_PASSWORD || ''
    this.confirmNewUsers = process.env.CONFIRM_NEW_USERS
  }

  sanitize () : this {
    if (this.jwtSecret === '') throw Error('Missing JWT_SECRET in env')
    if (this.hostUrl === '') throw Error('Missing HOST_URL in env')
    if (this.sendgridUser === '') throw Error('Missing SENDGRID_USER in env')
    if (this.sendgridPassword === '') throw Error('Missing SENDGRID_PASSWORD in env')
    return this
  }
}

export default Object.freeze(new Config().sanitize())
