// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "UAGENTKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "UAGENTProtocol", targets: ["UAGENTProtocol"]),
        .library(name: "UAGENTKit", targets: ["UAGENTKit"]),
        .library(name: "UAGENTChatUI", targets: ["UAGENTChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.0"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "UAGENTProtocol",
            path: "Sources/UAGENTProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "UAGENTKit",
            dependencies: [
                "UAGENTProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/UAGENTKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "UAGENTChatUI",
            dependencies: [
                "UAGENTKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/UAGENTChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "UAGENTKitTests",
            dependencies: ["UAGENTKit", "UAGENTChatUI"],
            path: "Tests/UAGENTKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
