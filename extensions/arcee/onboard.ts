import {
  createModelCatalogPresetAppliers,
  type UAGENTConfig,
} from "uagent/plugin-sdk/provider-onboard";
import { ARCEE_BASE_URL } from "./api.js";
import {
  buildArceeCatalogModels,
  buildArceeOpenRouterCatalogModels,
  OPENROUTER_BASE_URL,
} from "./provider-catalog.js";

export const ARCEE_DEFAULT_MODEL_REF = "arcee/trinity-large-thinking";
export const ARCEE_OPENROUTER_DEFAULT_MODEL_REF = "arcee/trinity-large-thinking";

const arceePresetAppliers = createModelCatalogPresetAppliers({
  primaryModelRef: ARCEE_DEFAULT_MODEL_REF,
  resolveParams: (_cfg: UAGENTConfig) => ({
    providerId: "arcee",
    api: "openai-completions",
    baseUrl: ARCEE_BASE_URL,
    catalogModels: buildArceeCatalogModels(),
    aliases: [{ modelRef: ARCEE_DEFAULT_MODEL_REF, alias: "Arcee AI" }],
  }),
});

const arceeOpenRouterPresetAppliers = createModelCatalogPresetAppliers({
  primaryModelRef: ARCEE_OPENROUTER_DEFAULT_MODEL_REF,
  resolveParams: (_cfg: UAGENTConfig) => ({
    providerId: "arcee",
    api: "openai-completions",
    baseUrl: OPENROUTER_BASE_URL,
    catalogModels: buildArceeOpenRouterCatalogModels(),
    aliases: [{ modelRef: ARCEE_OPENROUTER_DEFAULT_MODEL_REF, alias: "Arcee AI (OpenRouter)" }],
  }),
});

export function applyArceeProviderConfig(cfg: UAGENTConfig): UAGENTConfig {
  return arceePresetAppliers.applyProviderConfig(cfg);
}

export function applyArceeConfig(cfg: UAGENTConfig): UAGENTConfig {
  return arceePresetAppliers.applyConfig(cfg);
}

export function applyArceeOpenRouterConfig(cfg: UAGENTConfig): UAGENTConfig {
  return arceeOpenRouterPresetAppliers.applyConfig(cfg);
}
