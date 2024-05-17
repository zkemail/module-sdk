import { Address, encodeFunctionData, Hex, PublicClient } from 'viem'
import { HOOK_MULTI_PLEXER_ADDRESS } from './constants'
import { abi } from './abi'
import { Execution } from '../../account'
import { Account } from '../../account'
import { HookType } from './types'

export const getHooks = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<Address[]> => {
  try {
    const hooks = (await client.readContract({
      address: HOOK_MULTI_PLEXER_ADDRESS,
      abi,
      functionName: 'getHooks',
      args: [account.address],
    })) as Address[]

    return hooks
  } catch (err) {
    console.error(err)
    return []
  }
}

export const addHook = ({
  hook,
  hookType,
  sig,
}: {
  hook: Address
  hookType: HookType
  sig?: Hex
}): Execution => {
  try {
    return {
      target: HOOK_MULTI_PLEXER_ADDRESS,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: sig ? 'addSigHook' : 'addHook',
        abi,
        args: sig ? [hook, sig, hookType] : [hook, hookType],
      }),
    }
  } catch {
    throw new Error(`Failed to add hook ${hook}`)
  }
}

export const removeHook = ({
  hook,
  hookType,
  sig,
}: {
  hook: Address
  hookType: HookType
  sig?: Hex
}): Execution => {
  try {
    return {
      target: HOOK_MULTI_PLEXER_ADDRESS,
      value: BigInt(0),
      callData: encodeFunctionData({
        functionName: sig ? 'removeSigHook' : 'removeHook',
        abi,
        args: sig ? [hook, sig, hookType] : [hook, hookType],
      }),
    }
  } catch {
    throw new Error(`Failed to remove hook ${hook}`)
  }
}
