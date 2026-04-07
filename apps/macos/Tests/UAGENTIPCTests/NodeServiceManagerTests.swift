import Foundation
import Testing
@testable import UAGENT

@Suite(.serialized) struct NodeServiceManagerTests {
    @Test func `builds node service commands with current CLI shape`() async throws {
        try await TestIsolation.withUserDefaultsValues(["uagent.gatewayProjectRootPath": nil]) {
            let tmp = try makeTempDirForTests()
            CommandResolver.setProjectRoot(tmp.path)

            let uagentPath = tmp.appendingPathComponent("node_modules/.bin/uagent")
            try makeExecutableForTests(at: uagentPath)

            let start = NodeServiceManager._testServiceCommand(["start"])
            #expect(start == [uagentPath.path, "node", "start", "--json"])

            let stop = NodeServiceManager._testServiceCommand(["stop"])
            #expect(stop == [uagentPath.path, "node", "stop", "--json"])
        }
    }
}
