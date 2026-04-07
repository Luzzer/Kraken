// Private runtime barrel for the bundled Mattermost extension.
// Keep this barrel thin and generic-only.

export type {
  BaseProbeResult,
  ChannelAccountSnapshot,
  ChannelDirectoryEntry,
  ChannelGroupContext,
  ChannelMessageActionName,
  ChannelPlugin,
  ChatType,
  HistoryEntry,
  UAGENTConfig,
  UAGENTPluginApi,
  PluginRuntime,
} from "uagent/plugin-sdk/core";
export type { RuntimeEnv } from "uagent/plugin-sdk/runtime";
export type { ReplyPayload } from "uagent/plugin-sdk/reply-runtime";
export type { ModelsProviderData } from "uagent/plugin-sdk/command-auth";
export type {
  BlockStreamingCoalesceConfig,
  DmPolicy,
  GroupPolicy,
} from "uagent/plugin-sdk/config-runtime";
export {
  DEFAULT_ACCOUNT_ID,
  buildChannelConfigSchema,
  createDedupeCache,
  parseStrictPositiveInteger,
  resolveClientIp,
  isTrustedProxyAddress,
} from "uagent/plugin-sdk/core";
export { buildComputedAccountStatusSnapshot } from "uagent/plugin-sdk/channel-status";
export { createAccountStatusSink } from "uagent/plugin-sdk/channel-lifecycle";
export { buildAgentMediaPayload } from "uagent/plugin-sdk/agent-media-payload";
export {
  buildModelsProviderData,
  listSkillCommandsForAgents,
  resolveControlCommandGate,
  resolveStoredModelOverride,
} from "uagent/plugin-sdk/command-auth";
export {
  GROUP_POLICY_BLOCKED_LABEL,
  isDangerousNameMatchingEnabled,
  loadSessionStore,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  resolveStorePath,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "uagent/plugin-sdk/config-runtime";
export { formatInboundFromLabel } from "uagent/plugin-sdk/channel-inbound";
export { logInboundDrop } from "uagent/plugin-sdk/channel-inbound";
export { createChannelPairingController } from "uagent/plugin-sdk/channel-pairing";
export {
  DM_GROUP_ACCESS_REASON,
  readStoreAllowFromForDmPolicy,
  resolveDmGroupAccessWithLists,
  resolveEffectiveAllowFromLists,
} from "uagent/plugin-sdk/channel-policy";
export { evaluateSenderGroupAccessForPolicy } from "uagent/plugin-sdk/group-access";
export { createChannelReplyPipeline } from "uagent/plugin-sdk/channel-reply-pipeline";
export { logTypingFailure } from "uagent/plugin-sdk/channel-feedback";
export { loadOutboundMediaFromUrl } from "uagent/plugin-sdk/outbound-media";
export { rawDataToString } from "uagent/plugin-sdk/browser-node-runtime";
export { chunkTextForOutbound } from "uagent/plugin-sdk/text-chunking";
export {
  DEFAULT_GROUP_HISTORY_LIMIT,
  buildPendingHistoryContextFromMap,
  clearHistoryEntriesIfEnabled,
  recordPendingHistoryEntryIfEnabled,
} from "uagent/plugin-sdk/reply-history";
export { normalizeAccountId, resolveThreadSessionKeys } from "uagent/plugin-sdk/routing";
export { resolveAllowlistMatchSimple } from "uagent/plugin-sdk/allow-from";
export { registerPluginHttpRoute } from "uagent/plugin-sdk/webhook-targets";
export {
  isRequestBodyLimitError,
  readRequestBodyWithLimit,
} from "uagent/plugin-sdk/webhook-ingress";
export {
  applyAccountNameToChannelSection,
  applySetupAccountConfigPatch,
  migrateBaseNameToDefaultAccount,
} from "uagent/plugin-sdk/setup";
export {
  getAgentScopedMediaLocalRoots,
  resolveChannelMediaMaxBytes,
} from "uagent/plugin-sdk/media-runtime";
export { normalizeProviderId } from "uagent/plugin-sdk/provider-model-shared";
export { registerSlashCommandRoute } from "./src/mattermost/slash-state.js";
export { setMattermostRuntime } from "./src/runtime.js";
