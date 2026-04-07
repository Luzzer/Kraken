import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as utils from "../utils.js";
import {
  getWideAreaZonePath,
  normalizeWideAreaDomain,
  renderWideAreaGatewayZoneText,
  resolveWideAreaDiscoveryDomain,
  type WideAreaGatewayZoneOpts,
  writeWideAreaGatewayZone,
} from "./widearea-dns.js";

const baseZoneOpts: WideAreaGatewayZoneOpts = {
  domain: "uagent.internal.",
  gatewayPort: 18789,
  displayName: "Mac Studio (UAGENT)",
  tailnetIPv4: "100.123.224.76",
  hostLabel: "studio-london",
  instanceLabel: "studio-london",
};

function makeZoneOpts(overrides: Partial<WideAreaGatewayZoneOpts> = {}): WideAreaGatewayZoneOpts {
  return { ...baseZoneOpts, ...overrides };
}

function renderZoneText(overrides: Partial<WideAreaGatewayZoneOpts> = {}): string {
  return renderWideAreaGatewayZoneText({
    ...makeZoneOpts(overrides),
    serial: 2025121701,
  });
}

function expectZoneRecords(text: string, records: string[]): void {
  for (const record of records) {
    expect(text).toContain(record);
  }
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("wide-area DNS discovery domain helpers", () => {
  it.each([
    { value: "uagent.internal", expected: "uagent.internal." },
    { value: "uagent.internal.", expected: "uagent.internal." },
    { value: "  uagent.internal  ", expected: "uagent.internal." },
    { value: "", expected: null },
    { value: "   ", expected: null },
    { value: null, expected: null },
    { value: undefined, expected: null },
  ])("normalizes domains for %j", ({ value, expected }) => {
    expect(normalizeWideAreaDomain(value)).toBe(expected);
  });

  it.each([
    {
      name: "prefers config domain over env",
      params: {
        env: { UAGENT_WIDE_AREA_DOMAIN: "env.internal" } as NodeJS.ProcessEnv,
        configDomain: "config.internal",
      },
      expected: "config.internal.",
    },
    {
      name: "falls back to env domain",
      params: {
        env: { UAGENT_WIDE_AREA_DOMAIN: "env.internal" } as NodeJS.ProcessEnv,
      },
      expected: "env.internal.",
    },
    {
      name: "returns null when both sources are blank",
      params: {
        env: { UAGENT_WIDE_AREA_DOMAIN: "   " } as NodeJS.ProcessEnv,
        configDomain: " ",
      },
      expected: null,
    },
  ])("$name", ({ params, expected }) => {
    expect(resolveWideAreaDiscoveryDomain(params)).toBe(expected);
  });

  it("builds the default zone path from the normalized domain", () => {
    expect(getWideAreaZonePath("uagent.internal.")).toBe(
      path.join(utils.CONFIG_DIR, "dns", "uagent.internal.db"),
    );
  });
});

describe("wide-area DNS-SD zone rendering", () => {
  it("renders a zone with gateway PTR/SRV/TXT records", () => {
    const txt = renderZoneText({
      tailnetIPv6: "fd7a:115c:a1e0::8801:e04c",
      sshPort: 22,
      cliPath: "/opt/homebrew/bin/uagent",
    });

    expectZoneRecords(txt, [
      `$ORIGIN uagent.internal.`,
      `studio-london IN A 100.123.224.76`,
      `studio-london IN AAAA fd7a:115c:a1e0::8801:e04c`,
      `_uagent-gw._tcp IN PTR studio-london._uagent-gw._tcp`,
      `studio-london._uagent-gw._tcp IN SRV 0 0 18789 studio-london`,
      `displayName=Mac Studio (UAGENT)`,
      `gatewayPort=18789`,
      `sshPort=22`,
      `cliPath=/opt/homebrew/bin/uagent`,
    ]);
  });

  it.each([
    {
      name: "includes tailnetDns when provided",
      overrides: { tailnetDns: "peters-mac-studio-1.sheep-coho.ts.net" },
      records: [`tailnetDns=peters-mac-studio-1.sheep-coho.ts.net`],
    },
    {
      name: "includes gateway TLS TXT fields and trims display metadata",
      overrides: {
        domain: "uagent.internal",
        displayName: "  Mac Studio (UAGENT)  ",
        hostLabel: " Studio London ",
        instanceLabel: " Studio London ",
        gatewayTlsEnabled: true,
        gatewayTlsFingerprintSha256: "abc123",
        tailnetDns: " tailnet.ts.net ",
        cliPath: " /opt/homebrew/bin/uagent ",
      },
      records: [
        `$ORIGIN uagent.internal.`,
        `studio-london IN A 100.123.224.76`,
        `studio-london._uagent-gw._tcp IN TXT`,
        `displayName=Mac Studio (UAGENT)`,
        `gatewayTls=1`,
        `gatewayTlsSha256=abc123`,
        `tailnetDns=tailnet.ts.net`,
        `cliPath=/opt/homebrew/bin/uagent`,
      ],
    },
  ])("$name", ({ overrides, records }) => {
    expectZoneRecords(renderZoneText(overrides), records);
  });
});

describe("wide-area DNS zone writes", () => {
  it("rejects blank domains", async () => {
    await expect(writeWideAreaGatewayZone(makeZoneOpts({ domain: "   " }))).rejects.toThrow(
      "wide-area discovery domain is required",
    );
  });

  it("skips rewriting unchanged content", async () => {
    vi.spyOn(utils, "ensureDir").mockResolvedValue(undefined);
    const existing = renderWideAreaGatewayZoneText({ ...makeZoneOpts(), serial: 2026031301 });
    vi.spyOn(fs, "readFileSync").mockReturnValue(existing);
    const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => undefined);

    const result = await writeWideAreaGatewayZone(makeZoneOpts());

    expect(result).toEqual({
      zonePath: getWideAreaZonePath("uagent.internal."),
      changed: false,
    });
    expect(writeSpy).not.toHaveBeenCalled();
  });

  it("increments same-day serials when content changes", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-13T12:00:00.000Z"));
    vi.spyOn(utils, "ensureDir").mockResolvedValue(undefined);
    vi.spyOn(fs, "readFileSync").mockReturnValue(
      renderWideAreaGatewayZoneText({ ...makeZoneOpts(), serial: 2026031304 }),
    );
    const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => undefined);

    const result = await writeWideAreaGatewayZone(
      makeZoneOpts({ gatewayTlsEnabled: true, gatewayTlsFingerprintSha256: "abc123" }),
    );

    expect(result).toEqual({
      zonePath: getWideAreaZonePath("uagent.internal."),
      changed: true,
    });
    expect(writeSpy).toHaveBeenCalledWith(
      getWideAreaZonePath("uagent.internal."),
      expect.stringContaining("@ IN SOA ns1 hostmaster 2026031305 7200 3600 1209600 60"),
      "utf-8",
    );
  });
});
