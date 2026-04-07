// Private runtime barrel for the bundled Feishu extension.
// Keep this barrel thin and generic-only.

export type {
  AllowlistMatch,
  AnyAgentTool,
  BaseProbeResult,
  ChannelGroupContext,
  ChannelMessageActionName,
  ChannelMeta,
  ChannelOutboundAdapter,
  ChannelPlugin,
  HistoryEntry,
  UAGENTConfig,
  UAGENTPluginApi,
  OutboundIdentity,
  PluginRuntime,
  ReplyPayload,
} from "uagent/plugin-sdk/core";
export type { UAGENTConfig as ClawdbotConfig } from "uagent/plugin-sdk/core";
export type { RuntimeEnv } from "uagent/plugin-sdk/runtime";
export type { GroupToolPolicyConfig } from "uagent/plugin-sdk/config-runtime";
export {
  DEFAULT_ACCOUNT_ID,
  buildChannelConfigSchema,
  createActionGate,
  createDedupeCache,
} from "uagent/plugin-sdk/core";
export {
  PAIRING_APPROVED_MESSAGE,
  buildProbeChannelStatusSummary,
  createDefaultChannelRuntimeState,
} from "uagent/plugin-sdk/channel-status";
export { buildAgentMediaPayload } from "uagent/plugin-sdk/agent-media-payload";
export { createChannelPairingController } from "uagent/plugin-sdk/channel-pairing";
export { createReplyPrefixContext } from "uagent/plugin-sdk/channel-reply-pipeline";
export {
  evaluateSupplementalContextVisibility,
  filterSupplementalContextItems,
  resolveChannelContextVisibilityMode,
} from "uagent/plugin-sdk/config-runtime";
export { loadSessionStore, resolveSessionStoreEntry } from "uagent/plugin-sdk/config-runtime";
export { readJsonFileWithFallback } from "uagent/plugin-sdk/json-store";
export { createPersistentDedupe } from "uagent/plugin-sdk/persistent-dedupe";
export { normalizeAgentId } from "uagent/plugin-sdk/routing";
export { chunkTextForOutbound } from "uagent/plugin-sdk/text-chunking";
export {
  isRequestBodyLimitError,
  readRequestBodyWithLimit,
  requestBodyErrorToText,
} from "uagent/plugin-sdk/webhook-ingress";
export { setFeishuRuntime } from "./src/runtime.js";
