import { useRouteParams } from './use-route-params';

export const usePrimaryType = () => {
  const {
    transactionDetails: { payload },
  } = useRouteParams();

  const { params } = payload;

  const primaryType = params[1].primaryType;

  return primaryType;
};
