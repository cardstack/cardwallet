import { useRouteParams } from './use-route-params';

export const useMessage = () => {
  const {
    transactionDetails: {
      payload: { params },
    },
  } = useRouteParams();

  const message = params[1].message;

  return message;
};
