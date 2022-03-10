import Encrypteur from './Encryption'
import JwtProducer from './JwtProducer'
class JwtHandler {
  static async getToken (userID : string, perm : string) : Promise<string | undefined> {
    const jwtProducer = new JwtProducer()
    return jwtProducer.getToken(userID, perm)
  }

  static async verifyToken (obj : string) : Promise<boolean> {
    const jwt = obj.split('.')
    if (obj.length !== 3 && typeof (obj) === typeof ([])) {
      return false
    }
    const jwtProducer = new JwtProducer()
    const hash = await jwtProducer.getSignature(jwt[0], jwt[1])
    if (hash === jwt[2] && this.compareExpirationTime(jwt[1])) {
      return true
    }
    return false
  }

  static compareExpirationTime (payload : string): boolean {
    const encrypteur = new Encrypteur()
    const decodePayload = JSON.parse(encrypteur.decode64(payload))
    if (Number.parseInt(decodePayload.exp) - Date.now() < 0) {
      return false
    } else {
      return true
    }
  }
}

export default JwtHandler
