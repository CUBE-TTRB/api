// Import module into your application
import * as crypto from 'crypto'
import config from '../../config/config'

type PromiseResolve<T> = (value: T | PromiseLike<T>) => void;
type PromiseReject = (error: Error) => void;
type PasswordCrypt = [passw: Uint8Array, salt: Uint8Array];

class Encrypteur {
  private _algorithm : string = 'sha512';
  private key : string = config.jwtSecret;

  async _getHash () : Promise<Uint8Array> {
    let bitArray : Uint8Array = new Uint8Array(16)
    try {
      bitArray = crypto.randomFillSync(bitArray)
    } catch (e: any) {
      return Promise.reject(e)
    }
    return Promise.resolve(bitArray)
  };

  async getPasswordCrypt (pwd : string, dbsalt : Uint8Array = new Uint8Array(0)) : Promise<PasswordCrypt> {
    let salt : Uint8Array
    if (dbsalt.length === 0) { salt = await this._getHash() } else { salt = dbsalt }
    return new Promise((resolve: PromiseResolve<PasswordCrypt>, reject: PromiseReject): void => {
      if (salt !== undefined) {
        crypto.scrypt(pwd, salt, 32, (err, key) => {
          if (err) reject(err)

          const hash = crypto.Hash.from(key)
          const result : PasswordCrypt = [hash.read(), salt!]
          resolve(result)
        })
      } else { reject(new Error('Génération du sel échouée')) }
    })
  }

  toBase64 (obj : string) : string {
    return Buffer.from(obj).toString('base64')// .replace(/[=+/]/g, '_')
  };

  decode64 (obj : string) : string {
    return Buffer.from(obj, 'base64').toString('ascii')
  }

  toHmac512 (obj : string) : Promise<string | Error> {
    try {
      const result = crypto.createHmac('sha512', this.key)
        .update(obj)
        .digest('hex')
      return Promise.resolve(result)
    } catch (e : any) {
      return Promise.reject(new Error(`Erreur Hmac512 ${e}`))
    }
  }

  getKey () : string {
    return this.key
  }
}

export default Encrypteur
