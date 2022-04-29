import { ApplicationService } from '../application_service'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import config from '../../config/config'

export class GetPresignedUrlService extends ApplicationService {
  private client: S3Client
  private command: GetObjectCommand
  url: string | null = null

  constructor (objectKey: string) {
    super()

    this.client = new S3Client({
      endpoint: config.s3Endpoint,
      region: config.s3Region,
      credentials: {
        accessKeyId: config.s3AccessKey,
        secretAccessKey: config.s3SecretKey
      }
    })
    this.command = new GetObjectCommand({
      Bucket: config.s3Bucket,
      Key: objectKey
    })
  }

  async call () {
    try {
      this.url = await getSignedUrl(this.client, this.command)
    } catch (error: any) {
      this.errors.push(error)
    }
    return this
  }
}
