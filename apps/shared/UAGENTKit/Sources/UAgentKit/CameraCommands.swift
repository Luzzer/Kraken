import Foundation

public enum UAGENTCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum UAGENTCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum UAGENTCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum UAGENTCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct UAGENTCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: UAGENTCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: UAGENTCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: UAGENTCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: UAGENTCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct UAGENTCameraClipParams: Codable, Sendable, Equatable {
    public var facing: UAGENTCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: UAGENTCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: UAGENTCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: UAGENTCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
