import { describe, expect, it } from "vitest";
import { resolveIrcInboundTarget } from "./monitor.js";

describe("irc monitor inbound target", () => {
  it("keeps channel target for group messages", () => {
    expect(
      resolveIrcInboundTarget({
        target: "#uagent",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: true,
      target: "#uagent",
      rawTarget: "#uagent",
    });
  });

  it("maps DM target to sender nick and preserves raw target", () => {
    expect(
      resolveIrcInboundTarget({
        target: "uagent-bot",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: false,
      target: "alice",
      rawTarget: "uagent-bot",
    });
  });

  it("falls back to raw target when sender nick is empty", () => {
    expect(
      resolveIrcInboundTarget({
        target: "uagent-bot",
        senderNick: " ",
      }),
    ).toEqual({
      isGroup: false,
      target: "uagent-bot",
      rawTarget: "uagent-bot",
    });
  });
});
