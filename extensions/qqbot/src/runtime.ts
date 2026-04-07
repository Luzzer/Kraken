import type { PluginRuntime } from "uagent/plugin-sdk/core";
import { createPluginRuntimeStore } from "uagent/plugin-sdk/runtime-store";

const { setRuntime: setQQBotRuntime, getRuntime: getQQBotRuntime } =
  createPluginRuntimeStore<PluginRuntime>("QQBot runtime not initialized");
export { getQQBotRuntime, setQQBotRuntime };
