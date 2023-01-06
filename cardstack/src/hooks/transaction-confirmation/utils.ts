import { DisplayDetailsType } from '@cardstack/parsers/signing-requests';

import { TypedData } from '@rainbow-me/model/wallet';

interface EIP712TypedDataPayload {
  params: [string, TypedData | string];
}

const payloadParamsFallback: TypedData = {
  message: {
    to: '',
    data: '',
  },
  primaryType: '',
  domain: {
    verifyingContract: undefined,
  },
  types: {
    EIP712Domain: [],
  },
};

export const extractPayloadParams = (
  payload: EIP712TypedDataPayload
): TypedData => {
  const { params } = payload;

  const secondParam = params[1];

  if (typeof secondParam === 'string') {
    try {
      const parsed = JSON.parse(secondParam);
      return parsed;
    } catch (e) {
      return { ...payloadParamsFallback, message: { data: secondParam } };
    }
  }

  return secondParam || payloadParamsFallback;
};

export const parseMessageRequestJson = (displayDetails: DisplayDetailsType) => {
  let msg = displayDetails.request;

  if (typeof msg === 'string') {
    try {
      // it parses the string to format it nicely
      msg = JSON.parse(msg);
    } catch (e) {}
  }

  return JSON.stringify(msg, null, 4);
};
