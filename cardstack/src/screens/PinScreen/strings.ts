import { PinFlow } from './types';

const flow: Record<PinFlow, { title: string; subtitle: string }> = {
  [PinFlow.create]: {
    title: 'Create PIN',
    subtitle: 'Choose a PIN to protect your wallet on this device',
  },
  [PinFlow.confirm]: {
    title: 'Confirm PIN',
    subtitle: 'Please re-type your PIN',
  },
  [PinFlow.enter]: {
    title: 'Enter PIN',
    subtitle: '',
  },
  [PinFlow.new]: {
    title: 'New PIN',
    subtitle: 'Choose a new PIN to protect your wallet on this device',
  },
};

export const strings = {
  flow,
  feedback: {
    error: 'PIN does not match',
    success: 'Success',
  },
};
