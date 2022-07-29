import { appName } from '@cardstack/constants';

import { PinFlow } from './types';

const flow: Record<PinFlow, { title: string; subtitle: string }> = {
  [PinFlow.create]: {
    title: 'Create PIN',
    subtitle: `Please create your PIN for your new ${appName}`,
  },
  [PinFlow.confirm]: {
    title: 'Confirm PIN',
    subtitle: 'Please re-type your PIN number',
  },
  [PinFlow.enter]: {
    title: 'Enter PIN',
    subtitle: '',
  },
  [PinFlow.new]: {
    title: 'Enter new PIN',
    subtitle: `Please enter yout new PIN for your ${appName}`,
  },
};

export const strings = {
  flow,
  feedback: {
    error: 'PIN does not match',
    success: 'Success',
  },
};
