import { NextFunction, Request, Response } from 'express'
import { prisma } from '../app'
import Paginator from '../lib/paginator'
import Resource from '../models/resource'
import { Prisma, Resource as ResourcePrisma, Role, Visibility } from '@prisma/client'
import { PermissionService } from '../services/permissions/permission_service'
import QuillHelper from '../lib/quill_helper'
import AttachedFile from '../models/attached_file'

class ResourcesController {
  async index (req: Request, res: Response, next: NextFunction) {
    let records : ResourcePrisma[]

    if (!res.locals.user || res.locals.user?.perm === Role.USER) {
      records = await prisma.resource.findMany({
        where: {
          OR: [
            { visibility: 'PUBLIC' },
            { visibility: 'PRIVATE', userId: res.locals.user?.id },
            { visibility: 'SHARED', userId: res.locals.user?.id }
          ]
        }
      })
    } else { // ADMIN OR MODERATOR
      records = await prisma.resource.findMany()
    }

    const paginator = new Paginator(req, records)
    res.locals.result = paginator.result
    res.locals.pagination = paginator.pagination
    res.status(200)
    next()
  }

  async create (req: Request, res: Response, next: NextFunction) {
    const params = Resource.permitParams(req.body.resource)

    const permService = await new PermissionService(res.locals.user, [Role.USER, Role.MODERATOR]).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(403); return next()
    }

    const quillDeltaObject = QuillHelper.parseJsonToQuillDeltaObject(req.body.resource.body)
    const resource = await new Resource({ ...params, userId: res.locals.user?.id, body: quillDeltaObject.json }).save()

    const quillObjectKeys = Object.keys(quillDeltaObject.contents)
    for (let i = 0; i < quillObjectKeys.length; i++) {
      const attachedFile = new AttachedFile({ key: quillObjectKeys[i], contentType: quillDeltaObject.contents[quillObjectKeys[i]].type, resourceId: resource.id })
      attachedFile.uploadAs(quillDeltaObject.contents[quillObjectKeys[i]].buffer)
      await attachedFile.save()
    }
    res.status(201)
    res.locals.result = resource.record
    next()
  }

  async show (req: Request, res: Response, next: NextFunction) {
    const record = await prisma.resource.findUnique({
      where: { id: parseInt(req.params.id) }
    })
    if (record.visibility === Visibility.PRIVATE) {
      const permService = await new PermissionService(res.locals.user, [Role.USER, Role.MODERATOR], record.userId).call()
      if (!permService.isAuthorized) {
        res.locals.errors.push(...permService.errors)
        res.status(403); return next()
      }
    }

    const keysToLinks : {[key:string] : string} = {}

    const attachedfiles = await prisma.attachedFile.findMany({
      where: { resourceId: record.id }
    })

    for (let i = 0; i < attachedfiles.length; i++) {
      const result = await new AttachedFile(attachedfiles[i]).getPresignedUrl()
      const response = await fetch(result, {
        method: 'GET'
      })
      const textResponse = await (await response.text())
      console.log(textResponse)
      keysToLinks[attachedfiles[i].key] = textResponse.slice(1, textResponse.length - 2)
    }
    if (record.body != null && typeof (record.body) === typeof (JSON)) {
      const recordBody = record.body as Prisma.JsonObject
      const bodyWithUrl = QuillHelper.replaceKeysByLinks(recordBody, keysToLinks)
      console.log(bodyWithUrl)
      record.body = bodyWithUrl
    }

    res.locals.result = record
    res.status(200)
    next()
  }

  async update (req: Request, res: Response, next: NextFunction) {
    const record = await prisma.resource.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    const permService = await new PermissionService(res.locals.user, [Role.USER, Role.MODERATOR], record.userId).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(403); return next()
    }

    const resource = new Resource(record)
    const params = Resource.permitParams({
      type: record.type,
      ...req.body.resource
    })

    await resource.update(params)

    res.status(200)
    res.locals.result = resource.record
    next()
  }

  async destroy (req: Request, res: Response, next: NextFunction) {
    const record = await prisma.resource.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    const permService = await new PermissionService(res.locals.user, [Role.USER, Role.MODERATOR], record.userId).call()
    if (!permService.isAuthorized) {
      res.locals.errors.push(...permService.errors)
      res.status(403); return next()
    }

    const resource = new Resource(record)
    await resource.destroy()

    res.status(204)
    next()
  }
}

const resourcesController = new ResourcesController()
export default resourcesController
