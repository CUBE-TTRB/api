import { Resource, Type } from '@prisma/client'
import { prisma } from '../app'
import { AbstractResource } from './abstract_resource'

export class Activity extends AbstractResource implements Partial<Resource> {
  static async findBy (clause: any): Promise<Activity> {
    const record = await prisma.resource.findUnique({ where: clause })
    return new Activity(record)
  }

  static async all (): Promise<Activity[]> {
    const records = await prisma.resource.findMany({
      where: { type: Type.ACTIVITY }
    })
    return records.map(record => new Activity(record))
  }

  constructor (initiator: any) {
    super(initiator)
    this.type = Type.ACTIVITY
  }
}
