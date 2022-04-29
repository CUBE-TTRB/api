import { ApplicationService } from '../application_service'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import config from '../../config/config'

export class PutObjectService extends ApplicationService {
  private client: S3Client
  private command: PutObjectCommand

  // Example usage:
  // new PutObjectService('test.png', 'image/png', Buffer.from(base64content, 'base64'))
  constructor (key: string, mime: string, data: Buffer) {
    super()

    this.client = new S3Client({
      endpoint: config.s3Endpoint,
      region: config.s3Region,
      credentials: {
        accessKeyId: config.s3AccessKey,
        secretAccessKey: config.s3SecretKey
      }
    })
    this.command = new PutObjectCommand({
      Key: key,
      Body: data,
      ContentType: mime,
      Bucket: config.s3Bucket
    })
  }

  async call () {
    try {
      await this.client.send(this.command)
    } catch (error: any) {
      this.errors.push(error)
    }
    return this
  }
}
