// Private runtime barrel for the bundled Google Chat extension.
// Keep this barrel thin and avoid broad plugin-sdk surfaces during bootstrap.

export { DEFAULT_ACCOUNT_ID } from "uagent/plugin-sdk/account-id";
export {
  createActionGate,
  jsonResult,
  readNumberParam,
  readReactionParams,
  readStringParam,
} from "uagent/plugin-sdk/channel-actions";
export { buildChannelConfigSchema } from "uagent/plugin-sdk/channel-config-primitives";
export type {
  ChannelMessageActionAdapter,
  ChannelMessageActionName,
  ChannelStatusIssue,
} from "uagent/plugin-sdk/channel-contract";
export { missingTargetError } from "uagent/plugin-sdk/channel-feedback";
export {
  createAccountStatusSink,
  runPassiveAccountLifecycle,
} from "uagent/plugin-sdk/channel-lifecycle";
export { createChannelPairingController } from "uagent/plugin-sdk/channel-pairing";
export { createChannelReplyPipeline } from "uagent/plugin-sdk/channel-reply-pipeline";
export {
  evaluateGroupRouteAccessForPolicy,
  resolveDmGroupAccessWithLists,
  resolveSenderScopedGroupPolicy,
} from "uagent/plugin-sdk/channel-policy";
export { PAIRING_APPROVED_MESSAGE } from "uagent/plugin-sdk/channel-status";
export { chunkTextForOutbound } from "uagent/plugin-sdk/text-chunking";
export type { UAGENTConfig } from "uagent/plugin-sdk/config-runtime";
export {
  GROUP_POLICY_BLOCKED_LABEL,
  isDangerousNameMatchingEnabled,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "uagent/plugin-sdk/config-runtime";
export { fetchRemoteMedia, resolveChannelMediaMaxBytes } from "uagent/plugin-sdk/media-runtime";
export { loadOutboundMediaFromUrl } from "uagent/plugin-sdk/outbound-media";
export type { PluginRuntime } from "uagent/plugin-sdk/runtime-store";
export { fetchWithSsrFGuard } from "uagent/plugin-sdk/ssrf-runtime";
export {
  GoogleChatConfigSchema,
  type GoogleChatAccountConfig,
  type GoogleChatConfig,
} from "uagent/plugin-sdk/googlechat-runtime-shared";
export { extractToolSend } from "uagent/plugin-sdk/tool-send";
export { resolveMentionGatingWithBypass } from "uagent/plugin-sdk/channel-inbound";
export { resolveInboundRouteEnvelopeBuilderWithRuntime } from "uagent/plugin-sdk/inbound-envelope";
export { resolveWebhookPath } from "uagent/plugin-sdk/webhook-path";
export {
  registerWebhookTargetWithPluginRoute,
  resolveWebhookTargetWithAuthOrReject,
  withResolvedWebhookRequestPipeline,
} from "uagent/plugin-sdk/webhook-targets";
export {
  createWebhookInFlightLimiter,
  readJsonWebhookBodyOrReject,
  type WebhookInFlightLimiter,
} from "uagent/plugin-sdk/webhook-request-guards";
export { setGoogleChatRuntime } from "./src/runtime.js";
