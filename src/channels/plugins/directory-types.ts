import type { UAGENTConfig } from "../../config/types.js";

export type DirectoryConfigParams = {
  cfg: UAGENTConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
};
