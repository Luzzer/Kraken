import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { withTempDir } from "./test-helpers/temp-dir.js";
import {
  ensureDir,
  resolveConfigDir,
  resolveHomeDir,
  resolveUserPath,
  shortenHomeInString,
  shortenHomePath,
  sleep,
} from "./utils.js";

describe("ensureDir", () => {
  it("creates nested directory", async () => {
    await withTempDir({ prefix: "uagent-test-" }, async (tmp) => {
      const target = path.join(tmp, "nested", "dir");
      await ensureDir(target);
      expect(fs.existsSync(target)).toBe(true);
    });
  });
});

describe("sleep", () => {
  it("resolves after delay using fake timers", async () => {
    vi.useFakeTimers();
    const promise = sleep(1000);
    vi.advanceTimersByTime(1000);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });
});

describe("resolveConfigDir", () => {
  it("prefers ~/.uagent when legacy dir is missing", async () => {
    await withTempDir({ prefix: "uagent-config-dir-" }, async (root) => {
      const newDir = path.join(root, ".uagent");
      await fs.promises.mkdir(newDir, { recursive: true });
      const resolved = resolveConfigDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(newDir);
    });
  });

  it("expands UAGENT_STATE_DIR using the provided env", () => {
    const env = {
      HOME: "/tmp/uagent-home",
      UAGENT_STATE_DIR: "~/state",
    } as NodeJS.ProcessEnv;

    expect(resolveConfigDir(env)).toBe(path.resolve("/tmp/uagent-home", "state"));
  });
});

describe("resolveHomeDir", () => {
  it("prefers UAGENT_HOME over HOME", () => {
    vi.stubEnv("UAGENT_HOME", "/srv/uagent-home");
    vi.stubEnv("HOME", "/home/other");

    expect(resolveHomeDir()).toBe(path.resolve("/srv/uagent-home"));

    vi.unstubAllEnvs();
  });
});

describe("shortenHomePath", () => {
  it("uses $UAGENT_HOME prefix when UAGENT_HOME is set", () => {
    vi.stubEnv("UAGENT_HOME", "/srv/uagent-home");
    vi.stubEnv("HOME", "/home/other");

    expect(shortenHomePath(`${path.resolve("/srv/uagent-home")}/.uagent/uagent.json`)).toBe(
      "$UAGENT_HOME/.uagent/uagent.json",
    );

    vi.unstubAllEnvs();
  });
});

describe("shortenHomeInString", () => {
  it("uses $UAGENT_HOME replacement when UAGENT_HOME is set", () => {
    vi.stubEnv("UAGENT_HOME", "/srv/uagent-home");
    vi.stubEnv("HOME", "/home/other");

    expect(
      shortenHomeInString(`config: ${path.resolve("/srv/uagent-home")}/.uagent/uagent.json`),
    ).toBe("config: $UAGENT_HOME/.uagent/uagent.json");

    vi.unstubAllEnvs();
  });
});

describe("resolveUserPath", () => {
  it("expands ~ to home dir", () => {
    expect(resolveUserPath("~", {}, () => "/Users/thoffman")).toBe(path.resolve("/Users/thoffman"));
  });

  it("expands ~/ to home dir", () => {
    expect(resolveUserPath("~/uagent", {}, () => "/Users/thoffman")).toBe(
      path.resolve("/Users/thoffman", "uagent"),
    );
  });

  it("resolves relative paths", () => {
    expect(resolveUserPath("tmp/dir")).toBe(path.resolve("tmp/dir"));
  });

  it("prefers UAGENT_HOME for tilde expansion", () => {
    vi.stubEnv("UAGENT_HOME", "/srv/uagent-home");
    vi.stubEnv("HOME", "/home/other");

    expect(resolveUserPath("~/uagent")).toBe(path.resolve("/srv/uagent-home", "uagent"));

    vi.unstubAllEnvs();
  });

  it("uses the provided env for tilde expansion", () => {
    const env = {
      HOME: "/tmp/uagent-home",
      UAGENT_HOME: "/srv/uagent-home",
    } as NodeJS.ProcessEnv;

    expect(resolveUserPath("~/uagent", env)).toBe(path.resolve("/srv/uagent-home", "uagent"));
  });

  it("keeps blank paths blank", () => {
    expect(resolveUserPath("")).toBe("");
    expect(resolveUserPath("   ")).toBe("");
  });

  it("returns empty string for undefined/null input", () => {
    expect(resolveUserPath(undefined as unknown as string)).toBe("");
    expect(resolveUserPath(null as unknown as string)).toBe("");
  });
});
