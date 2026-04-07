export { DEFAULT_ACCOUNT_ID } from "uagent/plugin-sdk/account-id";
export {
  buildTokenChannelStatusSummary,
  PAIRING_APPROVED_MESSAGE,
  projectCredentialSnapshotFields,
  resolveConfiguredFromCredentialStatuses,
} from "uagent/plugin-sdk/channel-status";
export { createScopedChannelConfigAdapter } from "uagent/plugin-sdk/channel-config-helpers";
export type { ChannelPlugin } from "uagent/plugin-sdk/channel-core";
export type { UAGENTConfig } from "uagent/plugin-sdk/config-runtime";

const DISCORD_CHANNEL_META = {
  id: "discord",
  label: "Discord",
  selectionLabel: "Discord (Bot API)",
  detailLabel: "Discord Bot",
  docsPath: "/channels/discord",
  docsLabel: "discord",
  blurb: "very well supported right now.",
  systemImage: "bubble.left.and.bubble.right",
  markdownCapable: true,
} as const;

export function getChatChannelMeta(id: string) {
  if (id !== DISCORD_CHANNEL_META.id) {
    throw new Error(`Unsupported Discord channel meta lookup: ${id}`);
  }
  return DISCORD_CHANNEL_META;
}
