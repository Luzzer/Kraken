export const DEFAULT_PLUGIN_DISCOVERY_CACHE_MS = 1000;
export const DEFAULT_PLUGIN_MANIFEST_CACHE_MS = 1000;

export function shouldUsePluginSnapshotCache(env: NodeJS.ProcessEnv): boolean {
  if (env.UAGENT_DISABLE_PLUGIN_DISCOVERY_CACHE?.trim()) {
    return false;
  }
  if (env.UAGENT_DISABLE_PLUGIN_MANIFEST_CACHE?.trim()) {
    return false;
  }
  const discoveryCacheMs = env.UAGENT_PLUGIN_DISCOVERY_CACHE_MS?.trim();
  if (discoveryCacheMs === "0") {
    return false;
  }
  const manifestCacheMs = env.UAGENT_PLUGIN_MANIFEST_CACHE_MS?.trim();
  if (manifestCacheMs === "0") {
    return false;
  }
  return true;
}

export function resolvePluginCacheMs(rawValue: string | undefined, defaultMs: number): number {
  const raw = rawValue?.trim();
  if (raw === "" || raw === "0") {
    return 0;
  }
  if (!raw) {
    return defaultMs;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) {
    return defaultMs;
  }
  return Math.max(0, parsed);
}

export function resolvePluginSnapshotCacheTtlMs(env: NodeJS.ProcessEnv): number {
  const discoveryCacheMs = resolvePluginCacheMs(
    env.UAGENT_PLUGIN_DISCOVERY_CACHE_MS,
    DEFAULT_PLUGIN_DISCOVERY_CACHE_MS,
  );
  const manifestCacheMs = resolvePluginCacheMs(
    env.UAGENT_PLUGIN_MANIFEST_CACHE_MS,
    DEFAULT_PLUGIN_MANIFEST_CACHE_MS,
  );
  return Math.min(discoveryCacheMs, manifestCacheMs);
}

export function buildPluginSnapshotCacheEnvKey(env: NodeJS.ProcessEnv): string {
  return JSON.stringify({
    UAGENT_BUNDLED_PLUGINS_DIR: env.UAGENT_BUNDLED_PLUGINS_DIR ?? "",
    UAGENT_DISABLE_PLUGIN_DISCOVERY_CACHE: env.UAGENT_DISABLE_PLUGIN_DISCOVERY_CACHE ?? "",
    UAGENT_DISABLE_PLUGIN_MANIFEST_CACHE: env.UAGENT_DISABLE_PLUGIN_MANIFEST_CACHE ?? "",
    UAGENT_PLUGIN_DISCOVERY_CACHE_MS: env.UAGENT_PLUGIN_DISCOVERY_CACHE_MS ?? "",
    UAGENT_PLUGIN_MANIFEST_CACHE_MS: env.UAGENT_PLUGIN_MANIFEST_CACHE_MS ?? "",
    UAGENT_HOME: env.UAGENT_HOME ?? "",
    UAGENT_STATE_DIR: env.UAGENT_STATE_DIR ?? "",
    UAGENT_CONFIG_PATH: env.UAGENT_CONFIG_PATH ?? "",
    HOME: env.HOME ?? "",
    USERPROFILE: env.USERPROFILE ?? "",
    VITEST: env.VITEST ?? "",
  });
}
