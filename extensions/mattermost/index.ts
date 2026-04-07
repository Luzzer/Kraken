import {
  defineBundledChannelEntry,
  loadBundledEntryExportSync,
} from "uagent/plugin-sdk/channel-entry-contract";
import type { UAGENTPluginApi } from "uagent/plugin-sdk/channel-entry-contract";

function registerSlashCommandRoute(api: UAGENTPluginApi): void {
  const register = loadBundledEntryExportSync<(api: UAGENTPluginApi) => void>(import.meta.url, {
    specifier: "./runtime-api.js",
    exportName: "registerSlashCommandRoute",
  });
  register(api);
}

export default defineBundledChannelEntry({
  id: "mattermost",
  name: "Mattermost",
  description: "Mattermost channel plugin",
  importMetaUrl: import.meta.url,
  plugin: {
    specifier: "./channel-plugin-api.js",
    exportName: "mattermostPlugin",
  },
  secrets: {
    specifier: "./src/secret-contract.js",
    exportName: "channelSecrets",
  },
  runtime: {
    specifier: "./runtime-api.js",
    exportName: "setMattermostRuntime",
  },
  registerFull(api) {
    // Actual slash-command registration happens after the monitor connects and
    // knows the team id; the route itself can be wired here.
    registerSlashCommandRoute(api);
  },
});
