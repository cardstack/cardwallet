import { CLOUD_BACKUP_ERRORS } from '@cardstack/models/rn-cloud';

const userFriendlyErrorMsg = {
  [CLOUD_BACKUP_ERRORS.KEYCHAIN_ACCESS_ERROR]:
    'You need to authenticate to proceed with the Backup process',
  [CLOUD_BACKUP_ERRORS.USER_CANCELED_DRIVE_API_AUTH]: `Not authorized to interact with Google Drive.`,
  [CLOUD_BACKUP_ERRORS.ERROR_DECRYPTING_DATA]: `Incorrect password! Please try again.`,
  [CLOUD_BACKUP_ERRORS.SPECIFIC_BACKUP_NOT_FOUND]: `We couldn't find your previous backup!`,
  [CLOUD_BACKUP_ERRORS.ERROR_GETTING_ENCRYPTED_DATA]: `We couldn't access your backup at this time. Please try again later.`,
  [CLOUD_BACKUP_ERRORS.WALLET_BACKUP_STATUS_UPDATE_FAILED]: `Please, try again in a few seconds. Make sure you have internet access.`,
};

export const getFriendlyErrorMessage = (errorMessage: string) =>
  userFriendlyErrorMsg[errorMessage];
