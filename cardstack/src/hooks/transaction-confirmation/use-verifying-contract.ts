import { useRouteParams } from './use-route-params';

export const useVerifyingContract = () => {
  const {
    transactionDetails: {
      payload: { params },
    },
  } = useRouteParams();

  const verifyingContract = params[1].domain.verifyingContract;

  return verifyingContract;
};
