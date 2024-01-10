import * as handleVersion from '../handle-version'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let octokitMock: any

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    octokitMock = {
      rest: {
        repos: {
          getLatestRelease: jest.fn(() => ({ data: { tag_name: 'v1.41.1' } }))
        }
      }
    }
  })

  it('happy path latest', async () => {
    const version = await handleVersion.handleVersion(octokitMock, 'latest')

    expect(version).toBe('v1.41.1')
    expect(octokitMock.rest.repos.getLatestRelease).toHaveBeenCalledWith({
      owner: 'hetznercloud',
      repo: 'cli'
    })
  })

  it('happy path 1.41.1', async () => {
    const version = await handleVersion.handleVersion(octokitMock, '1.41.1')

    expect(version).toBe('v1.41.1')
    expect(octokitMock.rest.repos.getLatestRelease).not.toHaveBeenCalled()
  })

  it('happy path v1.41.1', async () => {
    const version = await handleVersion.handleVersion(octokitMock, 'v1.41.1')

    expect(version).toBe('v1.41.1')
    expect(octokitMock.rest.repos.getLatestRelease).not.toHaveBeenCalled()
  })
})
