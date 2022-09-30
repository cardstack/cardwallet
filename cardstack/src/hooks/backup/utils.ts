import { CLOUD_BACKUP_ERRORS } from '@cardstack/models/rn-cloud';

const userFriendlyErrorMsg = {
  [CLOUD_BACKUP_ERRORS.KEYCHAIN_ACCESS_ERROR]:
    'You need to authenticate to proceed with the Backup process',
  [CLOUD_BACKUP_ERRORS.USER_CANCELED_DRIVE_API_AUTH]: `Not authorized to interact with Google Drive.`,
};

export const getFriendlyErrorMessage = (
  errorMessage = CLOUD_BACKUP_ERRORS.WALLET_BACKUP_STATUS_UPDATE_FAILED
) => userFriendlyErrorMsg[errorMessage];
