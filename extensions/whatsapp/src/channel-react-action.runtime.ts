import { readStringParam } from "uagent/plugin-sdk/channel-actions";
import type { UAGENTConfig } from "uagent/plugin-sdk/config-runtime";

export { resolveReactionMessageId } from "uagent/plugin-sdk/channel-actions";
export { handleWhatsAppAction } from "./action-runtime.js";
export { normalizeWhatsAppTarget } from "./normalize.js";
export { readStringParam, type UAGENTConfig };
