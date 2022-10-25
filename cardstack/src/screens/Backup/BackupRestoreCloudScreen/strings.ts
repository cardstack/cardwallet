import { Device } from '@cardstack/utils';

export const strings = {
  title: 'Enter password for your backup.',
  description: `Please enter the ${Device.cloudPlatform} password associated with this wallet's backup.`,
  inputPlaceholder: 'Enter password',
  disclaimer:
    'Cardstack does not store any of you data, so we cannot recover your password for you.',
  primaryBtn: 'Continue',
  errorMessage: {
    title: 'Unable to retrieve your backup',
    message: `Check the password you entered and try again. If this problem persists please reach out to support@cardstack.com`,
  },
};
