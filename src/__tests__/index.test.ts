import { jest, describe, it, expect } from '@jest/globals'

jest.unstable_mockModule('../main.js', () => ({
  run: jest.fn()
}))

const { run } = await import('../main.js')

describe('index', () => {
  it('calls run when imported', async () => {
    await import('../index.js')

    expect(run).toHaveBeenCalled()
  })
})
