import 'dotenv/config'

class Config {
  jwtSecret : string
  constructor () {
    this.jwtSecret = process.env.JWT_SECRET || ''
  }

  sanitize () : this {
    if (this.jwtSecret === '') {
      throw Error('Missing JWT_SECRET in env')
    }
    return this
  }
}

export default Object.freeze(new Config().sanitize())
