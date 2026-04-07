import type { UAGENTPluginApi } from "uagent/plugin-sdk/plugin-runtime";

type TestPluginApiInput = Partial<UAGENTPluginApi>;

export function createTestPluginApi(api: TestPluginApiInput = {}): UAGENTPluginApi {
  return {
    id: "test-plugin",
    name: "test-plugin",
    source: "test",
    registrationMode: "full",
    config: {},
    runtime: {} as UAGENTPluginApi["runtime"],
    logger: { info() {}, warn() {}, error() {}, debug() {} },
    registerTool() {},
    registerHook() {},
    registerHttpRoute() {},
    registerChannel() {},
    registerGatewayMethod() {},
    registerCli() {},
    registerCliBackend() {},
    registerService() {},
    registerReload() {},
    registerNodeHostCommand() {},
    registerSecurityAuditCollector() {},
    registerConfigMigration() {},
    registerAutoEnableProbe() {},
    registerProvider() {},
    registerSpeechProvider() {},
    registerRealtimeTranscriptionProvider() {},
    registerRealtimeVoiceProvider() {},
    registerMediaUnderstandingProvider() {},
    registerImageGenerationProvider() {},
    registerMusicGenerationProvider() {},
    registerVideoGenerationProvider() {},
    registerWebFetchProvider() {},
    registerWebSearchProvider() {},
    registerInteractiveHandler() {},
    onConversationBindingResolved() {},
    registerCommand() {},
    registerContextEngine() {},
    registerMemoryPromptSection() {},
    registerMemoryPromptSupplement() {},
    registerMemoryCorpusSupplement() {},
    registerMemoryFlushPlan() {},
    registerMemoryRuntime() {},
    registerMemoryEmbeddingProvider() {},
    resolvePath(input: string) {
      return input;
    },
    on() {},
    ...api,
  };
}
