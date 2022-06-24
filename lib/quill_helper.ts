import Guid from './guid'

export type QuillDeltaObject = {
    json : Array<any>;
    contents : { [key: string] : Buffer; };
}

export default class QuillHelper {
  static parseJsonToQuillDeltaObject (jsonDelta : any) : QuillDeltaObject {
    const result : QuillDeltaObject = {
      json: [],
      contents: {}
    }

    jsonDelta.forEach((element: { insert: { image: null | string; }; }) => {
      const guid = Guid.newGuid()
      if (element.insert.image != null) {
        result.contents[guid] = Buffer.from(JSON.stringify(element.insert.image))
        const elementKey = element
        elementKey.insert.image = guid
        result.json.push(elementKey)
      } else {
        result.json.push(element)
      }
    })
    return result
  }

  static replaceKeysByLinks (json : string[], keysLinks : {[key: string] : string}) : any[] {
    const result: string[] = []
    for (let i = 0; i < json.length; i++) {
      const stringJson = JSON.stringify(json[i])
      // Object.keys(json[i]).forEach((element) => {
      Object.keys(keysLinks).forEach(element => {
        // console.log(JSON.stringify(json[i]) + "json[i]")
        // console.log(element + "keys")
        if (stringJson.includes(element)) {
          const linkedElement = stringJson.replace(element, keysLinks[element])
          result.push(JSON.parse(linkedElement))
        } else {
          result.push(json[i])
        }
      })
    }
    return result
  }
}
