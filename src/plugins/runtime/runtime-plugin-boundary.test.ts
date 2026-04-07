import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createJiti: vi.fn(),
  loadConfig: vi.fn(() => ({})),
  loadPluginManifestRegistry: vi.fn(() => ({ plugins: [] })),
  resolvePluginSdkAliasFile: vi.fn(),
  resolvePluginSdkScopedAliasMap: vi.fn(),
  buildPluginLoaderJitiOptions: vi.fn((aliasMap: Record<string, string>) => ({ alias: aliasMap })),
  shouldPreferNativeJiti: vi.fn(() => false),
}));

vi.mock("jiti", () => ({
  createJiti: (...args: Parameters<typeof mocks.createJiti>) => mocks.createJiti(...args),
}));

vi.mock("../../config/config.js", () => ({
  loadConfig: () => mocks.loadConfig(),
}));

vi.mock("../manifest-registry.js", () => ({
  loadPluginManifestRegistry: () => mocks.loadPluginManifestRegistry(),
}));

vi.mock("../sdk-alias.js", async () => {
  const actual = await vi.importActual<typeof import("../sdk-alias.js")>("../sdk-alias.js");
  return {
    ...actual,
    resolvePluginSdkAliasFile: (...args: Parameters<typeof mocks.resolvePluginSdkAliasFile>) =>
      mocks.resolvePluginSdkAliasFile(...args),
    resolvePluginSdkScopedAliasMap: (
      ...args: Parameters<typeof mocks.resolvePluginSdkScopedAliasMap>
    ) => mocks.resolvePluginSdkScopedAliasMap(...args),
    buildPluginLoaderJitiOptions: (
      ...args: Parameters<typeof mocks.buildPluginLoaderJitiOptions>
    ) => mocks.buildPluginLoaderJitiOptions(...args),
    shouldPreferNativeJiti: (...args: Parameters<typeof mocks.shouldPreferNativeJiti>) =>
      mocks.shouldPreferNativeJiti(...args),
  };
});

import { getPluginBoundaryJiti } from "./runtime-plugin-boundary.js";

describe("getPluginBoundaryJiti", () => {
  it("normalizes Windows alias targets before creating the loader", () => {
    mocks.createJiti.mockReset();
    mocks.resolvePluginSdkAliasFile.mockReturnValue(String.raw`C:\repo\dist\plugin-sdk\root-alias.cjs`);
    mocks.resolvePluginSdkScopedAliasMap.mockReturnValue({
      "uagent/plugin-sdk/provider-onboard": String.raw`C:\repo\dist\plugin-sdk\provider-onboard.js`,
    });
    mocks.createJiti.mockReturnValue(() => ({}));

    const platformSpy = vi.spyOn(process, "platform", "get").mockReturnValue("win32");

    try {
      getPluginBoundaryJiti(String.raw`C:\repo\dist\runtime-api.js`, new Map());
    } finally {
      platformSpy.mockRestore();
    }

    expect(mocks.createJiti).toHaveBeenCalledTimes(1);
    expect(mocks.createJiti.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({
        alias: expect.objectContaining({
          "uagent/plugin-sdk": "C:/repo/dist/plugin-sdk/root-alias.cjs",
          "@uagent/plugin-sdk": "C:/repo/dist/plugin-sdk/root-alias.cjs",
          "uagent/plugin-sdk/provider-onboard": "C:/repo/dist/plugin-sdk/provider-onboard.js",
        }),
      }),
    );
  });
});
