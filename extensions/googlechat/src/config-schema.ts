import { buildChannelConfigSchema, GoogleChatConfigSchema } from "uagent/plugin-sdk/googlechat";

export const GoogleChatChannelConfigSchema = buildChannelConfigSchema(GoogleChatConfigSchema);
