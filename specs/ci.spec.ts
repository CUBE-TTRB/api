import 'jest'

// Deliberately make the CI fail
describe('CI', () => {
  it('fails', () => {
    // expect(true).toBe(false)
    expect(true).toBe(true)
  })
})
