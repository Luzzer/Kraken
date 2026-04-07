import { describe, expect, it } from "vitest";
import {
  ensureUAGENTExecMarkerOnProcess,
  markUAGENTExecEnv,
  UAGENT_CLI_ENV_VALUE,
  UAGENT_CLI_ENV_VAR,
} from "./uagent-exec-env.js";

describe("markUAGENTExecEnv", () => {
  it("returns a cloned env object with the exec marker set", () => {
    const env = { PATH: "/usr/bin", UAGENT_CLI: "0" };
    const marked = markUAGENTExecEnv(env);

    expect(marked).toEqual({
      PATH: "/usr/bin",
      UAGENT_CLI: UAGENT_CLI_ENV_VALUE,
    });
    expect(marked).not.toBe(env);
    expect(env.UAGENT_CLI).toBe("0");
  });
});

describe("ensureUAGENTExecMarkerOnProcess", () => {
  it.each([
    {
      name: "mutates and returns the provided process env",
      env: { PATH: "/usr/bin" } as NodeJS.ProcessEnv,
    },
    {
      name: "overwrites an existing marker on the provided process env",
      env: { PATH: "/usr/bin", [UAGENT_CLI_ENV_VAR]: "0" } as NodeJS.ProcessEnv,
    },
  ])("$name", ({ env }) => {
    expect(ensureUAGENTExecMarkerOnProcess(env)).toBe(env);
    expect(env[UAGENT_CLI_ENV_VAR]).toBe(UAGENT_CLI_ENV_VALUE);
  });

  it("defaults to mutating process.env when no env object is provided", () => {
    const previous = process.env[UAGENT_CLI_ENV_VAR];
    delete process.env[UAGENT_CLI_ENV_VAR];

    try {
      expect(ensureUAGENTExecMarkerOnProcess()).toBe(process.env);
      expect(process.env[UAGENT_CLI_ENV_VAR]).toBe(UAGENT_CLI_ENV_VALUE);
    } finally {
      if (previous === undefined) {
        delete process.env[UAGENT_CLI_ENV_VAR];
      } else {
        process.env[UAGENT_CLI_ENV_VAR] = previous;
      }
    }
  });
});
