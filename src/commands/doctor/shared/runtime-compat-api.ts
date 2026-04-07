import { isDeepStrictEqual } from "node:util";
import type { UAGENTConfig } from "../../../config/types.js";
import { applyLegacyDoctorMigrations } from "./legacy-config-compat.js";
import { normalizeCompatibilityConfigValues } from "./legacy-config-core-migrate.js";

export function applyRuntimeLegacyConfigMigrations(raw: unknown): {
  next: Record<string, unknown> | null;
  changes: string[];
} {
  if (!raw || typeof raw !== "object") {
    return { next: null, changes: [] };
  }

  const original = raw as Record<string, unknown>;
  const migrated = applyLegacyDoctorMigrations(original);
  const base = (migrated.next ?? original) as UAGENTConfig;
  const normalized = normalizeCompatibilityConfigValues(base);
  const next = normalized.config as UAGENTConfig & Record<string, unknown>;
  const changes = [...migrated.changes, ...normalized.changes];

  if (changes.length === 0 || isDeepStrictEqual(next, original)) {
    return { next: null, changes: [] };
  }
  return { next, changes };
}
