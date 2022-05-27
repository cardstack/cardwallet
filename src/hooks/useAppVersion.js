import DeviceInfo from 'react-native-device-info';

export default function useAppVersion() {
  return `${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`;
}
