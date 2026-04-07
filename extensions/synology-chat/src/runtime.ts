import type { PluginRuntime } from "uagent/plugin-sdk/core";
import { createPluginRuntimeStore } from "uagent/plugin-sdk/runtime-store";

const { setRuntime: setSynologyRuntime, getRuntime: getSynologyRuntime } =
  createPluginRuntimeStore<PluginRuntime>(
    "Synology Chat runtime not initialized - plugin not registered",
  );
export { getSynologyRuntime, setSynologyRuntime };
