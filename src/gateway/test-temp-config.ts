import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { clearConfigCache, resetConfigRuntimeState } from "../config/config.js";
import { clearSecretsRuntimeSnapshot } from "../secrets/runtime.js";

export async function withTempConfig(params: {
  cfg: unknown;
  run: () => Promise<void>;
  prefix?: string;
}): Promise<void> {
  const prevConfigPath = process.env.UAGENT_CONFIG_PATH;

  const dir = await mkdtemp(path.join(os.tmpdir(), params.prefix ?? "uagent-test-config-"));
  const configPath = path.join(dir, "uagent.json");

  process.env.UAGENT_CONFIG_PATH = configPath;

  try {
    await writeFile(configPath, JSON.stringify(params.cfg, null, 2), "utf-8");
    clearConfigCache();
    resetConfigRuntimeState();
    clearSecretsRuntimeSnapshot();
    await params.run();
  } finally {
    if (prevConfigPath === undefined) {
      delete process.env.UAGENT_CONFIG_PATH;
    } else {
      process.env.UAGENT_CONFIG_PATH = prevConfigPath;
    }
    clearConfigCache();
    resetConfigRuntimeState();
    clearSecretsRuntimeSnapshot();
    await rm(dir, { recursive: true, force: true });
  }
}
