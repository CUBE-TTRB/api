/**
 * Filters an object by only keeping the given selected properties.
 *
 * @param properties The list of properties to keep.
 * @returns The filtered object.
 */
export function filterProperties (object: any, properties: string[]): any {
  if (!object) return {}

  return Object.fromEntries(Object.entries(object).filter(([key, _]) => {
    return properties.includes(key)
  }))
}
