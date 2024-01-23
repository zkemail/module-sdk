import { PublicClient } from "viem";
import { Account } from "../Account";
import { Module } from "../../../module/common/Module";

export const uninstallModule = (
  client: PublicClient,
  account: Account,
  module: Module
) => {
  // TODO
  //   switch (module.type) {
  //     case "validator":
  //       return installValidator(client, account, module.address, module.initData);
  //     case "executor":
  //       return installExecutor(client, account, module.address, module.initData);
  //     case "fallback":
  //       return installFallback(
  //         client,
  //         account,
  //         module.initData,
  //         module.isStatic,
  //         module.address
  //       );
  //     case "hook":
  //       return installHook(client, account, module.address, module.initData);
  //     default:
  //       throw new Error(`Unknown module type ${module.type}`);
  //   }
};