import { GitHub } from '@actions/github/lib/utils'

export async function handleVersion(
  octokit: InstanceType<typeof GitHub>,
  version: string
): Promise<string> {
  if (version === 'latest') {
    const release = await octokit.rest.repos.getLatestRelease({
      owner: 'hetznercloud',
      repo: 'cli'
    })
    return release.data.tag_name
  } else {
    // Ensure version has prefix
    if (!version.startsWith('v')) {
      return `v${version}`
    }

    return version
  }
}
