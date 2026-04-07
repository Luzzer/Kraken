import type { ChannelDoctorConfigMutation } from "uagent/plugin-sdk/channel-contract";
import type { UAGENTConfig } from "uagent/plugin-sdk/config-runtime";
import { normalizeCompatibilityConfig as normalizeCompatibilityConfigImpl } from "./doctor.js";

export function normalizeCompatibilityConfig({
  cfg,
}: {
  cfg: UAGENTConfig;
}): ChannelDoctorConfigMutation {
  return normalizeCompatibilityConfigImpl({ cfg });
}
