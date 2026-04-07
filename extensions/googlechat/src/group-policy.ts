import { resolveChannelGroupRequireMention } from "uagent/plugin-sdk/channel-policy";
import type { UAGENTConfig } from "uagent/plugin-sdk/core";

type GoogleChatGroupContext = {
  cfg: UAGENTConfig;
  accountId?: string | null;
  groupId?: string | null;
};

export function resolveGoogleChatGroupRequireMention(params: GoogleChatGroupContext): boolean {
  return resolveChannelGroupRequireMention({
    cfg: params.cfg,
    channel: "googlechat",
    groupId: params.groupId,
    accountId: params.accountId,
  });
}
