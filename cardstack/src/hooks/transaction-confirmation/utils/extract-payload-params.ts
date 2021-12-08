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

  if (typeof params[1] === 'string') {
    return JSON.parse(params[1]);
  }

  return params[1] || payloadParamsFallback;
};
