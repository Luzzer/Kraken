import { definePluginEntry } from "uagent/plugin-sdk/core";

export default definePluginEntry({
  id: "voice-call",
  name: "Voice Call",
  description: "Voice call channel plugin",
  register(api) {
    api.registerCli(() => {}, { commands: ["voicecall"] });
  },
});
