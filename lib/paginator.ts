import { Request } from 'express'

export type Pagination = {
  page: number,
  pageSize: number,
  pageCount: number,
  total: number
}

export default class Paginator {
  private page: number
  private pageSize: number
  private collection: any[]

  static DEFAULT_PAGE = 1
  static DEFAULT_PAGE_SIZE = 25

  constructor (request: Request, collection: any[]) {
    this.collection = collection
    this.page = parseInt(request.query.page?.toString()!) || Paginator.DEFAULT_PAGE
    this.pageSize = parseInt(request.query.pageSize?.toString()!) || Paginator.DEFAULT_PAGE_SIZE
  }

  get result (): any[] {
    const skip = this.pageSize * (this.page - 1)
    return this.collection.slice(skip, skip + this.pageSize)
  }

  get pagination (): Pagination {
    return {
      page: this.page,
      pageSize: this.pageSize,
      pageCount: Math.ceil(this.collection.length / this.pageSize),
      total: this.collection.length
    }
  }
}
