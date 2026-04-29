import { jest, describe, beforeEach, it, expect } from '@jest/globals'

jest.unstable_mockModule('../fetch-binary.js', () => ({
  fetchBinary: jest.fn()
}))

jest.unstable_mockModule('../handle-version.js', () => ({
  handleVersion: jest.fn()
}))

jest.unstable_mockModule('@actions/core', () => ({
  getInput: jest.fn(),
  addPath: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn()
}))

jest.unstable_mockModule('@actions/github', () => ({
  getOctokit: jest.fn()
}))

const { run } = await import('../main.js')
const { fetchBinary } = await import('../fetch-binary.js')
const { handleVersion } = await import('../handle-version.js')
const core = await import('@actions/core')
const github = await import('@actions/github')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    jest.mocked(handleVersion).mockResolvedValue('v1.41.1')
    jest.mocked(fetchBinary).mockResolvedValue('/binary/path')
    jest.mocked(github.getOctokit).mockReturnValue({} as ReturnType<typeof github.getOctokit>)
  })

  it('happy path', async () => {
    jest.mocked(core.getInput).mockImplementation((name: string): string => {
      switch (name) {
        case 'hcloud-version':
          return 'latest'
        case 'github-token':
          return 'some-github-token'
        default:
          return ''
      }
    })

    await run()

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(github.getOctokit).toHaveBeenCalled()
    expect(handleVersion).toHaveBeenCalled()
    expect(fetchBinary).toHaveBeenCalledWith('v1.41.1')
    expect(core.addPath).toHaveBeenCalledWith('/binary/path')
    expect(core.setOutput).toHaveBeenCalledWith('hcloud-version', 'v1.41.1')
  })

  it('failed', async () => {
    jest.mocked(core.getInput).mockImplementation((name: string): string => {
      switch (name) {
        case 'hcloud-version':
          return 'latest'
        case 'github-token':
          return 'some-github-token'
        default:
          return ''
      }
    })

    jest.mocked(handleVersion).mockRejectedValueOnce(new Error('some error occurred'))

    await run()

    expect(core.setFailed).toHaveBeenCalledWith('some error occurred')
  })
})
