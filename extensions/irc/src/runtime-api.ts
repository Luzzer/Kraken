// Private runtime barrel for the bundled IRC extension.
// Keep this barrel thin and generic-only.

export type { BaseProbeResult } from "uagent/plugin-sdk/channel-contract";
export type { ChannelPlugin } from "uagent/plugin-sdk/channel-core";
export type { UAGENTConfig } from "uagent/plugin-sdk/config-runtime";
export type { PluginRuntime } from "uagent/plugin-sdk/runtime-store";
export type { RuntimeEnv } from "uagent/plugin-sdk/runtime";
export type {
  BlockStreamingCoalesceConfig,
  DmConfig,
  DmPolicy,
  GroupPolicy,
  GroupToolPolicyBySenderConfig,
  GroupToolPolicyConfig,
  MarkdownConfig,
} from "uagent/plugin-sdk/config-runtime";
export type { OutboundReplyPayload } from "uagent/plugin-sdk/reply-payload";
export { DEFAULT_ACCOUNT_ID } from "uagent/plugin-sdk/account-id";
export { buildChannelConfigSchema } from "uagent/plugin-sdk/channel-config-primitives";
export {
  PAIRING_APPROVED_MESSAGE,
  buildBaseChannelStatusSummary,
} from "uagent/plugin-sdk/channel-status";
export { createChannelPairingController } from "uagent/plugin-sdk/channel-pairing";
export { createAccountStatusSink } from "uagent/plugin-sdk/channel-lifecycle";
export {
  readStoreAllowFromForDmPolicy,
  resolveEffectiveAllowFromLists,
} from "uagent/plugin-sdk/channel-policy";
export { resolveControlCommandGate } from "uagent/plugin-sdk/command-auth";
export { dispatchInboundReplyWithBase } from "uagent/plugin-sdk/inbound-reply-dispatch";
export { chunkTextForOutbound } from "uagent/plugin-sdk/text-chunking";
export {
  deliverFormattedTextWithAttachments,
  formatTextWithAttachmentLinks,
  resolveOutboundMediaUrls,
} from "uagent/plugin-sdk/reply-payload";
export {
  GROUP_POLICY_BLOCKED_LABEL,
  isDangerousNameMatchingEnabled,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "uagent/plugin-sdk/config-runtime";
export { logInboundDrop } from "uagent/plugin-sdk/channel-inbound";
