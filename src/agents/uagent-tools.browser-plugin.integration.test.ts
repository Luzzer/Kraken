import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createBundledBrowserPluginFixture } from "../../test/helpers/browser-bundled-plugin-fixture.js";
import type { UAGENTConfig } from "../config/config.js";
import { clearPluginDiscoveryCache } from "../plugins/discovery.js";
import { clearPluginLoaderCache } from "../plugins/loader.js";
import { clearPluginManifestRegistryCache } from "../plugins/manifest-registry.js";
import { resetPluginRuntimeStateForTest } from "../plugins/runtime.js";
import { createUAGENTTools } from "./uagent-tools.js";

function resetPluginState() {
  clearPluginLoaderCache();
  clearPluginDiscoveryCache();
  clearPluginManifestRegistryCache();
  resetPluginRuntimeStateForTest();
}

describe("createUAGENTTools browser plugin integration", () => {
  let bundledFixture: ReturnType<typeof createBundledBrowserPluginFixture> | null = null;

  beforeEach(() => {
    bundledFixture = createBundledBrowserPluginFixture();
    vi.stubEnv("UAGENT_BUNDLED_PLUGINS_DIR", bundledFixture.rootDir);
    resetPluginState();
  });

  afterEach(() => {
    resetPluginState();
    vi.unstubAllEnvs();
    bundledFixture?.cleanup();
    bundledFixture = null;
  });

  it("loads the bundled browser plugin through normal plugin resolution", () => {
    const tools = createUAGENTTools({
      config: {
        plugins: {
          allow: ["browser"],
        },
      } as UAGENTConfig,
    });

    expect(tools.map((tool) => tool.name)).toContain("browser");
  });

  it("omits the browser tool when the bundled browser plugin is disabled", () => {
    const tools = createUAGENTTools({
      config: {
        plugins: {
          allow: ["browser"],
          entries: {
            browser: {
              enabled: false,
            },
          },
        },
      } as UAGENTConfig,
    });

    expect(tools.map((tool) => tool.name)).not.toContain("browser");
  });
});
