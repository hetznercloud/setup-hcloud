import os from 'os'
import * as cache from '@actions/tool-cache'

export async function fetchBinary(version: string): Promise<string> {
  const osPlatform: string = getPlatform()
  const osArch: string = getArch()

  const cacheName = `hcloud_${osPlatform}`

  const assetExtension = osPlatform === 'windows' ? 'zip' : 'tar.gz'
  const assetFilename = `hcloud-${osPlatform}-${osArch}.${assetExtension}`

  const binaryPath = cache.find(cacheName, version, osArch)
  if (binaryPath) {
    return binaryPath
  }

  const url = `https://github.com/hetznercloud/cli/releases/download/${version}/${assetFilename}`
  const downloadPath = await cache.downloadTool(url)

  let extractedPath: string
  switch (assetExtension) {
    case 'zip':
      extractedPath = await cache.extractZip(downloadPath)
      break
    case 'tar.gz':
      extractedPath = await cache.extractTar(downloadPath)
      break
    default:
      throw new Error(`Unsupported archive format: ${assetExtension}`)
  }

  const cachedPath = await cache.cacheDir(
    extractedPath,
    cacheName,
    version,
    osArch
  )
  return cachedPath
}

export function getPlatform(): string {
  const platform = os.platform()
  switch (platform) {
    case 'darwin':
      return 'darwin'
    case 'freebsd':
      return 'freebsd'
    case 'linux':
      return 'linux'
    case 'win32':
      return 'windows'
    default:
      throw new Error(`Unsupported operating system platform: ${platform}`)
  }
}

export function getArch(): string {
  const arch = os.arch()
  switch (arch) {
    case 'arm':
      return 'armv6'
    case 'arm64':
      return 'arm64'
    case 'x32':
      return '386'
    case 'x64':
      return 'amd64'
    default:
      throw new Error(`Unsupported operating system architecture: ${arch}`)
  }
}
