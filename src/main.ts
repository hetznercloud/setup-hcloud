import * as core from '@actions/core'
import * as github from '@actions/github'
import { fetchBinary } from './fetch-binary'
import { handleVersion } from './handle-version'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const githubTokenInput: string = core.getInput('github-token')
    const versionInput: string = core.getInput('hcloud-version')

    const octokit = github.getOctokit(githubTokenInput, {
      userAgent: 'setup-hcloud'
    })

    const version = await handleVersion(octokit, versionInput)

    const binaryPath = await fetchBinary(version)
    core.addPath(binaryPath)

    core.setOutput('hcloud-version', version)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
