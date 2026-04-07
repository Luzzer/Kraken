import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { syncPluginVersions } from "../../scripts/sync-plugin-versions.js";
import { cleanupTempDirs, makeTempDir } from "../../test/helpers/temp-dir.js";

const tempDirs: string[] = [];

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

describe("syncPluginVersions", () => {
  afterEach(() => {
    cleanupTempDirs(tempDirs);
  });

  it("preserves workspace uagent devDependencies while bumping plugin host constraints", () => {
    const rootDir = makeTempDir(tempDirs, "uagent-sync-plugin-versions-");

    writeJson(path.join(rootDir, "package.json"), {
      name: "uagent",
      version: "2026.4.1",
    });
    writeJson(path.join(rootDir, "extensions/bluebubbles/package.json"), {
      name: "@uagent/bluebubbles",
      version: "2026.3.30",
      devDependencies: {
        uagent: "workspace:*",
      },
      peerDependencies: {
        uagent: ">=2026.3.30",
      },
      uagent: {
        install: {
          minHostVersion: ">=2026.3.30",
        },
        compat: {
          pluginApi: ">=2026.3.30",
        },
        build: {
          uagentVersion: "2026.3.30",
        },
      },
    });

    const summary = syncPluginVersions(rootDir);
    const updatedPackage = JSON.parse(
      fs.readFileSync(path.join(rootDir, "extensions/bluebubbles/package.json"), "utf8"),
    ) as {
      version?: string;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
      uagent?: {
        install?: {
          minHostVersion?: string;
        };
        compat?: {
          pluginApi?: string;
        };
        build?: {
          uagentVersion?: string;
        };
      };
    };

    expect(summary.updated).toContain("@uagent/bluebubbles");
    expect(updatedPackage.version).toBe("2026.4.1");
    expect(updatedPackage.devDependencies?.uagent).toBe("workspace:*");
    expect(updatedPackage.peerDependencies?.uagent).toBe(">=2026.4.1");
    expect(updatedPackage.uagent?.install?.minHostVersion).toBe(">=2026.4.1");
    expect(updatedPackage.uagent?.compat?.pluginApi).toBe(">=2026.4.1");
    expect(updatedPackage.uagent?.build?.uagentVersion).toBe("2026.4.1");
  });
});
