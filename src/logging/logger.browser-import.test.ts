import { afterEach, describe, expect, it, vi } from "vitest";
import { importFreshModule } from "../../test/helpers/import-fresh.js";

type LoggerModule = typeof import("./logger.js");

const originalGetBuiltinModule = (
  process as NodeJS.Process & { getBuiltinModule?: (id: string) => unknown }
).getBuiltinModule;

async function importBrowserSafeLogger(params?: {
  resolvePreferredUAGENTTmpDir?: ReturnType<typeof vi.fn>;
}): Promise<{
  module: LoggerModule;
  resolvePreferredUAGENTTmpDir: ReturnType<typeof vi.fn>;
}> {
  const resolvePreferredUAGENTTmpDir =
    params?.resolvePreferredUAGENTTmpDir ??
    vi.fn(() => {
      throw new Error("resolvePreferredUAGENTTmpDir should not run during browser-safe import");
    });

  vi.doMock("../infra/tmp-uagent-dir.js", async () => {
    const actual = await vi.importActual<typeof import("../infra/tmp-uagent-dir.js")>(
      "../infra/tmp-uagent-dir.js",
    );
    return {
      ...actual,
      resolvePreferredUAGENTTmpDir,
    };
  });

  Object.defineProperty(process, "getBuiltinModule", {
    configurable: true,
    value: undefined,
  });

  const module = await importFreshModule<LoggerModule>(
    import.meta.url,
    "./logger.js?scope=browser-safe",
  );
  return { module, resolvePreferredUAGENTTmpDir };
}

describe("logging/logger browser-safe import", () => {
  afterEach(() => {
    vi.doUnmock("../infra/tmp-uagent-dir.js");
    Object.defineProperty(process, "getBuiltinModule", {
      configurable: true,
      value: originalGetBuiltinModule,
    });
  });

  it("does not resolve the preferred temp dir at import time when node fs is unavailable", async () => {
    const { module, resolvePreferredUAGENTTmpDir } = await importBrowserSafeLogger();

    expect(resolvePreferredUAGENTTmpDir).not.toHaveBeenCalled();
    expect(module.DEFAULT_LOG_DIR).toBe("/tmp/uagent");
    expect(module.DEFAULT_LOG_FILE).toBe("/tmp/uagent/uagent.log");
  });

  it("disables file logging when imported in a browser-like environment", async () => {
    const { module, resolvePreferredUAGENTTmpDir } = await importBrowserSafeLogger();

    expect(module.getResolvedLoggerSettings()).toMatchObject({
      level: "silent",
      file: "/tmp/uagent/uagent.log",
    });
    expect(module.isFileLogLevelEnabled("info")).toBe(false);
    expect(() => module.getLogger().info("browser-safe")).not.toThrow();
    expect(resolvePreferredUAGENTTmpDir).not.toHaveBeenCalled();
  });
});
