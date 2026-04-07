import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cleanupTrackedTempDirs, makeTrackedTempDir } from "./test-helpers/fs-fixtures.js";

type StageBundledPluginRuntimeDeps = (params?: { cwd?: string; repoRoot?: string }) => void;

async function loadStageBundledPluginRuntimeDeps(): Promise<StageBundledPluginRuntimeDeps> {
  const moduleUrl = new URL("../../scripts/stage-bundled-plugin-runtime-deps.mjs", import.meta.url);
  const loaded = (await import(moduleUrl.href)) as {
    stageBundledPluginRuntimeDeps: StageBundledPluginRuntimeDeps;
  };
  return loaded.stageBundledPluginRuntimeDeps;
}

const tempDirs: string[] = [];

function makeRepoRoot(prefix: string): string {
  return makeTrackedTempDir(prefix, tempDirs);
}

function writeRepoFile(repoRoot: string, relativePath: string, value: string) {
  const fullPath = path.join(repoRoot, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, value, "utf8");
}

afterEach(() => {
  cleanupTrackedTempDirs(tempDirs);
});

describe("stageBundledPluginRuntimeDeps", () => {
  it("drops Lark SDK type cargo while keeping runtime entrypoints", () => {
    const repoRoot = makeRepoRoot("uagent-stage-bundled-runtime-deps-");

    writeRepoFile(
      repoRoot,
      "dist/extensions/feishu/package.json",
      JSON.stringify(
        {
          name: "@uagent/feishu",
          version: "2026.4.6",
          dependencies: {
            "@larksuiteoapi/node-sdk": "^1.60.0",
          },
          uagent: {
            bundle: {
              stageRuntimeDependencies: true,
            },
          },
        },
        null,
        2,
      ),
    );

    writeRepoFile(
      repoRoot,
      "node_modules/@larksuiteoapi/node-sdk/package.json",
      JSON.stringify(
        {
          name: "@larksuiteoapi/node-sdk",
          version: "1.60.0",
          main: "./lib/index.js",
          module: "./es/index.js",
          types: "./types",
        },
        null,
        2,
      ),
    );
    writeRepoFile(
      repoRoot,
      "node_modules/@larksuiteoapi/node-sdk/lib/index.js",
      "export const runtime = true;\n",
    );
    writeRepoFile(
      repoRoot,
      "node_modules/@larksuiteoapi/node-sdk/es/index.js",
      "export const moduleRuntime = true;\n",
    );
    writeRepoFile(
      repoRoot,
      "node_modules/@larksuiteoapi/node-sdk/types/index.d.ts",
      "export interface HugeTypeSurface {}\n",
    );

    return loadStageBundledPluginRuntimeDeps().then((stageBundledPluginRuntimeDeps) => {
      stageBundledPluginRuntimeDeps({ repoRoot });

      const stagedRoot = path.join(
        repoRoot,
        "dist",
        "extensions",
        "feishu",
        "node_modules",
        "@larksuiteoapi",
        "node-sdk",
      );
      expect(fs.existsSync(path.join(stagedRoot, "lib", "index.js"))).toBe(true);
      expect(fs.existsSync(path.join(stagedRoot, "es", "index.js"))).toBe(true);
      expect(fs.existsSync(path.join(stagedRoot, "types"))).toBe(false);
    });
  });

  it("accepts root-mirrored runtime deps without staging local node_modules contents", () => {
    const repoRoot = makeRepoRoot("uagent-stage-root-mirror-runtime-deps-");

    writeRepoFile(
      repoRoot,
      "package.json",
      JSON.stringify(
        {
          name: "uagent",
          version: "2026.4.6",
          dependencies: {
            "@aws-sdk/client-bedrock": "3.1024.0",
          },
        },
        null,
        2,
      ),
    );

    writeRepoFile(
      repoRoot,
      "dist/extensions/amazon-bedrock/package.json",
      JSON.stringify(
        {
          name: "@uagent/amazon-bedrock-provider",
          version: "2026.4.6",
          dependencies: {
            "@aws-sdk/client-bedrock": "3.1024.0",
          },
          uagent: {
            bundle: {
              stageRuntimeDependencies: true,
            },
            releaseChecks: {
              rootDependencyMirrorAllowlist: ["@aws-sdk/client-bedrock"],
            },
          },
        },
        null,
        2,
      ),
    );

    return loadStageBundledPluginRuntimeDeps().then((stageBundledPluginRuntimeDeps) => {
      stageBundledPluginRuntimeDeps({ repoRoot });

      const stagedRoot = path.join(repoRoot, "dist", "extensions", "amazon-bedrock");
      expect(fs.existsSync(path.join(stagedRoot, ".uagent-runtime-deps-stamp.json"))).toBe(true);
      expect(fs.readdirSync(path.join(stagedRoot, "node_modules"))).toEqual([]);
    });
  });
});
