import { createConfigIO, getRuntimeConfigSnapshot, type UAGENTConfig } from "../config/config.js";

export function loadBrowserConfigForRuntimeRefresh(): UAGENTConfig {
  return getRuntimeConfigSnapshot() ?? createConfigIO().loadConfig();
}
