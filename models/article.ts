import { Resource, Type } from '@prisma/client'
import { prisma } from '../app'
import { AbstractResource } from './abstract_resource'

export class Article extends AbstractResource implements Partial<Resource> {
  static async findBy (clause: any): Promise<Article> {
    const record = await prisma.resource.findUnique({ where: clause })
    return new Article(record)
  }

  static async all (): Promise<Article[]> {
    const records = await prisma.resource.findMany({
      where: { type: Type.ARTICLE }
    })
    return records.map(record => new Article(record))
  }

  constructor (initiator: any) {
    super(initiator)
    this.type = Type.ARTICLE
  }
}
