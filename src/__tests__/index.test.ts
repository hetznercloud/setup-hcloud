/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import { jest } from '@jest/globals'
import * as main from '../main.js'

// Mock the action's entrypoint
const runMock = jest.spyOn(main, 'run').mockImplementation()

describe('index', () => {
  it('calls run when imported', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../index')

    expect(runMock).toHaveBeenCalled()
  })
})
