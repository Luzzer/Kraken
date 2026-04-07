import { defineSetupPluginEntry } from "uagent/plugin-sdk/core";
import { qaChannelPlugin } from "./src/channel.js";

export default defineSetupPluginEntry(qaChannelPlugin);
