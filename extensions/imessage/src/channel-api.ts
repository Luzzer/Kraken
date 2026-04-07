import { formatTrimmedAllowFromEntries } from "uagent/plugin-sdk/channel-config-helpers";
import type { ChannelStatusIssue } from "uagent/plugin-sdk/channel-contract";
import { PAIRING_APPROVED_MESSAGE } from "uagent/plugin-sdk/channel-status";
import {
  DEFAULT_ACCOUNT_ID,
  getChatChannelMeta,
  type ChannelPlugin,
  type UAGENTConfig,
} from "uagent/plugin-sdk/core";
import { resolveChannelMediaMaxBytes } from "uagent/plugin-sdk/media-runtime";
import { collectStatusIssuesFromLastError } from "uagent/plugin-sdk/status-helpers";
import {
  resolveIMessageConfigAllowFrom,
  resolveIMessageConfigDefaultTo,
} from "./config-accessors.js";
import { looksLikeIMessageTargetId, normalizeIMessageMessagingTarget } from "./normalize.js";
export { chunkTextForOutbound } from "uagent/plugin-sdk/text-chunking";

export {
  collectStatusIssuesFromLastError,
  DEFAULT_ACCOUNT_ID,
  formatTrimmedAllowFromEntries,
  getChatChannelMeta,
  looksLikeIMessageTargetId,
  normalizeIMessageMessagingTarget,
  PAIRING_APPROVED_MESSAGE,
  resolveChannelMediaMaxBytes,
  resolveIMessageConfigAllowFrom,
  resolveIMessageConfigDefaultTo,
};

export type { ChannelPlugin, ChannelStatusIssue, UAGENTConfig };
