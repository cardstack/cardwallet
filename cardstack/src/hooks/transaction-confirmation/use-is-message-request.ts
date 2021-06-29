import { isMessageDisplayType } from '../../../../src/utils/signingMethods';
import { useRouteParams } from './use-route-params';

export const useIsMessageRequest = () => {
  const {
    transactionDetails: {
      payload: { method },
    },
  } = useRouteParams();

  const isMessageRequest = isMessageDisplayType(method);

  return isMessageRequest;
};
