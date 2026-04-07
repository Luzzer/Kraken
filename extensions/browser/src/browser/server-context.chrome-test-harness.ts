import { vi } from "vitest";
import { installChromeUserDataDirHooks } from "./chrome-user-data-dir.test-harness.js";

const chromeUserDataDir = { dir: "/tmp/uagent" };
installChromeUserDataDirHooks(chromeUserDataDir);

vi.mock("./chrome.js", () => ({
  isChromeCdpReady: vi.fn(async () => true),
  isChromeReachable: vi.fn(async () => true),
  launchUAGENTChrome: vi.fn(async () => {
    throw new Error("unexpected launch");
  }),
  resolveUAGENTUserDataDir: vi.fn(() => chromeUserDataDir.dir),
  stopUAGENTChrome: vi.fn(async () => {}),
}));
