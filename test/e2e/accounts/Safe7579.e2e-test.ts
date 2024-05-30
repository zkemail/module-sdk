import { getAccount } from 'src/account'
import { getPublicClient, getTestClient } from 'test/utils/userOps/clients'
import { setupEnvironment, cleanUpEnvironment } from '../infra'
import {
  testAutoSavingsExecutor,
  testDeadmanSwitchValidator,
  testSocialRecoveryValidator,
  testRegistryHook,
  testMultiFactorValidator,
  testColdStorageHook,
  testScheduledOrdersExecutor,
  testScheduledTransfersExecutor,
  testHookMultiPlexer,
  testOwnableExecutor,
  testOwnableValidator,
} from 'test/e2e/modules'

describe('Test Safe-7579 account', () => {
  const testClient = getTestClient()
  const publicClient = getPublicClient()
  const SAFE_ACCOUNT_ADDRESS = '0xc2b17e73603dccc195118a36f3203134fd7985f5'
  const account = getAccount({
    address: SAFE_ACCOUNT_ADDRESS,
    type: 'safe',
  })

  beforeAll(async () => {
    await setupEnvironment({
      account,
      publicClient: publicClient,
      testClient,
    })
  }, 20000)

  afterAll(async () => {
    await cleanUpEnvironment({
      account,
      client: publicClient,
    })
  }, 20000)

  testOwnableValidator({
    account,
    publicClient,
    testClient,
  })

  testOwnableExecutor({
    account,
    publicClient,
    testClient,
  })

  testAutoSavingsExecutor({
    account,
    publicClient,
    testClient,
  })

  testDeadmanSwitchValidator({
    account,
    publicClient,
    testClient,
  })

  testSocialRecoveryValidator({
    account,
    publicClient,
    testClient,
  })

  testRegistryHook({
    account,
    publicClient,
    testClient,
  })

  testMultiFactorValidator({
    account,
    publicClient,
    testClient,
  })

  testColdStorageHook({
    account,
    publicClient,
    testClient,
  })

  testScheduledOrdersExecutor({
    account,
    publicClient,
    testClient,
  })

  testScheduledTransfersExecutor({
    account,
    publicClient,
    testClient,
  })

  testHookMultiPlexer({
    account,
    publicClient,
    testClient,
  })
})
