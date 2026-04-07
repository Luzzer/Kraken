import { isRecord } from "../utils.js";
import type { UAGENTConfig } from "./config.js";

export function resolvePluginWebSearchConfig(
  config: UAGENTConfig | undefined,
  pluginId: string,
): Record<string, unknown> | undefined {
  const pluginConfig = config?.plugins?.entries?.[pluginId]?.config;
  if (!isRecord(pluginConfig)) {
    return undefined;
  }
  return isRecord(pluginConfig.webSearch) ? pluginConfig.webSearch : undefined;
}
