import { Device } from '@cardstack/utils';

export const strings = {
  title: 'Restore wallet',
  description:
    'Restore your wallet with the 12 word recovery phrase that you have written down.',
  primaryBtn: 'Restore with recovery phrase',
  secondaryBtn: `Restore with ${Device.cloudPlatform}`,
  errorMessage: {
    title: `Error restoring from ${Device.cloudPlatform}`,
    message: `We couldn't find a backup file on your cloud platform.
        
    If you are sure that you have a backup file, please try again or contact support@cardstack.com if this error persists.`,
  },
};
