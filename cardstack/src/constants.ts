import DeviceInfo from 'react-native-device-info';

export const ENABLE_PIN_ITEMS = false;
export const TRANSACTION_PAGE_SIZE = 100; // Temp increase the page size
export const SUPPORT_EMAIL_ADDRESS = 'appfeedback@cardstack.com';
export const SEND_TRANSACTION_ERROR_MESSAGE =
  'An error has occurred, could not send. If this persists, please contact support@cardstack.com';
export const UPDATE_BALANCE_AND_PRICE_FREQUENCY = 10000;
export const DISCOVER_NEW_ASSETS_FREQUENCY = 13000;
export const SettingsExternalURLs = {
  cardstackHomepage: 'https://cardstack.com/',
  review:
    'itms-apps://itunes.apple.com/us/app/appName/id1457119021?mt=8&action=write-review',
  twitterDeepLink: 'twitter://user?screen_name=cardstack',
  twitterWebUrl: 'https://twitter.com/cardstack',
  discordInviteLink: 'https://discord.gg/cardstack',
};
export const IPFS_HTTP_URL = 'https://ipfs.infura.io';

export const delayLongPressMs = 800;

export const defaultErrorAlert = {
  title: 'Error',
  message:
    'Please try again or contact support@cardstack.com if this error persists.',
};

export const cardSpaceSuffix = 'card.xyz';
export const cardSpaceDomain = `.${cardSpaceSuffix}`;
export const appName = 'Card Pay Wallet';
export const appVersion = `${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`;
