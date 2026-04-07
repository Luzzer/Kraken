// Private runtime barrel for the bundled Signal extension.
// Prefer narrower SDK subpaths plus local extension seams over the legacy signal barrel.

export type { ChannelMessageActionAdapter } from "uagent/plugin-sdk/channel-contract";
export { buildChannelConfigSchema, SignalConfigSchema } from "../config-api.js";
export { PAIRING_APPROVED_MESSAGE } from "uagent/plugin-sdk/channel-status";
import type { UAGENTConfig as RuntimeUAGENTConfig } from "uagent/plugin-sdk/config-runtime";
export type { RuntimeUAGENTConfig as UAGENTConfig };
export type { UAGENTPluginApi, PluginRuntime } from "uagent/plugin-sdk/core";
export type { ChannelPlugin } from "uagent/plugin-sdk/core";
export {
  DEFAULT_ACCOUNT_ID,
  applyAccountNameToChannelSection,
  deleteAccountFromConfigSection,
  emptyPluginConfigSchema,
  formatPairingApproveHint,
  getChatChannelMeta,
  migrateBaseNameToDefaultAccount,
  normalizeAccountId,
  setAccountEnabledInConfigSection,
} from "uagent/plugin-sdk/core";
export { resolveChannelMediaMaxBytes } from "uagent/plugin-sdk/media-runtime";
export { formatCliCommand, formatDocsLink } from "uagent/plugin-sdk/setup-tools";
export { chunkText } from "uagent/plugin-sdk/reply-runtime";
export { detectBinary } from "uagent/plugin-sdk/setup-tools";
export {
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
} from "uagent/plugin-sdk/config-runtime";
export {
  buildBaseAccountStatusSnapshot,
  buildBaseChannelStatusSummary,
  collectStatusIssuesFromLastError,
  createDefaultChannelRuntimeState,
} from "uagent/plugin-sdk/status-helpers";
export { normalizeE164 } from "uagent/plugin-sdk/text-runtime";
export { looksLikeSignalTargetId, normalizeSignalMessagingTarget } from "./normalize.js";
export {
  listEnabledSignalAccounts,
  listSignalAccountIds,
  resolveDefaultSignalAccountId,
  resolveSignalAccount,
} from "./accounts.js";
export { monitorSignalProvider } from "./monitor.js";
export { installSignalCli } from "./install-signal-cli.js";
export { probeSignal } from "./probe.js";
export { resolveSignalReactionLevel } from "./reaction-level.js";
export { removeReactionSignal, sendReactionSignal } from "./send-reactions.js";
export { sendMessageSignal } from "./send.js";
export { signalMessageActions } from "./message-actions.js";
export type { ResolvedSignalAccount } from "./accounts.js";
export type SignalAccountConfig = Omit<
  Exclude<NonNullable<RuntimeUAGENTConfig["channels"]>["signal"], undefined>,
  "accounts"
>;
