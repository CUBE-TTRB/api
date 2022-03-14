import Encrypteur from './Encryption'

export class JwtProducer {
    private _encrypteur : Encrypteur;

    constructor () {
      this._encrypteur = new Encrypteur()
    }

    async getToken (userID : string, permission : string) : Promise<string> {
      const header = this.getHeader()
      const payload = this.getPayload(userID, permission)
      const signature = await this.getSignature(header, payload)
      return header + '.' +
      payload + '.' +
      signature
    }

    async refreshToken (ancienToken : string) : Promise<string> {
      let payload = this._encrypteur.decode64(ancienToken.split('.')[1])
      const payloadJSON = JSON.parse(payload)
      payloadJSON.exp = Date.now() + (60000 * 10)
      payload = this._encrypteur.toBase64(JSON.stringify(payloadJSON))

      const header = this.getHeader()
      const signature = await this.getSignature(header, payload)
      return header + '.' +
      payload + '.' +
      signature
    }

    getHeader () : string {
      return this._encrypteur.toBase64(
        JSON.stringify(
          {
            alg: 'SHA512',
            typ: 'JWT'
          }
        )
      )
    }

    getPayload (userId : string, permission : string) : string {
      return this._encrypteur.toBase64(
        JSON.stringify(
          {
            id: userId,
            perm: permission,
            exp: Date.now() + (60000 * 168)// date d'expiration, ici 10 minutes
          }
        )
      )
    }

    async getSignature (header : string, payload : string) : Promise<string | Error> {
      return this._encrypteur.toHmac512(
        header + '.' + payload
      )
    }
}

export default JwtProducer
