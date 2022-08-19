import { appName } from '@cardstack/constants';

import { PinFlow } from './types';

const flow: Record<PinFlow, string> = {
  [PinFlow.create]: 'Choose a PIN to protect\nyour wallet on this device',
  [PinFlow.confirm]: 'Please re-type your PIN',
  [PinFlow.enter]: 'Enter PIN',
  [PinFlow.new]: `Enter your new PIN for your ${appName}`,
};

export const strings = {
  flow,
  feedback: {
    error: 'PIN does not match',
    success: 'Success',
  },
};
