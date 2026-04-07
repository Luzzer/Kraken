import Testing
@testable import UAGENT

@Suite(.serialized) struct UAGENTAppDelegateTests {
    @Test @MainActor func resolvesRegistryModelBeforeViewTaskAssignsDelegateModel() {
        let registryModel = NodeAppModel()
        UAGENTAppModelRegistry.appModel = registryModel
        defer { UAGENTAppModelRegistry.appModel = nil }

        let delegate = UAGENTAppDelegate()

        #expect(delegate._test_resolvedAppModel() === registryModel)
    }

    @Test @MainActor func prefersExplicitDelegateModelOverRegistryFallback() {
        let registryModel = NodeAppModel()
        let explicitModel = NodeAppModel()
        UAGENTAppModelRegistry.appModel = registryModel
        defer { UAGENTAppModelRegistry.appModel = nil }

        let delegate = UAGENTAppDelegate()
        delegate.appModel = explicitModel

        #expect(delegate._test_resolvedAppModel() === explicitModel)
    }
}
