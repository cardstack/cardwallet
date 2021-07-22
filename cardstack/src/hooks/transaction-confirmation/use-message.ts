import { useRouteParams } from './use-route-params';

export const useMessage = () => {
  const {
    transactionDetails: { payload },
  } = useRouteParams();

  const { params } = payload;

  const message = params[1].message;

  return message;
};
