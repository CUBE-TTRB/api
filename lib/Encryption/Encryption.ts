// Import module into your application
import * as crypto from 'crypto'

type PromiseResolve<T> = (value?: T | PromiseLike<T>) => void;
type PromiseReject = (error?: any) => void;
type PasswordCrypt = [passw: Uint8Array, salt: Uint8Array];

class Encrypteur {
private _algorithm : string = 'sha512';
private key : string|undefined = process.env.JWT_SECRET;

constructor () {
  if (this.key === undefined) {
    throw Error
  }
}

private _getHash () : Promise<Uint8Array | undefined> {
  return new Promise((resolve: PromiseResolve<Uint8Array>, reject: PromiseReject): void => {
    crypto.randomFill(new Uint8Array(16), (err, iv) => {
      if (err) reject(err)
      resolve(iv)
    })
  })
};

async getPasswordCrypt (pwd : string, dbsalt : Uint8Array = new Uint8Array(0)) : Promise<PasswordCrypt | undefined> {
  let salt : Uint8Array|undefined
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

async toHmac512 (obj : string) : Promise<string | undefined> {
  if (this.key) {
    return crypto.createHmac('sha512', this.key)
      .update(obj)
      .digest('hex')
  } else {
    return undefined
  }
}

getKey () : string|undefined {
  return this.key
}
}

export default Encrypteur
