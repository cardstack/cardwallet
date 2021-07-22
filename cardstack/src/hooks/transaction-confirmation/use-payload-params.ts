import { useRouteParams } from './use-route-params';

export const usePayloadParams = (): {
  message: {
    to: string;
    data: string;
  };
  primaryType: string;
} => {
  const {
    transactionDetails: { payload },
  } = useRouteParams();

  const { params } = payload;

  return params[1];
};
