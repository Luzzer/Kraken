import { getRuntimeConfigSnapshot, type UAGENTConfig } from "../../config/config.js";

export function resolveSkillRuntimeConfig(config?: UAGENTConfig): UAGENTConfig | undefined {
  return getRuntimeConfigSnapshot() ?? config;
}
