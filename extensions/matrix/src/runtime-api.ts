export {
  DEFAULT_ACCOUNT_ID,
  normalizeAccountId,
  normalizeOptionalAccountId,
} from "uagent/plugin-sdk/account-id";
export {
  createActionGate,
  jsonResult,
  readNumberParam,
  readReactionParams,
  readStringArrayParam,
  readStringParam,
} from "uagent/plugin-sdk/channel-actions";
export { buildChannelConfigSchema } from "uagent/plugin-sdk/channel-config-primitives";
export type { ChannelPlugin } from "uagent/plugin-sdk/channel-core";
export type {
  BaseProbeResult,
  ChannelDirectoryEntry,
  ChannelGroupContext,
  ChannelMessageActionAdapter,
  ChannelMessageActionContext,
  ChannelMessageActionName,
  ChannelMessageToolDiscovery,
  ChannelOutboundAdapter,
  ChannelResolveKind,
  ChannelResolveResult,
  ChannelToolSend,
} from "uagent/plugin-sdk/channel-contract";
export {
  formatLocationText,
  logInboundDrop,
  toLocationContext,
  type NormalizedLocation,
} from "uagent/plugin-sdk/channel-inbound";
export { resolveAckReaction, logTypingFailure } from "uagent/plugin-sdk/channel-feedback";
export type { ChannelSetupInput } from "uagent/plugin-sdk/setup";
export type {
  UAGENTConfig,
  ContextVisibilityMode,
  DmPolicy,
  GroupPolicy,
} from "uagent/plugin-sdk/config-runtime";
export type { GroupToolPolicyConfig } from "uagent/plugin-sdk/config-runtime";
export type { WizardPrompter } from "uagent/plugin-sdk/matrix-runtime-shared";
export type { SecretInput } from "uagent/plugin-sdk/secret-input";
export {
  GROUP_POLICY_BLOCKED_LABEL,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  warnMissingProviderGroupPolicyFallbackOnce,
} from "uagent/plugin-sdk/config-runtime";
export {
  addWildcardAllowFrom,
  formatDocsLink,
  hasConfiguredSecretInput,
  mergeAllowFromEntries,
  moveSingleAccountChannelSectionToDefaultAccount,
  promptAccountId,
  promptChannelAccessConfig,
} from "uagent/plugin-sdk/setup";
export type { RuntimeEnv } from "uagent/plugin-sdk/runtime";
export {
  assertHttpUrlTargetsPrivateNetwork,
  closeDispatcher,
  createPinnedDispatcher,
  isPrivateOrLoopbackHost,
  resolvePinnedHostnameWithPolicy,
  ssrfPolicyFromDangerouslyAllowPrivateNetwork,
  ssrfPolicyFromAllowPrivateNetwork,
  type LookupFn,
  type SsrFPolicy,
} from "uagent/plugin-sdk/ssrf-runtime";
export { dispatchReplyFromConfigWithSettledDispatcher } from "uagent/plugin-sdk/inbound-reply-dispatch";
export {
  ensureConfiguredAcpBindingReady,
  resolveConfiguredAcpBindingRecord,
} from "uagent/plugin-sdk/acp-binding-runtime";
export {
  buildProbeChannelStatusSummary,
  collectStatusIssuesFromLastError,
  PAIRING_APPROVED_MESSAGE,
} from "uagent/plugin-sdk/channel-status";
export {
  getSessionBindingService,
  resolveThreadBindingIdleTimeoutMsForChannel,
  resolveThreadBindingMaxAgeMsForChannel,
} from "uagent/plugin-sdk/conversation-runtime";
export { resolveOutboundSendDep } from "uagent/plugin-sdk/outbound-runtime";
export { resolveAgentIdFromSessionKey } from "uagent/plugin-sdk/routing";
export { chunkTextForOutbound } from "uagent/plugin-sdk/text-chunking";
export { createChannelReplyPipeline } from "uagent/plugin-sdk/channel-reply-pipeline";
export { loadOutboundMediaFromUrl } from "uagent/plugin-sdk/outbound-media";
export { normalizePollInput, type PollInput } from "uagent/plugin-sdk/media-runtime";
export { writeJsonFileAtomically } from "uagent/plugin-sdk/json-store";
export {
  buildChannelKeyCandidates,
  resolveChannelEntryMatch,
} from "uagent/plugin-sdk/channel-targets";
export {
  evaluateGroupRouteAccessForPolicy,
  resolveSenderScopedGroupPolicy,
} from "uagent/plugin-sdk/channel-policy";
export {
  formatZonedTimestamp,
  type PluginRuntime,
  type RuntimeLogger,
} from "uagent/plugin-sdk/matrix-runtime-shared";
export type { ReplyPayload } from "uagent/plugin-sdk/reply-runtime";
// resolveMatrixAccountStringValues already comes from plugin-sdk/matrix.
// Re-exporting auth-precedence here makes Jiti try to define the same export twice.

export function buildTimeoutAbortSignal(params: { timeoutMs?: number; signal?: AbortSignal }): {
  signal?: AbortSignal;
  cleanup: () => void;
} {
  const { timeoutMs, signal } = params;
  if (!timeoutMs && !signal) {
    return { signal: undefined, cleanup: () => {} };
  }
  if (!timeoutMs) {
    return { signal, cleanup: () => {} };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(controller.abort.bind(controller), timeoutMs);
  const onAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", onAbort, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId);
      signal?.removeEventListener("abort", onAbort);
    },
  };
}
