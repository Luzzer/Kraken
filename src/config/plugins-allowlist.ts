import type { UAGENTConfig } from "./config.js";

export function ensurePluginAllowlisted(cfg: UAGENTConfig, pluginId: string): UAGENTConfig {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}
