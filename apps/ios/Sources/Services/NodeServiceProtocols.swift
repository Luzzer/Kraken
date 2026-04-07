import CoreLocation
import Foundation
import UAGENTKit
import UIKit

typealias UAGENTCameraSnapResult = (format: String, base64: String, width: Int, height: Int)
typealias UAGENTCameraClipResult = (format: String, base64: String, durationMs: Int, hasAudio: Bool)

protocol CameraServicing: Sendable {
    func listDevices() async -> [CameraController.CameraDeviceInfo]
    func snap(params: UAGENTCameraSnapParams) async throws -> UAGENTCameraSnapResult
    func clip(params: UAGENTCameraClipParams) async throws -> UAGENTCameraClipResult
}

protocol ScreenRecordingServicing: Sendable {
    func record(
        screenIndex: Int?,
        durationMs: Int?,
        fps: Double?,
        includeAudio: Bool?,
        outPath: String?) async throws -> String
}

@MainActor
protocol LocationServicing: Sendable {
    func authorizationStatus() -> CLAuthorizationStatus
    func accuracyAuthorization() -> CLAccuracyAuthorization
    func ensureAuthorization(mode: UAGENTLocationMode) async -> CLAuthorizationStatus
    func currentLocation(
        params: UAGENTLocationGetParams,
        desiredAccuracy: UAGENTLocationAccuracy,
        maxAgeMs: Int?,
        timeoutMs: Int?) async throws -> CLLocation
    func startLocationUpdates(
        desiredAccuracy: UAGENTLocationAccuracy,
        significantChangesOnly: Bool) -> AsyncStream<CLLocation>
    func stopLocationUpdates()
    func startMonitoringSignificantLocationChanges(onUpdate: @escaping @Sendable (CLLocation) -> Void)
    func stopMonitoringSignificantLocationChanges()
}

@MainActor
protocol DeviceStatusServicing: Sendable {
    func status() async throws -> UAGENTDeviceStatusPayload
    func info() -> UAGENTDeviceInfoPayload
}

protocol PhotosServicing: Sendable {
    func latest(params: UAGENTPhotosLatestParams) async throws -> UAGENTPhotosLatestPayload
}

protocol ContactsServicing: Sendable {
    func search(params: UAGENTContactsSearchParams) async throws -> UAGENTContactsSearchPayload
    func add(params: UAGENTContactsAddParams) async throws -> UAGENTContactsAddPayload
}

protocol CalendarServicing: Sendable {
    func events(params: UAGENTCalendarEventsParams) async throws -> UAGENTCalendarEventsPayload
    func add(params: UAGENTCalendarAddParams) async throws -> UAGENTCalendarAddPayload
}

protocol RemindersServicing: Sendable {
    func list(params: UAGENTRemindersListParams) async throws -> UAGENTRemindersListPayload
    func add(params: UAGENTRemindersAddParams) async throws -> UAGENTRemindersAddPayload
}

protocol MotionServicing: Sendable {
    func activities(params: UAGENTMotionActivityParams) async throws -> UAGENTMotionActivityPayload
    func pedometer(params: UAGENTPedometerParams) async throws -> UAGENTPedometerPayload
}

struct WatchMessagingStatus: Sendable, Equatable {
    var supported: Bool
    var paired: Bool
    var appInstalled: Bool
    var reachable: Bool
    var activationState: String
}

struct WatchQuickReplyEvent: Sendable, Equatable {
    var replyId: String
    var promptId: String
    var actionId: String
    var actionLabel: String?
    var sessionKey: String?
    var note: String?
    var sentAtMs: Int?
    var transport: String
}

struct WatchExecApprovalResolveEvent: Sendable, Equatable {
    var replyId: String
    var approvalId: String
    var decision: UAGENTWatchExecApprovalDecision
    var sentAtMs: Int?
    var transport: String
}

struct WatchExecApprovalSnapshotRequestEvent: Sendable, Equatable {
    var requestId: String
    var sentAtMs: Int?
    var transport: String
}

struct WatchNotificationSendResult: Sendable, Equatable {
    var deliveredImmediately: Bool
    var queuedForDelivery: Bool
    var transport: String
}

protocol WatchMessagingServicing: AnyObject, Sendable {
    func status() async -> WatchMessagingStatus
    func setStatusHandler(_ handler: (@Sendable (WatchMessagingStatus) -> Void)?)
    func setReplyHandler(_ handler: (@Sendable (WatchQuickReplyEvent) -> Void)?)
    func setExecApprovalResolveHandler(_ handler: (@Sendable (WatchExecApprovalResolveEvent) -> Void)?)
    func setExecApprovalSnapshotRequestHandler(
        _ handler: (@Sendable (WatchExecApprovalSnapshotRequestEvent) -> Void)?)
    func sendNotification(
        id: String,
        params: UAGENTWatchNotifyParams) async throws -> WatchNotificationSendResult
    func sendExecApprovalPrompt(
        _ message: UAGENTWatchExecApprovalPromptMessage) async throws -> WatchNotificationSendResult
    func sendExecApprovalResolved(
        _ message: UAGENTWatchExecApprovalResolvedMessage) async throws -> WatchNotificationSendResult
    func sendExecApprovalExpired(
        _ message: UAGENTWatchExecApprovalExpiredMessage) async throws -> WatchNotificationSendResult
    func syncExecApprovalSnapshot(
        _ message: UAGENTWatchExecApprovalSnapshotMessage) async throws -> WatchNotificationSendResult
}

extension CameraController: CameraServicing {}
extension ScreenRecordService: ScreenRecordingServicing {}
extension LocationService: LocationServicing {}
