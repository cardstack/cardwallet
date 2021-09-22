import VersionNumber from 'react-native-version-number';

export default function useAppVersion() {
  return `${VersionNumber.appVersion} (${VersionNumber.buildVersion})`;
}
