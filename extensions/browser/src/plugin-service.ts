import {
  startLazyPluginServiceModule,
  type LazyPluginServiceHandle,
  type UAGENTPluginService,
} from "uagent/plugin-sdk/browser-node-runtime";

type BrowserControlHandle = LazyPluginServiceHandle | null;

export function createBrowserPluginService(): UAGENTPluginService {
  let handle: BrowserControlHandle = null;

  return {
    id: "browser-control",
    start: async () => {
      if (handle) {
        return;
      }
      handle = await startLazyPluginServiceModule({
        skipEnvVar: "UAGENT_SKIP_BROWSER_CONTROL_SERVER",
        overrideEnvVar: "UAGENT_BROWSER_CONTROL_MODULE",
        // Keep the default module import static so compiled builds still bundle it.
        loadDefaultModule: async () => await import("./server.js"),
        startExportNames: [
          "startBrowserControlServiceFromConfig",
          "startBrowserControlServerFromConfig",
        ],
        stopExportNames: ["stopBrowserControlService", "stopBrowserControlServer"],
      });
    },
    stop: async () => {
      const current = handle;
      handle = null;
      if (!current) {
        return;
      }
      await current.stop().catch(() => {});
    },
  };
}
