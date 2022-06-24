import { InvalidRecordError } from './validators/predicates'

export interface Model {
  record: any
  errors: any[]
  isValid(): Boolean
  save(): Promise<Boolean>
}

export default abstract class ApplicationModel implements Model {
  record: any
  errors: any[] = []
  protected prismaModelClient: any
  protected validator: any

  get id (): number {
    return this.record.id
  }

  isValid () {
    this.validator.validate()
    return this.errors.length === 0
  }

  setAttributes (attributes: any) {
    const keys = Object.entries(this.record).map(keyVal => keyVal[0])
    for (const key in attributes) {
      if (keys.includes(key)) {
        this.record[key] = attributes[key]
      }
    }
  }

  async save () {
    if (!this.isValid()) {
      throw new InvalidRecordError(this.errors)
    }

    if (this.record.id === undefined) {
      this.record.createdAt = new Date()
      this.record.updatedAt = new Date()
      return await this.prismaModelClient.create({ data: this.record })
    } else {
      this.record.updatedAt = new Date()
      return await this.prismaModelClient.update({
        where: { id: this.record.id },
        data: this.record
      })
    }
  }

  async update (attributes: any) {
    this.setAttributes(attributes)
    return await this.save()
  }

  async destroy () {
    return await this.prismaModelClient.delete({
      where: { id: this.record.id }
    })
  }
}
