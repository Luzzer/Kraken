import { describe, expect, it } from "vitest";
import { buildPlatformRuntimeLogHints, buildPlatformServiceStartHints } from "./runtime-hints.js";

describe("buildPlatformRuntimeLogHints", () => {
  it("renders launchd log hints on darwin", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "darwin",
        env: {
          UAGENT_STATE_DIR: "/tmp/uagent-state",
          UAGENT_LOG_PREFIX: "gateway",
        },
        systemdServiceName: "uagent-gateway",
        windowsTaskName: "UAGENT Gateway",
      }),
    ).toEqual([
      "Launchd stdout (if installed): /tmp/uagent-state/logs/gateway.log",
      "Launchd stderr (if installed): /tmp/uagent-state/logs/gateway.err.log",
    ]);
  });

  it("renders systemd and windows hints by platform", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "linux",
        systemdServiceName: "uagent-gateway",
        windowsTaskName: "UAGENT Gateway",
      }),
    ).toEqual(["Logs: journalctl --user -u uagent-gateway.service -n 200 --no-pager"]);
    expect(
      buildPlatformRuntimeLogHints({
        platform: "win32",
        systemdServiceName: "uagent-gateway",
        windowsTaskName: "UAGENT Gateway",
      }),
    ).toEqual(['Logs: schtasks /Query /TN "UAGENT Gateway" /V /FO LIST']);
  });
});

describe("buildPlatformServiceStartHints", () => {
  it("builds platform-specific service start hints", () => {
    expect(
      buildPlatformServiceStartHints({
        platform: "darwin",
        installCommand: "uagent gateway install",
        startCommand: "uagent gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.uagent.gateway.plist",
        systemdServiceName: "uagent-gateway",
        windowsTaskName: "UAGENT Gateway",
      }),
    ).toEqual([
      "uagent gateway install",
      "uagent gateway",
      "launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.uagent.gateway.plist",
    ]);
    expect(
      buildPlatformServiceStartHints({
        platform: "linux",
        installCommand: "uagent gateway install",
        startCommand: "uagent gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.uagent.gateway.plist",
        systemdServiceName: "uagent-gateway",
        windowsTaskName: "UAGENT Gateway",
      }),
    ).toEqual([
      "uagent gateway install",
      "uagent gateway",
      "systemctl --user start uagent-gateway.service",
    ]);
  });
});
