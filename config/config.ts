import 'dotenv/config'

class Config {
  // JWT
  jwtSecret : string

  // E-mails
  hostUrl : string
  sendgridUser : string
  sendgridPassword : string
  confirmNewUsers : string | undefined

  // S3
  s3AccessKey : string
  s3SecretKey : string
  s3Endpoint : string
  s3Region : string
  s3Bucket : string

  constructor () {
    this.jwtSecret = process.env.JWT_SECRET || ''
    this.hostUrl = process.env.HOST_URL || ''
    this.sendgridUser = process.env.SENDGRID_USER || ''
    this.sendgridPassword = process.env.SENDGRID_PASSWORD || ''
    this.s3AccessKey = process.env.S3_ACCESS_KEY || ''
    this.s3SecretKey = process.env.S3_SECRET_KEY || ''
    this.s3Endpoint = process.env.S3_ENDPOINT || ''
    this.s3Region = process.env.S3_REGION || ''
    this.s3Bucket = process.env.S3_BUCKET || ''
    this.confirmNewUsers = process.env.CONFIRM_NEW_USERS
  }

  sanitize () : this {
    if (this.jwtSecret === '') throw Error('Missing JWT_SECRET in ENV')
    if (this.hostUrl === '') throw Error('Missing HOST_URL in ENV')
    if (this.sendgridUser === '') throw Error('Missing SENDGRID_USER in ENV')
    if (this.sendgridPassword === '') throw Error('Missing SENDGRID_PASSWORD in ENV')
    if (this.s3AccessKey === '') throw Error('Missing S3_ACCESS_KEY in ENV')
    if (this.s3SecretKey === '') throw Error('Missing S3_SECRET_KEY in ENV')
    if (this.s3Endpoint === '') throw Error('Missing S3_ENDPOINT in ENV')
    if (this.s3Region === '') throw Error('Missing S3_REGION in ENV')
    if (this.s3Bucket === '') throw Error('Missing S3_BUCKET in ENV')
    return this
  }
}

export default Object.freeze(new Config().sanitize())
