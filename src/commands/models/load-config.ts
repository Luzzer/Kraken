import { resolveCommandConfigWithSecrets } from "../../cli/command-config-resolution.js";
import type { RuntimeEnv } from "../../runtime.js";
import {
  getRuntimeConfig,
  readSourceConfigSnapshotForWrite,
  setRuntimeConfigSnapshot,
  type UAGENTConfig,
  getModelsCommandSecretTargetIds,
} from "./load-config.runtime.js";

export type LoadedModelsConfig = {
  sourceConfig: UAGENTConfig;
  resolvedConfig: UAGENTConfig;
  diagnostics: string[];
};

async function loadSourceConfigSnapshot(fallback: UAGENTConfig): Promise<UAGENTConfig> {
  try {
    const { snapshot } = await readSourceConfigSnapshotForWrite();
    if (snapshot.valid) {
      return snapshot.sourceConfig;
    }
  } catch {
    // Fall back to runtime-loaded config if source snapshot cannot be read.
  }
  return fallback;
}

export async function loadModelsConfigWithSource(params: {
  commandName: string;
  runtime?: RuntimeEnv;
}): Promise<LoadedModelsConfig> {
  const runtimeConfig = getRuntimeConfig();
  const sourceConfig = await loadSourceConfigSnapshot(runtimeConfig);
  const { resolvedConfig, diagnostics } = await resolveCommandConfigWithSecrets({
    config: runtimeConfig,
    commandName: params.commandName,
    targetIds: getModelsCommandSecretTargetIds(),
    runtime: params.runtime,
  });
  setRuntimeConfigSnapshot(resolvedConfig, sourceConfig);
  return {
    sourceConfig,
    resolvedConfig,
    diagnostics,
  };
}

export async function loadModelsConfig(params: {
  commandName: string;
  runtime?: RuntimeEnv;
}): Promise<UAGENTConfig> {
  return (await loadModelsConfigWithSource(params)).resolvedConfig;
}
