// Private runtime barrel for the bundled Zalo Personal extension.
// Keep this barrel thin and aligned with the local extension surface.

export * from "./api.js";
export { setZalouserRuntime } from "./src/runtime.js";
export type { ReplyPayload } from "uagent/plugin-sdk/reply-runtime";
export type {
  BaseProbeResult,
  ChannelAccountSnapshot,
  ChannelDirectoryEntry,
  ChannelGroupContext,
  ChannelMessageActionAdapter,
  ChannelStatusIssue,
} from "uagent/plugin-sdk/channel-contract";
export type {
  UAGENTConfig,
  GroupToolPolicyConfig,
  MarkdownTableMode,
} from "uagent/plugin-sdk/config-runtime";
export type {
  PluginRuntime,
  AnyAgentTool,
  ChannelPlugin,
  UAGENTPluginToolContext,
} from "uagent/plugin-sdk/core";
export type { RuntimeEnv } from "uagent/plugin-sdk/runtime";
export {
  DEFAULT_ACCOUNT_ID,
  buildChannelConfigSchema,
  normalizeAccountId,
} from "uagent/plugin-sdk/core";
export { chunkTextForOutbound } from "uagent/plugin-sdk/text-chunking";
export {
  isDangerousNameMatchingEnabled,
  resolveDefaultGroupPolicy,
  resolveOpenProviderRuntimeGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "uagent/plugin-sdk/config-runtime";
export {
  mergeAllowlist,
  summarizeMapping,
  formatAllowFromLowercase,
} from "uagent/plugin-sdk/allow-from";
export { resolveMentionGatingWithBypass } from "uagent/plugin-sdk/channel-inbound";
export { createChannelPairingController } from "uagent/plugin-sdk/channel-pairing";
export { createChannelReplyPipeline } from "uagent/plugin-sdk/channel-reply-pipeline";
export { buildBaseAccountStatusSnapshot } from "uagent/plugin-sdk/status-helpers";
export { resolveSenderCommandAuthorization } from "uagent/plugin-sdk/command-auth";
export {
  evaluateGroupRouteAccessForPolicy,
  resolveSenderScopedGroupPolicy,
} from "uagent/plugin-sdk/group-access";
export { loadOutboundMediaFromUrl } from "uagent/plugin-sdk/outbound-media";
export {
  deliverTextOrMediaReply,
  isNumericTargetId,
  resolveSendableOutboundReplyParts,
  sendPayloadWithChunkedTextAndMedia,
  type OutboundReplyPayload,
} from "uagent/plugin-sdk/reply-payload";
export { resolvePreferredUAGENTTmpDir } from "uagent/plugin-sdk/browser-security-runtime";
