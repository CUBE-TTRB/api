import 'dotenv/config'

class Config {
  // JWT
  jwtSecret : string

  // E-mails
  hostUrl : string
  smtpPort: number
  smtpHost : string
  smtpUser : string
  smtpPassword : string
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
    this.smtpHost = process.env.SMTP_HOST || ''
    this.smtpPort = parseInt(process.env.SMTP_PORT || '') || 0
    this.smtpUser = process.env.SMTP_USER || ''
    this.smtpPassword = process.env.SMTP_PASS || ''
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
    if (this.smtpHost === '') throw Error('Missing SMTP_HOST in ENV')
    if (this.smtpPort === 0) throw Error('Missing SMTP_PORT in ENV')
    // if (this.smtpUser === '') throw Error('Missing SMTP_USER in ENV')
    // if (this.smtpPassword === '') throw Error('Missing SMTP_PASS in ENV')
    if (this.s3AccessKey === '') throw Error('Missing S3_ACCESS_KEY in ENV')
    if (this.s3SecretKey === '') throw Error('Missing S3_SECRET_KEY in ENV')
    if (this.s3Endpoint === '') throw Error('Missing S3_ENDPOINT in ENV')
    if (this.s3Region === '') throw Error('Missing S3_REGION in ENV')
    if (this.s3Bucket === '') throw Error('Missing S3_BUCKET in ENV')
    return this
  }
}

const config = new Config()
if (process.env.NODE_ENV === 'production') config.sanitize()
Object.freeze(config)
export default config
