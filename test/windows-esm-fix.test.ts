import { describe, expect, it } from "vitest";
import { __testing } from "../windows-esm-fix.mjs";

describe("windows esm bootstrap loader", () => {
  it("rewrites raw Windows absolute specifiers to file URLs", () => {
    expect(__testing.toSafeWindowsEsmSpecifier("C:/Users/alice/plugin/index.mjs")).toBe(
      "file:///C:/Users/alice/plugin/index.mjs",
    );
    expect(__testing.toSafeWindowsEsmSpecifier("C:\\Users\\alice#tag\\plugin\\index.mjs")).toBe(
      "file:///C:/Users/alice%23tag/plugin/index.mjs",
    );
    expect(__testing.toSafeWindowsEsmSpecifier("\\\\server\\share\\plugin\\index.mjs")).toBe(
      "file://server/share/plugin/index.mjs",
    );
  });

  it("leaves relative and file URL specifiers untouched", () => {
    expect(__testing.toSafeWindowsEsmSpecifier("./relative/plugin.mjs")).toBe(
      "./relative/plugin.mjs",
    );
    expect(__testing.toSafeWindowsEsmSpecifier("file:///C:/Users/alice/plugin/index.mjs")).toBe(
      "file:///C:/Users/alice/plugin/index.mjs",
    );
  });
});
