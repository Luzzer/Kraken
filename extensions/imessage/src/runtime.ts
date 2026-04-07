import type { PluginRuntime } from "uagent/plugin-sdk/core";
import { createPluginRuntimeStore } from "uagent/plugin-sdk/runtime-store";

const { setRuntime: setIMessageRuntime, getRuntime: getIMessageRuntime } =
  createPluginRuntimeStore<PluginRuntime>("iMessage runtime not initialized");
export { getIMessageRuntime, setIMessageRuntime };
