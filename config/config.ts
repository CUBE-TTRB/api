import 'dotenv/config'

class Config {
  jwtSecret : string
  confirm : boolean
  constructor () {
    this.jwtSecret = process.env.JWT_SECRET || ''
    if ('CONFIRM' in process.env && process.env.CONFIRM !== undefined && process.env.CONFIRM === '1') {
      this.confirm = true
    } else {
      this.confirm = false
    };
  }

  sanitize () : this {
    if (this.jwtSecret === '') {
      throw Error('Missing JWT_SECRET in env')
    }
    return this
  }
}

export default Object.freeze(new Config().sanitize())
