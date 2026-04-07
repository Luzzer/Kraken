import { describe, expect, it } from "vitest";
import { collectPreparedPrepackErrors } from "./uagent-prepack.ts";

describe("collectPreparedPrepackErrors", () => {
  it("accepts prepared bundled plugin manifests when present", () => {
    const errors = collectPreparedPrepackErrors(
      [
        "dist/index.js",
        "dist/control-ui/index.html",
        "dist/extensions/openai/uagent.plugin.json",
        "dist/extensions/vllm/uagent.plugin.json",
      ],
      ["dist/control-ui/assets/app.js"],
      ["dist/extensions/openai/uagent.plugin.json", "dist/extensions/vllm/uagent.plugin.json"],
    );

    expect(errors).toEqual([]);
  });

  it("reports missing bundled plugin manifests in prepared packs", () => {
    const errors = collectPreparedPrepackErrors(
      ["dist/index.js", "dist/control-ui/index.html"],
      ["dist/control-ui/assets/app.js"],
      ["dist/extensions/openai/uagent.plugin.json", "dist/extensions/vllm/uagent.plugin.json"],
    );

    expect(errors).toEqual([
      "missing prepared bundled plugin manifests: 2 (dist/extensions/openai/uagent.plugin.json, dist/extensions/vllm/uagent.plugin.json)",
    ]);
  });
});
