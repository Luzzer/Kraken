export type { ChannelPlugin, UAGENTPluginApi, PluginRuntime } from "uagent/plugin-sdk/core";
export type { UAGENTConfig } from "uagent/plugin-sdk/config-runtime";
export type {
  UAGENTPluginService,
  UAGENTPluginServiceContext,
  PluginLogger,
} from "uagent/plugin-sdk/core";
export type { ResolvedQQBotAccount, QQBotAccountConfig } from "./src/types.js";
export { getQQBotRuntime, setQQBotRuntime } from "./src/runtime.js";
