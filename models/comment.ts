
import { prisma } from '../app'
import ApplicationModel, { Model } from './application_model'
import { CommentValidator } from './validators/comment_validator'

export default class Resource extends ApplicationModel implements Model {
  static permitParams (rawParams: any) {
    if (rawParams === null || rawParams === undefined) return {}

    const permittedParams = ['text', 'resourceId', 'parentCommentId']

    return Object.fromEntries(Object.entries(rawParams).filter(([key, _]) => {
      return permittedParams.includes(key)
    }))
  }

  constructor (initiator: any) {
    super()
    this.prismaModelClient = prisma.comment
    this.validator = new CommentValidator(this)

    this.record = {
      id: initiator?.id,
      userId: initiator?.userId,
      resourceId: initiator?.resourceId,
      parentCommentId: initiator?.parentCommentId,
      text: initiator?.text,
      createdAt: initiator?.date,
      updatedAt: initiator?.date
    }
  }

  get userId (): number {
    return this.record.userId
  }

  set userId (value: number) {
    this.record.userId = value
  }

  get resourceId (): number {
    return this.record.resourceId
  }

  set resourceId (value: number) {
    this.record.resourceId = value
  }

  get parentCommentId (): number {
    return this.record.parentCommentId
  }

  set parentCommentId (value: number) {
    this.record.parentCommentId = value
  }

  get text (): string {
    return this.record.text
  }

  set text (value: string) {
    this.record.text = value
  }

  async save () {
    console.log(this.record)
    return super.save()
  }
}
