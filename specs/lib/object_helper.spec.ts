import { filterProperties } from '@App/lib/object_helpers'
import 'jest'

describe('filterProperties', () => {
  const car = { color: 'blue', price: 50000, year: 2007, km: 123456 }

  it('keeps only the given properties of an object', () => {
    expect(filterProperties(car, ['color', 'year'])).toEqual({ color: 'blue', year: 2007 })
  })

  describe('when there is no asked properties', () => {
    it('returns an empty object', () => {
      expect(filterProperties(car, [])).toEqual({})
    })
  })

  describe('when the object does not have properties', () => {
    it('returns an empty object', () => {
      expect(filterProperties({}, ['idk'])).toEqual({})
    })
  })

  describe('when the object does not exist', () => {
    it('returns an empty object', () => {
      expect(filterProperties(undefined, ['idk'])).toEqual({})
    })
  })

  describe('when the object is not a primitive', () => {
    it('returns an empty object', () => {
      expect(filterProperties(1, ['idk'])).toEqual({})
      expect(filterProperties('hello', ['idk'])).toEqual({})
      expect(filterProperties(false, ['idk'])).toEqual({})
    })
  })
})
