import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

export function createSharedCoreVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/shared/**/*.test.ts"], {
    dir: "src",
    env,
    includeUAGENTRuntimeSetup: false,
    name: "shared-core",
    passWithNoTests: true,
  });
}

export default createSharedCoreVitestConfig();
