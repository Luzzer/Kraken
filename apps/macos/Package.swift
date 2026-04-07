// swift-tools-version: 6.2
// Package manifest for the UAGENT macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "UAGENT",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "UAGENTIPC", targets: ["UAGENTIPC"]),
        .library(name: "UAGENTDiscovery", targets: ["UAGENTDiscovery"]),
        .executable(name: "UAGENT", targets: ["UAGENT"]),
        .executable(name: "uagent-mac", targets: ["UAGENTMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.4.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.10.1"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.9.0"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/UAGENTKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "UAGENTIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "UAGENTDiscovery",
            dependencies: [
                .product(name: "UAGENTKit", package: "UAGENTKit"),
            ],
            path: "Sources/UAGENTDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "UAGENT",
            dependencies: [
                "UAGENTIPC",
                "UAGENTDiscovery",
                .product(name: "UAGENTKit", package: "UAGENTKit"),
                .product(name: "UAGENTChatUI", package: "UAGENTKit"),
                .product(name: "UAGENTProtocol", package: "UAGENTKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/UAGENT.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "UAGENTMacCLI",
            dependencies: [
                "UAGENTDiscovery",
                .product(name: "UAGENTKit", package: "UAGENTKit"),
                .product(name: "UAGENTProtocol", package: "UAGENTKit"),
            ],
            path: "Sources/UAGENTMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "UAGENTIPCTests",
            dependencies: [
                "UAGENTIPC",
                "UAGENT",
                "UAGENTDiscovery",
                .product(name: "UAGENTProtocol", package: "UAGENTKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
