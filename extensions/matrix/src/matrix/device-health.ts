export type MatrixManagedDeviceInfo = {
  deviceId: string;
  displayName: string | null;
  current: boolean;
};

export type MatrixDeviceHealthSummary = {
  currentDeviceId: string | null;
  staleUAGENTDevices: MatrixManagedDeviceInfo[];
  currentUAGENTDevices: MatrixManagedDeviceInfo[];
};

const UAGENT_DEVICE_NAME_PREFIX = "UAGENT ";

export function isUAGENTManagedMatrixDevice(displayName: string | null | undefined): boolean {
  return displayName?.startsWith(UAGENT_DEVICE_NAME_PREFIX) === true;
}

export function summarizeMatrixDeviceHealth(
  devices: MatrixManagedDeviceInfo[],
): MatrixDeviceHealthSummary {
  const currentDeviceId = devices.find((device) => device.current)?.deviceId ?? null;
  const openClawDevices = devices.filter((device) =>
    isUAGENTManagedMatrixDevice(device.displayName),
  );
  return {
    currentDeviceId,
    staleUAGENTDevices: openClawDevices.filter((device) => !device.current),
    currentUAGENTDevices: openClawDevices.filter((device) => device.current),
  };
}
