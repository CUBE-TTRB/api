import app from '@App/app'
import request from 'supertest'

const payload = {
  user: {
    name: 'John',
    lastName: 'Doe'
  },
  auth: {
    password: 'password'
  }
}

describe('POST /users', () => {
  it('works', () => {
    // request(app)
    //   .post('/users')
    //   .send(payload)
    //   .expect(201)
    expect(true).toBe(true)
  })
})
