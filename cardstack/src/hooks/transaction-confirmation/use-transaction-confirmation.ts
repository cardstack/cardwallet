import { useCalculateGas } from './use-calculate-gas';
import { useCancelTransaction } from './use-cancel-transaction';
import { useConfirmTransaction } from './use-confirm-transaction';
import { useDecodedData } from './use-decoded-data';
import { useIsMessageRequest } from './use-is-message-request';
import { useMessage } from './use-message';
import { useMethodName } from './use-method-name';
import { useParsedMessage } from './use-parsed-message';
import { useRouteParams } from './use-route-params';
import { TransactionConfirmationType } from '@cardstack/types';

export const useTransactionConfirmation = () => {
  useCalculateGas();

  const {
    transactionDetails: { dappUrl },
  } = useRouteParams();

  const message = useMessage();
  const { decodedData, loading } = useDecodedData();
  const onCancel = useCancelTransaction();
  const onConfirm = useConfirmTransaction();
  const isMessageRequest = useIsMessageRequest();
  const parsedMessage = useParsedMessage();
  const methodName = useMethodName();

  return {
    decodedData,
    loading,
    type: TransactionConfirmationType.ISSUE_PREPAID_CARD,
    onConfirm,
    onCancel,
    message,
    isMessageRequest,
    dappUrl,
    methodName,
    messageRequest: parsedMessage,
  };
};
