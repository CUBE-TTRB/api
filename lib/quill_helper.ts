import Guid from './guid'
import { Prisma } from '@prisma/client'

export interface BufferWithType {
  buffer: Buffer,
  type: string
}

export type QuillDeltaObject = {
    json : Array<any>;
    contents : { [key: string] : BufferWithType; };
}

export default class QuillHelper {
  static parseJsonToQuillDeltaObject (delta : any) : QuillDeltaObject {
    const result : QuillDeltaObject = {
      json: [],
      contents: {}
    }
    delta.ops.forEach((element: { insert: { image: null | string; }; }) => {
      const guid = Guid.newGuid()
      if (element.insert.image != null) {
        const bufferWithType: BufferWithType = { buffer: Buffer.from(JSON.stringify(element.insert.image)), type: 'f' }
        result.contents[guid] = bufferWithType
        const elementKey = element
        elementKey.insert.image = guid
        result.json.push(elementKey)
      } else {
        result.json.push(element)
      }
    })
    return result
  }

  static replaceKeysByLinks (json : Prisma.JsonObject, keysLinks : {[key: string] : string}) : any[] {
    const result: Prisma.JsonObject[] = []
    const stringJson = JSON.stringify(json)
    Object.keys(keysLinks).forEach(element => {
      if (stringJson.includes(element)) {
        const linkedElement = stringJson.replace(element, keysLinks[element])
        result.push(JSON.parse(linkedElement))
      } else {
        result.push(json)
      }
    })
    return result
  }
}
