import os from 'os'
import { jest, describe, beforeEach, it, expect } from '@jest/globals'

jest.unstable_mockModule('@actions/tool-cache', () => ({
  find: jest.fn(),
  downloadTool: jest.fn(),
  extractZip: jest.fn(),
  extractTar: jest.fn(),
  cacheDir: jest.fn()
}))

const cache = await import('@actions/tool-cache')
const { fetchBinary } = await import('../fetch-binary.js')

describe('fetchBinary', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(os, 'platform').mockImplementation()
    jest.spyOn(os, 'arch').mockImplementation()
  })

  it('download linux arm64', async () => {
    jest.spyOn(os, 'platform').mockReturnValueOnce('linux')
    jest.spyOn(os, 'arch').mockReturnValueOnce('arm64')

    jest.mocked(cache.find).mockReturnValueOnce('')
    jest.mocked(cache.downloadTool).mockResolvedValueOnce('/download/path')
    jest.mocked(cache.extractTar).mockResolvedValueOnce('/extract/path')
    jest.mocked(cache.cacheDir).mockResolvedValueOnce('/cached/path')

    const binaryPath = await fetchBinary('v1.41.1')

    expect(cache.find).toHaveBeenCalledWith('hcloud_linux', 'v1.41.1', 'arm64')
    expect(cache.downloadTool).toHaveBeenCalledWith(
      'https://github.com/hetznercloud/cli/releases/download/v1.41.1/hcloud-linux-arm64.tar.gz'
    )
    expect(cache.extractTar).toHaveBeenCalledWith('/download/path')
    expect(cache.cacheDir).toHaveBeenCalledWith(
      '/extract/path',
      'hcloud_linux',
      'v1.41.1',
      'arm64'
    )

    expect(binaryPath).toEqual('/cached/path')
  })

  it('download windows x64', async () => {
    jest.spyOn(os, 'platform').mockReturnValueOnce('win32')
    jest.spyOn(os, 'arch').mockReturnValueOnce('x64')

    jest.mocked(cache.find).mockReturnValueOnce('')
    jest.mocked(cache.downloadTool).mockResolvedValueOnce('/download/path')
    jest.mocked(cache.extractZip).mockResolvedValueOnce('/extract/path')
    jest.mocked(cache.cacheDir).mockResolvedValueOnce('/cached/path')

    const binaryPath = await fetchBinary('v1.41.1')

    expect(cache.find).toHaveBeenCalledWith('hcloud_windows', 'v1.41.1', 'amd64')
    expect(cache.downloadTool).toHaveBeenCalledWith(
      'https://github.com/hetznercloud/cli/releases/download/v1.41.1/hcloud-windows-amd64.zip'
    )
    expect(cache.extractZip).toHaveBeenCalledWith('/download/path')
    expect(cache.cacheDir).toHaveBeenCalledWith(
      '/extract/path',
      'hcloud_windows',
      'v1.41.1',
      'amd64'
    )

    expect(binaryPath).toEqual('/cached/path')
  })

  it('download linux arm64 cached', async () => {
    jest.spyOn(os, 'platform').mockReturnValueOnce('linux')
    jest.spyOn(os, 'arch').mockReturnValueOnce('arm64')

    jest.mocked(cache.find).mockReturnValueOnce('/cached/path')

    const binaryPath = await fetchBinary('v1.41.1')

    expect(cache.find).toHaveBeenCalledWith('hcloud_linux', 'v1.41.1', 'arm64')

    expect(cache.downloadTool).not.toHaveBeenCalled()
    expect(cache.extractTar).not.toHaveBeenCalled()
    expect(cache.cacheDir).not.toHaveBeenCalled()

    expect(binaryPath).toEqual('/cached/path')
  })
})
