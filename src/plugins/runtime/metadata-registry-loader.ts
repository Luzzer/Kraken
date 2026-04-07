import type { UAGENTConfig } from "../../config/config.js";
import { loadUAGENTPlugins } from "../loader.js";
import type { PluginRegistry } from "../registry.js";
import { buildPluginRuntimeLoadOptions, resolvePluginRuntimeLoadContext } from "./load-context.js";

export function loadPluginMetadataRegistrySnapshot(options?: {
  config?: UAGENTConfig;
  activationSourceConfig?: UAGENTConfig;
  env?: NodeJS.ProcessEnv;
  workspaceDir?: string;
  onlyPluginIds?: string[];
  loadModules?: boolean;
}): PluginRegistry {
  const context = resolvePluginRuntimeLoadContext(options);

  return loadUAGENTPlugins(
    buildPluginRuntimeLoadOptions(context, {
      throwOnLoadError: true,
      cache: false,
      activate: false,
      mode: "validate",
      loadModules: options?.loadModules,
      ...(options?.onlyPluginIds?.length ? { onlyPluginIds: options.onlyPluginIds } : {}),
    }),
  );
}
