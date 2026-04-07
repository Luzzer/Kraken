import { describe, expect, it } from "vitest";
import type { UAGENTConfig } from "../config/config.js";
import "./test-helpers/fast-core-tools.js";
import { createUAGENTTools } from "./uagent-tools.js";

describe("uagent-tools update_plan gating", () => {
  it("keeps update_plan disabled by default", () => {
    const tools = createUAGENTTools({
      config: {} as UAGENTConfig,
    });

    expect(tools.map((tool) => tool.name)).not.toContain("update_plan");
  });

  it("registers update_plan when explicitly enabled", () => {
    const tools = createUAGENTTools({
      config: {
        tools: {
          experimental: {
            planTool: true,
          },
        },
      } as UAGENTConfig,
    });

    const updatePlan = tools.find((tool) => tool.name === "update_plan");
    expect(updatePlan?.displaySummary).toBe("Track a short structured work plan.");
  });

  it("auto-enables update_plan for OpenAI-family providers", () => {
    const openaiTools = createUAGENTTools({
      config: {} as UAGENTConfig,
      modelProvider: "openai",
    });
    const codexTools = createUAGENTTools({
      config: {} as UAGENTConfig,
      modelProvider: "openai-codex",
    });
    const anthropicTools = createUAGENTTools({
      config: {} as UAGENTConfig,
      modelProvider: "anthropic",
    });

    expect(openaiTools.map((tool) => tool.name)).toContain("update_plan");
    expect(codexTools.map((tool) => tool.name)).toContain("update_plan");
    expect(anthropicTools.map((tool) => tool.name)).not.toContain("update_plan");
  });
});
