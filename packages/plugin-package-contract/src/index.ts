export type JsonObject = Record<string, unknown>;

export type ExternalPluginCompatibility = {
  pluginApiRange?: string;
  builtWithUAGENTVersion?: string;
  pluginSdkVersion?: string;
  minGatewayVersion?: string;
};

export type ExternalPluginValidationIssue = {
  fieldPath: string;
  message: string;
};

export type ExternalCodePluginValidationResult = {
  compatibility?: ExternalPluginCompatibility;
  issues: ExternalPluginValidationIssue[];
};

export const EXTERNAL_CODE_PLUGIN_REQUIRED_FIELD_PATHS = [
  "uagent.compat.pluginApi",
  "uagent.build.uagentVersion",
] as const;

function isRecord(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getTrimmedString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readUAGENTBlock(packageJson: unknown) {
  const root = isRecord(packageJson) ? packageJson : undefined;
  const uagent = isRecord(root?.uagent) ? root.uagent : undefined;
  const compat = isRecord(uagent?.compat) ? uagent.compat : undefined;
  const build = isRecord(uagent?.build) ? uagent.build : undefined;
  const install = isRecord(uagent?.install) ? uagent.install : undefined;
  return { root, uagent, compat, build, install };
}

export function normalizeExternalPluginCompatibility(
  packageJson: unknown,
): ExternalPluginCompatibility | undefined {
  const { root, compat, build, install } = readUAGENTBlock(packageJson);
  const version = getTrimmedString(root?.version);
  const minHostVersion = getTrimmedString(install?.minHostVersion);
  const compatibility: ExternalPluginCompatibility = {};

  const pluginApi = getTrimmedString(compat?.pluginApi);
  if (pluginApi) {
    compatibility.pluginApiRange = pluginApi;
  }

  const minGatewayVersion = getTrimmedString(compat?.minGatewayVersion) ?? minHostVersion;
  if (minGatewayVersion) {
    compatibility.minGatewayVersion = minGatewayVersion;
  }

  const builtWithUAGENTVersion = getTrimmedString(build?.uagentVersion) ?? version;
  if (builtWithUAGENTVersion) {
    compatibility.builtWithUAGENTVersion = builtWithUAGENTVersion;
  }

  const pluginSdkVersion = getTrimmedString(build?.pluginSdkVersion);
  if (pluginSdkVersion) {
    compatibility.pluginSdkVersion = pluginSdkVersion;
  }

  return Object.keys(compatibility).length > 0 ? compatibility : undefined;
}

export function listMissingExternalCodePluginFieldPaths(packageJson: unknown): string[] {
  const { compat, build } = readUAGENTBlock(packageJson);
  const missing: string[] = [];
  if (!getTrimmedString(compat?.pluginApi)) {
    missing.push("uagent.compat.pluginApi");
  }
  if (!getTrimmedString(build?.uagentVersion)) {
    missing.push("uagent.build.uagentVersion");
  }
  return missing;
}

export function validateExternalCodePluginPackageJson(
  packageJson: unknown,
): ExternalCodePluginValidationResult {
  const issues = listMissingExternalCodePluginFieldPaths(packageJson).map((fieldPath) => ({
    fieldPath,
    message: `${fieldPath} is required for external code plugins published to ClawHub.`,
  }));
  return {
    compatibility: normalizeExternalPluginCompatibility(packageJson),
    issues,
  };
}
