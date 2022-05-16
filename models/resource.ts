import { State, Type, Visibility } from '@prisma/client'
import { prisma } from '../app'
import ApplicationModel, { Model } from './application_model'
import { ResourceValidator } from './validators/resource_validator'

export default class Resource extends ApplicationModel implements Model {
  static permitParams (rawParams: any) {
    if (rawParams === null || rawParams === undefined) return {}

    const permittedParams = ['type', 'visibility', 'categoryId']
    switch (rawParams.type) {
      case Type.ACTIVITY:
        permittedParams.push('title', 'date', 'location')
        break
      case Type.ARTICLE:
        permittedParams.push('title', 'body')
        break
    }

    return Object.fromEntries(Object.entries(rawParams).filter(([key, _]) => {
      return permittedParams.includes(key)
    }))
  }

  constructor (initiator: any) {
    super()
    this.prismaModelClient = prisma.resource
    this.validator = new ResourceValidator(this)

    this.record = {
      id: initiator?.id,
      visibility: initiator?.visibility,
      state: initiator?.state ?? State.SUBMITTED,
      type: initiator?.type,
      categoryId: initiator?.categoryId,
      title: initiator?.title,
      body: initiator?.body,
      date: new Date(initiator?.date),
      location: initiator?.location,
      createdAt: initiator?.date,
      updateAt: initiator?.date
    }
  }

  get visibility (): Visibility {
    return this.record.visibility
  }

  set visibility (value: Visibility) {
    this.record.visibility = value
  }

  get state (): State {
    return this.record.state
  }

  set state (value: State) {
    this.record.state = value
  }

  get type (): Type {
    return this.record.type
  }

  set type (value: Type) {
    this.record.type = value
  }

  get categoryId (): number {
    return this.record.categoryId
  }

  set categoryId (value: number) {
    this.record.categoryId = value
  }

  get title (): string {
    return this.record.title
  }

  set title (value: string) {
    this.record.title = value
  }

  get body (): string {
    return this.record.body
  }

  set body (value: string) {
    this.record.body = value
  }

  get date (): Date {
    return this.record.date
  }

  set date (value: Date) {
    this.record.date = value
  }

  get location (): any {
    return this.record.location
  }

  set location (value: any) {
    this.record.lcoation = value
  }

  async save () {
    // Ensure resources always have a category
    await this.setDefaultCategory()
    return super.save()
  }

  private async setDefaultCategory () {
    // Skip if there is already a category associated with this resource
    if (this.categoryId) return

    const category = await prisma.category.findFirst({
      where: { default: true }
    })
    this.categoryId = category!.id
  }
}
