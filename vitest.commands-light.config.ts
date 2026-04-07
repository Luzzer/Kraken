import { commandsLightTestFiles } from "./vitest.commands-light-paths.mjs";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

export function createCommandsLightVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(commandsLightTestFiles, {
    dir: "src/commands",
    env,
    includeUAGENTRuntimeSetup: false,
    name: "commands-light",
    passWithNoTests: true,
  });
}

export default createCommandsLightVitestConfig();
