import { useRouteParams } from './use-route-params';

const payloadParamsFallback = {
  message: {
    to: '',
    data: '',
  },
  primaryType: '',
  domain: {
    verifyingContract: '',
  },
};

export const usePayloadParams = (): typeof payloadParamsFallback => {
  const {
    transactionDetails: { payload },
  } = useRouteParams();

  const { params } = payload;

  return params[1] || payloadParamsFallback;
};
