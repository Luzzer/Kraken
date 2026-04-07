import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

type PackageJson = {
  name?: string;
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

const UAGENT_VERSION_RANGE_RE = /^>=\d{4}\.\d{1,2}\.\d{1,2}(?:[-.][^"\s]+)?$/u;

function syncUAGENTDependencyRange(
  deps: Record<string, string> | undefined,
  targetVersion: string,
): boolean {
  const current = deps?.uagent;
  if (!current || current === "workspace:*" || !UAGENT_VERSION_RANGE_RE.test(current)) {
    return false;
  }
  const next = `>=${targetVersion}`;
  if (current === next) {
    return false;
  }
  deps.uagent = next;
  return true;
}

function syncMinHostVersion(pkg: PackageJson, targetVersion: string): boolean {
  const installConfig = pkg.uagent?.install;
  const current = installConfig?.minHostVersion;
  if (!current || !UAGENT_VERSION_RANGE_RE.test(current)) {
    return false;
  }
  const next = `>=${targetVersion}`;
  if (current === next) {
    return false;
  }
  installConfig.minHostVersion = next;
  return true;
}

function syncPluginApiVersion(pkg: PackageJson, targetVersion: string): boolean {
  const compat = pkg.uagent?.compat;
  const current = compat?.pluginApi;
  if (!current || !UAGENT_VERSION_RANGE_RE.test(current)) {
    return false;
  }
  const next = `>=${targetVersion}`;
  if (current === next) {
    return false;
  }
  compat.pluginApi = next;
  return true;
}

function syncBuildUAGENTVersion(pkg: PackageJson, targetVersion: string): boolean {
  const build = pkg.uagent?.build;
  const current = build?.uagentVersion;
  if (!current) {
    return false;
  }
  if (current === targetVersion) {
    return false;
  }
  build.uagentVersion = targetVersion;
  return true;
}

function ensureChangelogEntry(changelogPath: string, version: string): boolean {
  if (!existsSync(changelogPath)) {
    return false;
  }
  const content = readFileSync(changelogPath, "utf8");
  if (content.includes(`## ${version}`)) {
    return false;
  }
  const entry = `## ${version}\n\n### Changes\n- Version alignment with core UAGENT release numbers.\n\n`;
  if (content.startsWith("# Changelog\n\n")) {
    const next = content.replace("# Changelog\n\n", `# Changelog\n\n${entry}`);
    writeFileSync(changelogPath, next);
    return true;
  }
  const next = `# Changelog\n\n${entry}${content.trimStart()}`;
  writeFileSync(changelogPath, `${next}\n`);
  return true;
}

export function syncPluginVersions(rootDir = resolve(".")) {
  const rootPackagePath = join(rootDir, "package.json");
  const rootPackage = JSON.parse(readFileSync(rootPackagePath, "utf8")) as PackageJson;
  const targetVersion = rootPackage.version;
  if (!targetVersion) {
    throw new Error("Root package.json missing version.");
  }

  const extensionsDir = join(rootDir, "extensions");
  const dirs = readdirSync(extensionsDir, { withFileTypes: true }).filter((entry) =>
    entry.isDirectory(),
  );

  const updated: string[] = [];
  const changelogged: string[] = [];
  const skipped: string[] = [];

  for (const dir of dirs) {
    const packagePath = join(extensionsDir, dir.name, "package.json");
    let pkg: PackageJson;
    try {
      pkg = JSON.parse(readFileSync(packagePath, "utf8")) as PackageJson;
    } catch {
      continue;
    }

    if (!pkg.name) {
      skipped.push(dir.name);
      continue;
    }

    const changelogPath = join(extensionsDir, dir.name, "CHANGELOG.md");
    if (ensureChangelogEntry(changelogPath, targetVersion)) {
      changelogged.push(pkg.name);
    }

    const versionChanged = pkg.version !== targetVersion;
    const devDependencyChanged = syncUAGENTDependencyRange(pkg.devDependencies, targetVersion);
    const peerDependencyChanged = syncUAGENTDependencyRange(pkg.peerDependencies, targetVersion);
    const minHostVersionChanged = syncMinHostVersion(pkg, targetVersion);
    const pluginApiChanged = syncPluginApiVersion(pkg, targetVersion);
    const buildUAGENTVersionChanged = syncBuildUAGENTVersion(pkg, targetVersion);
    const packageChanged =
      versionChanged ||
      devDependencyChanged ||
      peerDependencyChanged ||
      minHostVersionChanged ||
      pluginApiChanged ||
      buildUAGENTVersionChanged;
    if (!packageChanged) {
      skipped.push(pkg.name);
      continue;
    }

    if (versionChanged) {
      pkg.version = targetVersion;
    }
    writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
    updated.push(pkg.name);
  }

  return {
    targetVersion,
    updated,
    changelogged,
    skipped,
  };
}

if (import.meta.main) {
  const summary = syncPluginVersions();
  console.log(
    `Synced plugin versions to ${summary.targetVersion}. Updated: ${summary.updated.length}. Changelogged: ${summary.changelogged.length}. Skipped: ${summary.skipped.length}.`,
  );
}
