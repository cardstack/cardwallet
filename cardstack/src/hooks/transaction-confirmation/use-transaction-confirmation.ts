import { useCalculateGas } from './use-calculate-gas';
import { useCancelTransaction } from './use-cancel-transaction';
import { useConfirmTransaction } from './use-confirm-transaction';
import { useTransactionConfirmationDataWithDecoding } from './use-transaction-confirmation-data-with-decoding';
import { useIsMessageRequest } from './use-is-message-request';
import { useMessage } from './use-message';
import { useMethodName } from './use-method-name';
import { useParsedMessage } from './use-parsed-message';
import { useRouteParams } from './use-route-params';

export const useTransactionConfirmation = () => {
  useCalculateGas();

  const {
    transactionDetails: { dappUrl },
  } = useRouteParams();

  const message = useMessage();
  const { data, loading } = useTransactionConfirmationDataWithDecoding();
  const onCancel = useCancelTransaction();
  const onConfirm = useConfirmTransaction();
  const isMessageRequest = useIsMessageRequest();
  const parsedMessage = useParsedMessage();
  const methodName = useMethodName();

  return {
    data,
    loading,
    onConfirm,
    onCancel,
    message,
    isMessageRequest,
    dappUrl,
    methodName,
    messageRequest: parsedMessage,
  };
};
