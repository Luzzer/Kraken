import type { PluginRuntime } from "uagent/plugin-sdk/plugin-runtime";
import { createPluginRuntimeStore } from "uagent/plugin-sdk/runtime-store";

const { setRuntime: setTlonRuntime, getRuntime: getTlonRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Tlon runtime not initialized");
export { getTlonRuntime, setTlonRuntime };
