import { resolveActiveTalkProviderConfig } from "../../config/talk.js";
import type { UAGENTConfig } from "../../config/types.js";

export { resolveActiveTalkProviderConfig };

export function getRuntimeConfigSnapshot(): UAGENTConfig | null {
  return null;
}
