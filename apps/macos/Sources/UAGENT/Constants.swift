import Foundation

// Stable identifier used for both the macOS LaunchAgent label and Nix-managed defaults suite.
// nix-uagent writes app defaults into this suite to survive app bundle identifier churn.
let launchdLabel = "ai.uagent.mac"
let gatewayLaunchdLabel = "ai.uagent.gateway"
let onboardingVersionKey = "uagent.onboardingVersion"
let onboardingSeenKey = "uagent.onboardingSeen"
let currentOnboardingVersion = 7
let pauseDefaultsKey = "uagent.pauseEnabled"
let iconAnimationsEnabledKey = "uagent.iconAnimationsEnabled"
let swabbleEnabledKey = "uagent.swabbleEnabled"
let swabbleTriggersKey = "uagent.swabbleTriggers"
let voiceWakeTriggerChimeKey = "uagent.voiceWakeTriggerChime"
let voiceWakeSendChimeKey = "uagent.voiceWakeSendChime"
let showDockIconKey = "uagent.showDockIcon"
let defaultVoiceWakeTriggers = ["uagent"]
let voiceWakeMaxWords = 32
let voiceWakeMaxWordLength = 64
let voiceWakeMicKey = "uagent.voiceWakeMicID"
let voiceWakeMicNameKey = "uagent.voiceWakeMicName"
let voiceWakeLocaleKey = "uagent.voiceWakeLocaleID"
let voiceWakeAdditionalLocalesKey = "uagent.voiceWakeAdditionalLocaleIDs"
let voicePushToTalkEnabledKey = "uagent.voicePushToTalkEnabled"
let voiceWakeTriggersTalkModeKey = "uagent.voiceWakeTriggersTalkMode"
let talkEnabledKey = "uagent.talkEnabled"
let iconOverrideKey = "uagent.iconOverride"
let connectionModeKey = "uagent.connectionMode"
let remoteTargetKey = "uagent.remoteTarget"
let remoteIdentityKey = "uagent.remoteIdentity"
let remoteProjectRootKey = "uagent.remoteProjectRoot"
let remoteCliPathKey = "uagent.remoteCliPath"
let canvasEnabledKey = "uagent.canvasEnabled"
let cameraEnabledKey = "uagent.cameraEnabled"
let systemRunPolicyKey = "uagent.systemRunPolicy"
let systemRunAllowlistKey = "uagent.systemRunAllowlist"
let systemRunEnabledKey = "uagent.systemRunEnabled"
let locationModeKey = "uagent.locationMode"
let locationPreciseKey = "uagent.locationPreciseEnabled"
let peekabooBridgeEnabledKey = "uagent.peekabooBridgeEnabled"
let deepLinkKeyKey = "uagent.deepLinkKey"
let modelCatalogPathKey = "uagent.modelCatalogPath"
let modelCatalogReloadKey = "uagent.modelCatalogReload"
let cliInstallPromptedVersionKey = "uagent.cliInstallPromptedVersion"
let heartbeatsEnabledKey = "uagent.heartbeatsEnabled"
let debugPaneEnabledKey = "uagent.debugPaneEnabled"
let debugFileLogEnabledKey = "uagent.debug.fileLogEnabled"
let appLogLevelKey = "uagent.debug.appLogLevel"
let voiceWakeSupported: Bool = ProcessInfo.processInfo.operatingSystemVersion.majorVersion >= 26
