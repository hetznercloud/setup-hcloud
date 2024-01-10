/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as github from '@actions/github'

import * as main from '../main'
import * as fetchBinary from '../fetch-binary'
import * as handleVersion from '../handle-version'

const runMock = jest.spyOn(main, 'run')

let handleVersionMock: jest.SpyInstance
let fetchBinaryMock: jest.SpyInstance

let getInputMock: jest.SpyInstance
let getOctokitMock: jest.SpyInstance
let addPathMock: jest.SpyInstance
let setOutputMock: jest.SpyInstance
let setFailedMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    handleVersionMock = jest
      .spyOn(handleVersion, 'handleVersion')
      .mockImplementation(async () => 'v1.41.1')
    fetchBinaryMock = jest
      .spyOn(fetchBinary, 'fetchBinary')
      .mockImplementation(async () => '/binary/path')

    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    getOctokitMock = jest.spyOn(github, 'getOctokit').mockImplementation()
    addPathMock = jest.spyOn(core, 'addPath').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
  })

  it('happy path', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'hcloud-version':
          return 'latest'
        case 'github-token':
          return 'some-github-token'
        default:
          return ''
      }
    })

    getOctokitMock.mockImplementationOnce(() => null)

    await main.run()
    expect(runMock).toHaveReturned()
    expect(setFailedMock).not.toHaveBeenCalled()

    expect(getOctokitMock).toHaveBeenCalled()
    expect(handleVersionMock).toHaveBeenCalled()
    expect(fetchBinaryMock).toHaveBeenCalledWith('v1.41.1')
    expect(addPathMock).toHaveBeenCalledWith('/binary/path')
    expect(setOutputMock).toHaveBeenCalledWith('hcloud-version', 'v1.41.1')
  })

  it('failed', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'hcloud-version':
          return 'latest'
        case 'github-token':
          return 'some-github-token'
        default:
          return ''
      }
    })

    getOctokitMock.mockImplementationOnce(() => null)
    handleVersionMock.mockImplementation(async () => {
      throw new Error('some error occurred')
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setFailedMock).toHaveBeenCalledWith('some error occurred')
  })
})
