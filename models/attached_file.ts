import { prisma } from '../app'
import { GetPresignedUrlService } from '../services/s3/get_presigned_url_service'
import { PutObjectService } from '../services/s3/put_object_service'
import ApplicationModel, { Model } from './application_model'
import { AttachedFileValidator } from './validators/attached_file_validator'

export default class AttachedFile extends ApplicationModel implements Model {
  constructor (initiator: any) {
    super()
    this.prismaModelClient = prisma.attachedFile
    this.validator = new AttachedFileValidator(this)

    this.record = {
      id: initiator?.id,
      key: initiator?.key,
      contentType: initiator?.contentType,
      resourceId: initiator?.resourceId
    }
  }

  get id (): number {
    return this.record.id
  }

  get resourceId (): number {
    return this.record.resourceId
  }

  set resourceId (value: number) {
    this.record.resourceId = value
  }

  get key (): string {
    return this.record.key
  }

  set key (value: string) {
    this.record.key = value
  }

  get contentType (): string {
    return this.record.contentType
  }

  set contentType (value: string) {
    this.record.contentType = value
  }

  async getPresignedUrl (): Promise<string> {
    const service = await (new GetPresignedUrlService(this.key).call())
    return new Promise((resolve, reject) => {
      if (service.hasErrors()) {
        reject(service.errors)
      }
      resolve(service.url!)
    })
  }

  async uploadAs (data: Buffer): Promise<AttachedFile> {
    const service = new PutObjectService(this.key, this.contentType, data)
    await service.call()
    return new Promise((resolve, reject) => {
      if (service.hasErrors()) {
        reject(service.errors)
      }
      resolve(this)
    })
  }
}
