import { describe, expect, it } from "vitest";
import { isUAGENTManagedMatrixDevice, summarizeMatrixDeviceHealth } from "./device-health.js";

describe("matrix device health", () => {
  it("detects UAGENT-managed device names", () => {
    expect(isUAGENTManagedMatrixDevice("UAGENT Gateway")).toBe(true);
    expect(isUAGENTManagedMatrixDevice("UAGENT Debug")).toBe(true);
    expect(isUAGENTManagedMatrixDevice("Element iPhone")).toBe(false);
    expect(isUAGENTManagedMatrixDevice(null)).toBe(false);
  });

  it("summarizes stale UAGENT-managed devices separately from the current device", () => {
    const summary = summarizeMatrixDeviceHealth([
      {
        deviceId: "du314Zpw3A",
        displayName: "UAGENT Gateway",
        current: true,
      },
      {
        deviceId: "BritdXC6iL",
        displayName: "UAGENT Gateway",
        current: false,
      },
      {
        deviceId: "G6NJU9cTgs",
        displayName: "UAGENT Debug",
        current: false,
      },
      {
        deviceId: "phone123",
        displayName: "Element iPhone",
        current: false,
      },
    ]);

    expect(summary.currentDeviceId).toBe("du314Zpw3A");
    expect(summary.currentUAGENTDevices).toEqual([
      expect.objectContaining({ deviceId: "du314Zpw3A" }),
    ]);
    expect(summary.staleUAGENTDevices).toEqual([
      expect.objectContaining({ deviceId: "BritdXC6iL" }),
      expect.objectContaining({ deviceId: "G6NJU9cTgs" }),
    ]);
  });
});
