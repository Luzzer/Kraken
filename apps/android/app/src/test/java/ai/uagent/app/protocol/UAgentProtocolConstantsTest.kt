package ai.uagent.app.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class UAGENTProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", UAGENTCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", UAGENTCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", UAGENTCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", UAGENTCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", UAGENTCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", UAGENTCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", UAGENTCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", UAGENTCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", UAGENTCapability.Canvas.rawValue)
    assertEquals("camera", UAGENTCapability.Camera.rawValue)
    assertEquals("voiceWake", UAGENTCapability.VoiceWake.rawValue)
    assertEquals("location", UAGENTCapability.Location.rawValue)
    assertEquals("sms", UAGENTCapability.Sms.rawValue)
    assertEquals("device", UAGENTCapability.Device.rawValue)
    assertEquals("notifications", UAGENTCapability.Notifications.rawValue)
    assertEquals("system", UAGENTCapability.System.rawValue)
    assertEquals("photos", UAGENTCapability.Photos.rawValue)
    assertEquals("contacts", UAGENTCapability.Contacts.rawValue)
    assertEquals("calendar", UAGENTCapability.Calendar.rawValue)
    assertEquals("motion", UAGENTCapability.Motion.rawValue)
    assertEquals("callLog", UAGENTCapability.CallLog.rawValue)
  }

  @Test
  fun cameraCommandsUseStableStrings() {
    assertEquals("camera.list", UAGENTCameraCommand.List.rawValue)
    assertEquals("camera.snap", UAGENTCameraCommand.Snap.rawValue)
    assertEquals("camera.clip", UAGENTCameraCommand.Clip.rawValue)
  }

  @Test
  fun notificationsCommandsUseStableStrings() {
    assertEquals("notifications.list", UAGENTNotificationsCommand.List.rawValue)
    assertEquals("notifications.actions", UAGENTNotificationsCommand.Actions.rawValue)
  }

  @Test
  fun deviceCommandsUseStableStrings() {
    assertEquals("device.status", UAGENTDeviceCommand.Status.rawValue)
    assertEquals("device.info", UAGENTDeviceCommand.Info.rawValue)
    assertEquals("device.permissions", UAGENTDeviceCommand.Permissions.rawValue)
    assertEquals("device.health", UAGENTDeviceCommand.Health.rawValue)
  }

  @Test
  fun systemCommandsUseStableStrings() {
    assertEquals("system.notify", UAGENTSystemCommand.Notify.rawValue)
  }

  @Test
  fun photosCommandsUseStableStrings() {
    assertEquals("photos.latest", UAGENTPhotosCommand.Latest.rawValue)
  }

  @Test
  fun contactsCommandsUseStableStrings() {
    assertEquals("contacts.search", UAGENTContactsCommand.Search.rawValue)
    assertEquals("contacts.add", UAGENTContactsCommand.Add.rawValue)
  }

  @Test
  fun calendarCommandsUseStableStrings() {
    assertEquals("calendar.events", UAGENTCalendarCommand.Events.rawValue)
    assertEquals("calendar.add", UAGENTCalendarCommand.Add.rawValue)
  }

  @Test
  fun motionCommandsUseStableStrings() {
    assertEquals("motion.activity", UAGENTMotionCommand.Activity.rawValue)
    assertEquals("motion.pedometer", UAGENTMotionCommand.Pedometer.rawValue)
  }

  @Test
  fun smsCommandsUseStableStrings() {
    assertEquals("sms.send", UAGENTSmsCommand.Send.rawValue)
    assertEquals("sms.search", UAGENTSmsCommand.Search.rawValue)
  }

  @Test
  fun callLogCommandsUseStableStrings() {
    assertEquals("callLog.search", UAGENTCallLogCommand.Search.rawValue)
  }

}
