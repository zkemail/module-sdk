import {
  Address,
  encodeFunctionData,
  getAddress,
  Hex,
  PublicClient,
} from 'viem'
import {
  COLD_STORAGE_HOOK_ADDRESS,
  COLD_STORAGE_FLASHLOAN_ADDRESS,
} from './constants'
import { abi } from './abi'
import { abi as flashloanAbi } from './flashloanAbi'
import { Execution } from '../../account'
import { Account } from '../../account'
import { moduleTypeIds } from '../types'
import { SENTINEL_ADDRESS } from '../../common/constants'

type Params = {
  waitPeriod: number
}

export const getSetWaitPeriodExecution = ({
  waitPeriod,
}: Params): Execution => {
  return {
    target: COLD_STORAGE_HOOK_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'setWaitPeriod',
      abi,
      args: [BigInt(waitPeriod)],
    }),
  }
}

export const getExecutionTime = async ({
  account,
  client,
  executionHash,
}: {
  account: Account
  client: PublicClient
  executionHash: Hex
}): Promise<Number | Error> => {
  try {
    const executionTimestamp = (await client.readContract({
      address: COLD_STORAGE_HOOK_ADDRESS,
      abi,
      functionName: 'checkHash',
      args: [account.address, executionHash],
    })) as Hex

    return Number(executionTimestamp)
  } catch (err) {
    console.error(err)
    throw new Error(
      `Failed to get execution time for account ${account.address} for execution ${executionHash}`,
    )
  }
}

type RequestTimelockedExecutionParams = {
  execution: Execution
  additionalWait: number
}

export const getRequestTimelockedExecution = ({
  execution,
  additionalWait,
}: RequestTimelockedExecutionParams): Execution => {
  return {
    target: COLD_STORAGE_HOOK_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'requestTimelockedExecution',
      abi,
      args: [execution, additionalWait],
    }),
  }
}

type RequestTimelockedModuleConfigParams = {
  moduleTypeId: (typeof moduleTypeIds)[keyof typeof moduleTypeIds]
  module: Address
  data: Hex
  isInstall: boolean
  additionalWait: number
}

export const getRequestTimelockedModuleConfigExecution = ({
  moduleTypeId,
  module,
  data,
  isInstall,
  additionalWait,
}: RequestTimelockedModuleConfigParams): Execution => {
  return {
    target: COLD_STORAGE_HOOK_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'requestTimelockedModuleConfig',
      abi,
      args: [
        BigInt(moduleTypeId),
        module,
        data,
        isInstall,
        BigInt(additionalWait),
      ],
    }),
  }
}

// -----------------
// Flashloan actions
// -----------------

export const getAddAddressExecution = ({
  addressToAdd,
}: {
  addressToAdd: Address
}): Execution => {
  return {
    target: COLD_STORAGE_FLASHLOAN_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'addAddress',
      abi: flashloanAbi,
      args: [addressToAdd],
    }),
  }
}

export const getRemoveAddressAction = async ({
  client,
  account,
  addressToRemove,
}: {
  client: PublicClient
  account: Account
  addressToRemove: Address
}): Promise<Execution | Error> => {
  const whitelistAddresses = await getWhitelist({ account, client })
  let prevAddress: Address

  const currentAddressIndex = whitelistAddresses.findIndex(
    (a) => a === addressToRemove,
  )

  if (currentAddressIndex === -1) {
    return new Error('Address not found')
  } else if (currentAddressIndex === 0) {
    prevAddress = SENTINEL_ADDRESS
  } else {
    prevAddress = getAddress(whitelistAddresses[currentAddressIndex - 1])
  }

  return {
    target: COLD_STORAGE_FLASHLOAN_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'removeAddress',
      abi: flashloanAbi,
      args: [addressToRemove, prevAddress],
    }),
  }
}

export const getWhitelist = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  try {
    const whitelistAddresses = (await client.readContract({
      address: COLD_STORAGE_FLASHLOAN_ADDRESS,
      abi: flashloanAbi,
      functionName: 'getWhitelist',
      args: [account.address],
    })) as Address[]

    return whitelistAddresses
  } catch (err) {
    console.error(err)
    return []
  }
}
