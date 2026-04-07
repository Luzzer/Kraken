package ai.uagent.app.node

import ai.uagent.app.protocol.UAGENTCalendarCommand
import ai.uagent.app.protocol.UAGENTCameraCommand
import ai.uagent.app.protocol.UAGENTCallLogCommand
import ai.uagent.app.protocol.UAGENTCapability
import ai.uagent.app.protocol.UAGENTContactsCommand
import ai.uagent.app.protocol.UAGENTDeviceCommand
import ai.uagent.app.protocol.UAGENTLocationCommand
import ai.uagent.app.protocol.UAGENTMotionCommand
import ai.uagent.app.protocol.UAGENTNotificationsCommand
import ai.uagent.app.protocol.UAGENTPhotosCommand
import ai.uagent.app.protocol.UAGENTSmsCommand
import ai.uagent.app.protocol.UAGENTSystemCommand
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class InvokeCommandRegistryTest {
  private val coreCapabilities =
    setOf(
      UAGENTCapability.Canvas.rawValue,
      UAGENTCapability.Device.rawValue,
      UAGENTCapability.Notifications.rawValue,
      UAGENTCapability.System.rawValue,
      UAGENTCapability.Photos.rawValue,
      UAGENTCapability.Contacts.rawValue,
      UAGENTCapability.Calendar.rawValue,
    )

  private val optionalCapabilities =
    setOf(
      UAGENTCapability.Camera.rawValue,
      UAGENTCapability.Location.rawValue,
      UAGENTCapability.Sms.rawValue,
      UAGENTCapability.CallLog.rawValue,
      UAGENTCapability.VoiceWake.rawValue,
      UAGENTCapability.Motion.rawValue,
    )

  private val coreCommands =
    setOf(
      UAGENTDeviceCommand.Status.rawValue,
      UAGENTDeviceCommand.Info.rawValue,
      UAGENTDeviceCommand.Permissions.rawValue,
      UAGENTDeviceCommand.Health.rawValue,
      UAGENTNotificationsCommand.List.rawValue,
      UAGENTNotificationsCommand.Actions.rawValue,
      UAGENTSystemCommand.Notify.rawValue,
      UAGENTPhotosCommand.Latest.rawValue,
      UAGENTContactsCommand.Search.rawValue,
      UAGENTContactsCommand.Add.rawValue,
      UAGENTCalendarCommand.Events.rawValue,
      UAGENTCalendarCommand.Add.rawValue,
    )

  private val optionalCommands =
    setOf(
      UAGENTCameraCommand.Snap.rawValue,
      UAGENTCameraCommand.Clip.rawValue,
      UAGENTCameraCommand.List.rawValue,
      UAGENTLocationCommand.Get.rawValue,
      UAGENTMotionCommand.Activity.rawValue,
      UAGENTMotionCommand.Pedometer.rawValue,
      UAGENTSmsCommand.Send.rawValue,
      UAGENTSmsCommand.Search.rawValue,
      UAGENTCallLogCommand.Search.rawValue,
    )

  private val debugCommands = setOf("debug.logs", "debug.ed25519")

  @Test
  fun advertisedCapabilities_respectsFeatureAvailability() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags())

    assertContainsAll(capabilities, coreCapabilities)
    assertMissingAll(capabilities, optionalCapabilities)
  }

  @Test
  fun advertisedCapabilities_includesFeatureCapabilitiesWhenEnabled() {
    val capabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          sendSmsAvailable = true,
          readSmsAvailable = true,
          smsSearchPossible = true,
          callLogAvailable = true,
          voiceWakeEnabled = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
        ),
      )

    assertContainsAll(capabilities, coreCapabilities + optionalCapabilities)
  }

  @Test
  fun advertisedCommands_respectsFeatureAvailability() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags())

    assertContainsAll(commands, coreCommands)
    assertMissingAll(commands, optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_includesFeatureCommandsWhenEnabled() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          sendSmsAvailable = true,
          readSmsAvailable = true,
          smsSearchPossible = true,
          callLogAvailable = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
          debugBuild = true,
        ),
      )

    assertContainsAll(commands, coreCommands + optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_onlyIncludesSupportedMotionCommands() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        NodeRuntimeFlags(
          cameraEnabled = false,
          locationEnabled = false,
          sendSmsAvailable = false,
          readSmsAvailable = false,
          smsSearchPossible = false,
          callLogAvailable = false,
          voiceWakeEnabled = false,
          motionActivityAvailable = true,
          motionPedometerAvailable = false,
          debugBuild = false,
        ),
      )

    assertTrue(commands.contains(UAGENTMotionCommand.Activity.rawValue))
    assertFalse(commands.contains(UAGENTMotionCommand.Pedometer.rawValue))
  }

  @Test
  fun advertisedCommands_splitsSmsSendAndSearchAvailability() {
    val readOnlyCommands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(readSmsAvailable = true, smsSearchPossible = true),
      )
    val sendOnlyCommands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(sendSmsAvailable = true),
      )
    val requestableSearchCommands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(smsSearchPossible = true),
      )

    assertTrue(readOnlyCommands.contains(UAGENTSmsCommand.Search.rawValue))
    assertFalse(readOnlyCommands.contains(UAGENTSmsCommand.Send.rawValue))
    assertTrue(sendOnlyCommands.contains(UAGENTSmsCommand.Send.rawValue))
    assertFalse(sendOnlyCommands.contains(UAGENTSmsCommand.Search.rawValue))
    assertTrue(requestableSearchCommands.contains(UAGENTSmsCommand.Search.rawValue))
  }

  @Test
  fun advertisedCapabilities_includeSmsWhenEitherSmsPathIsAvailable() {
    val readOnlyCapabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(readSmsAvailable = true),
      )
    val sendOnlyCapabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(sendSmsAvailable = true),
      )
    val requestableSearchCapabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(smsSearchPossible = true),
      )

    assertTrue(readOnlyCapabilities.contains(UAGENTCapability.Sms.rawValue))
    assertTrue(sendOnlyCapabilities.contains(UAGENTCapability.Sms.rawValue))
    assertFalse(requestableSearchCapabilities.contains(UAGENTCapability.Sms.rawValue))
  }

  @Test
  fun advertisedCommands_excludesCallLogWhenUnavailable() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags(callLogAvailable = false))

    assertFalse(commands.contains(UAGENTCallLogCommand.Search.rawValue))
  }

  @Test
  fun advertisedCapabilities_excludesCallLogWhenUnavailable() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags(callLogAvailable = false))

    assertFalse(capabilities.contains(UAGENTCapability.CallLog.rawValue))
  }

  @Test
  fun advertisedCapabilities_includesVoiceWakeWithoutAdvertisingCommands() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags(voiceWakeEnabled = true))
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags(voiceWakeEnabled = true))

    assertTrue(capabilities.contains(UAGENTCapability.VoiceWake.rawValue))
    assertFalse(commands.any { it.contains("voice", ignoreCase = true) })
  }

  @Test
  fun find_returnsForegroundMetadataForCameraCommands() {
    val list = InvokeCommandRegistry.find(UAGENTCameraCommand.List.rawValue)
    val location = InvokeCommandRegistry.find(UAGENTLocationCommand.Get.rawValue)

    assertNotNull(list)
    assertEquals(true, list?.requiresForeground)
    assertNotNull(location)
    assertEquals(false, location?.requiresForeground)
  }

  @Test
  fun find_returnsNullForUnknownCommand() {
    assertNull(InvokeCommandRegistry.find("not.real"))
  }

  private fun defaultFlags(
    cameraEnabled: Boolean = false,
    locationEnabled: Boolean = false,
    sendSmsAvailable: Boolean = false,
    readSmsAvailable: Boolean = false,
    smsSearchPossible: Boolean = false,
    callLogAvailable: Boolean = false,
    voiceWakeEnabled: Boolean = false,
    motionActivityAvailable: Boolean = false,
    motionPedometerAvailable: Boolean = false,
    debugBuild: Boolean = false,
  ): NodeRuntimeFlags =
    NodeRuntimeFlags(
      cameraEnabled = cameraEnabled,
      locationEnabled = locationEnabled,
      sendSmsAvailable = sendSmsAvailable,
      readSmsAvailable = readSmsAvailable,
      smsSearchPossible = smsSearchPossible,
      callLogAvailable = callLogAvailable,
      voiceWakeEnabled = voiceWakeEnabled,
      motionActivityAvailable = motionActivityAvailable,
      motionPedometerAvailable = motionPedometerAvailable,
      debugBuild = debugBuild,
    )

  private fun assertContainsAll(actual: List<String>, expected: Set<String>) {
    expected.forEach { value -> assertTrue(actual.contains(value)) }
  }

  private fun assertMissingAll(actual: List<String>, forbidden: Set<String>) {
    forbidden.forEach { value -> assertFalse(actual.contains(value)) }
  }
}
