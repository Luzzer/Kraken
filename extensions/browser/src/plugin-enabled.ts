import type { UAGENTConfig } from "uagent/plugin-sdk/browser-config-runtime";
import {
  normalizePluginsConfig,
  resolveEffectiveEnableState,
} from "uagent/plugin-sdk/browser-config-runtime";

export function isDefaultBrowserPluginEnabled(cfg: UAGENTConfig): boolean {
  return resolveEffectiveEnableState({
    id: "browser",
    origin: "bundled",
    config: normalizePluginsConfig(cfg.plugins),
    rootConfig: cfg,
    enabledByDefault: true,
  }).enabled;
}
