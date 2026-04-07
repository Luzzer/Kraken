// Narrow plugin-sdk surface for the bundled diffs plugin.
// Keep this list additive and scoped to the bundled diffs surface.

export { definePluginEntry } from "./plugin-entry.js";
export type { UAGENTConfig } from "../config/config.js";
export { resolvePreferredUAGENTTmpDir } from "../infra/tmp-uagent-dir.js";
export type {
  AnyAgentTool,
  UAGENTPluginApi,
  UAGENTPluginConfigSchema,
  UAGENTPluginToolContext,
  PluginLogger,
} from "../plugins/types.js";
