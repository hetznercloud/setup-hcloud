import os from 'os'
import * as cache from '@actions/tool-cache'
import { fetchBinary } from '../fetch-binary'

let platformMock: jest.SpyInstance
let archMock: jest.SpyInstance

let findMock: jest.SpyInstance
let downloadToolMock: jest.SpyInstance
let extractZipMock: jest.SpyInstance
let extractTarMock: jest.SpyInstance
let cacheDirMock: jest.SpyInstance

describe('fetchBinary', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    platformMock = jest.spyOn(os, 'platform').mockImplementation()
    archMock = jest.spyOn(os, 'arch').mockImplementation()

    findMock = jest.spyOn(cache, 'find').mockImplementation()
    downloadToolMock = jest.spyOn(cache, 'downloadTool').mockImplementation()
    extractZipMock = jest.spyOn(cache, 'extractZip').mockImplementation()
    extractTarMock = jest.spyOn(cache, 'extractTar').mockImplementation()
    cacheDirMock = jest.spyOn(cache, 'cacheDir').mockImplementation()
  })

  it('download linux arm64', async () => {
    platformMock.mockImplementationOnce(() => 'linux')
    archMock.mockImplementationOnce(() => 'arm64')

    findMock.mockImplementationOnce(() => '')
    downloadToolMock.mockImplementationOnce(() => '/download/path')
    extractTarMock.mockImplementationOnce(() => '/extract/path')
    cacheDirMock.mockImplementationOnce(() => '/cached/path')

    const binaryPath = await fetchBinary('v1.41.1')

    expect(findMock).toHaveBeenCalledWith('hcloud_linux', 'v1.41.1', 'arm64')
    expect(downloadToolMock).toHaveBeenCalledWith(
      'https://github.com/hetznercloud/cli/releases/download/v1.41.1/hcloud-linux-arm64.tar.gz'
    )
    expect(extractTarMock).toHaveBeenCalledWith('/download/path')
    expect(cacheDirMock).toHaveBeenCalledWith(
      '/extract/path',
      'hcloud_linux',
      'v1.41.1',
      'arm64'
    )

    expect(binaryPath).toEqual('/cached/path')
  })

  it('download windows x64', async () => {
    platformMock.mockImplementationOnce(() => 'win32')
    archMock.mockImplementationOnce(() => 'x64')

    findMock.mockImplementationOnce(() => '')
    downloadToolMock.mockImplementationOnce(() => '/download/path')
    extractZipMock.mockImplementationOnce(() => '/extract/path')
    cacheDirMock.mockImplementationOnce(() => '/cached/path')

    const binaryPath = await fetchBinary('v1.41.1')

    expect(findMock).toHaveBeenCalledWith('hcloud_windows', 'v1.41.1', 'amd64')
    expect(downloadToolMock).toHaveBeenCalledWith(
      'https://github.com/hetznercloud/cli/releases/download/v1.41.1/hcloud-windows-amd64.zip'
    )
    expect(extractZipMock).toHaveBeenCalledWith('/download/path')
    expect(cacheDirMock).toHaveBeenCalledWith(
      '/extract/path',
      'hcloud_windows',
      'v1.41.1',
      'amd64'
    )

    expect(binaryPath).toEqual('/cached/path')
  })

  it('download linux arm64 cached', async () => {
    platformMock.mockImplementationOnce(() => 'linux')
    archMock.mockImplementationOnce(() => 'arm64')

    findMock.mockImplementationOnce(() => '/cached/path')

    const binaryPath = await fetchBinary('v1.41.1')

    expect(findMock).toHaveBeenCalledWith('hcloud_linux', 'v1.41.1', 'arm64')

    expect(downloadToolMock).not.toHaveBeenCalled()
    expect(extractTarMock).not.toHaveBeenCalled()
    expect(cacheDirMock).not.toHaveBeenCalled()

    expect(binaryPath).toEqual('/cached/path')
  })
})
