import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "uagent",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "uagent", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("leaves gateway --dev for subcommands after leading root options", () => {
    const res = parseCliProfileArgs([
      "node",
      "uagent",
      "--no-color",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual([
      "node",
      "uagent",
      "--no-color",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "uagent", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "uagent", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "uagent", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "uagent", "status"]);
  });

  it("parses interleaved --profile after the command token", () => {
    const res = parseCliProfileArgs(["node", "uagent", "status", "--profile", "work", "--deep"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "uagent", "status", "--deep"]);
  });

  it("parses interleaved --dev after the command token", () => {
    const res = parseCliProfileArgs(["node", "uagent", "status", "--dev"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "uagent", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "uagent", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "uagent", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "uagent", "--profile", "work", "--dev", "status"]],
    ["interleaved after command", ["node", "uagent", "status", "--profile", "work", "--dev"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".uagent-dev");
    expect(env.UAGENT_PROFILE).toBe("dev");
    expect(env.UAGENT_STATE_DIR).toBe(expectedStateDir);
    expect(env.UAGENT_CONFIG_PATH).toBe(path.join(expectedStateDir, "uagent.json"));
    expect(env.UAGENT_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      UAGENT_STATE_DIR: "/custom",
      UAGENT_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.UAGENT_STATE_DIR).toBe("/custom");
    expect(env.UAGENT_GATEWAY_PORT).toBe("19099");
    expect(env.UAGENT_CONFIG_PATH).toBe(path.join("/custom", "uagent.json"));
  });

  it("uses UAGENT_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      UAGENT_HOME: "/srv/uagent-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/uagent-home");
    expect(env.UAGENT_STATE_DIR).toBe(path.join(resolvedHome, ".uagent-work"));
    expect(env.UAGENT_CONFIG_PATH).toBe(
      path.join(resolvedHome, ".uagent-work", "uagent.json"),
    );
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "uagent doctor --fix",
      env: {},
      expected: "uagent doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "uagent doctor --fix",
      env: { UAGENT_PROFILE: "default" },
      expected: "uagent doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "uagent doctor --fix",
      env: { UAGENT_PROFILE: "Default" },
      expected: "uagent doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "uagent doctor --fix",
      env: { UAGENT_PROFILE: "bad profile" },
      expected: "uagent doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "uagent --profile work doctor --fix",
      env: { UAGENT_PROFILE: "work" },
      expected: "uagent --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "uagent --dev doctor",
      env: { UAGENT_PROFILE: "dev" },
      expected: "uagent --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("uagent doctor --fix", { UAGENT_PROFILE: "work" })).toBe(
      "uagent --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("uagent doctor --fix", { UAGENT_PROFILE: "  jbuagent  " })).toBe(
      "uagent --profile jbuagent doctor --fix",
    );
  });

  it("handles command with no args after uagent", () => {
    expect(formatCliCommand("uagent", { UAGENT_PROFILE: "test" })).toBe(
      "uagent --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm uagent doctor", { UAGENT_PROFILE: "work" })).toBe(
      "pnpm uagent --profile work doctor",
    );
  });

  it("inserts --container when a container hint is set", () => {
    expect(
      formatCliCommand("uagent gateway status --deep", { UAGENT_CONTAINER_HINT: "demo" }),
    ).toBe("uagent --container demo gateway status --deep");
  });

  it("preserves both --container and --profile hints", () => {
    expect(
      formatCliCommand("uagent doctor", {
        UAGENT_CONTAINER_HINT: "demo",
        UAGENT_PROFILE: "work",
      }),
    ).toBe("uagent --container demo doctor");
  });

  it("does not prepend --container for update commands", () => {
    expect(formatCliCommand("uagent update", { UAGENT_CONTAINER_HINT: "demo" })).toBe(
      "uagent update",
    );
    expect(
      formatCliCommand("pnpm uagent update --channel beta", { UAGENT_CONTAINER_HINT: "demo" }),
    ).toBe("pnpm uagent update --channel beta");
  });
});
