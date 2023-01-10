import { appName } from '@cardstack/constants';

export const strings = {
  errorMessage: 'Failed to get notification preferences',
  alert: {
    message: 'Please enable push notifications to be notified of transactions',
    dismissButton: 'Dismiss',
    askPermission: {
      title: `${appName} would like to send you push notifications`,
      actionButton: 'Okay',
    },
    handleDeniedPermission: {
      title: 'Notifications are disabled',
      actionButton: 'Open Settings',
    },
  },
};
