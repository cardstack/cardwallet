import { useEffect, useMemo, useState } from 'react';

import {
  TransactionConfirmationData,
  TransactionConfirmationType,
} from '@cardstack/types';

import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { logger } from '@rainbow-me/utils';
import { isMessageDisplayType } from '@rainbow-me/utils/signingMethods';

import { TransactionConfirmationContext } from '../../transaction-confirmation-strategies/context';

import { useCalculateGas } from './use-calculate-gas';
import { useCancelTransaction } from './use-cancel-transaction';
import { useConfirmTransaction } from './use-confirm-transaction';
import { useMethodName } from './use-method-name';
import { useRouteParams } from './use-route-params';
import { extractPayloadParams, parseMessageRequestJson } from './utils';

export const useTransactionConfirmation = () => {
  const {
    openAutomatically,
    transactionDetails: { dappUrl, displayDetails, payload },
  } = useRouteParams();

  const [network, nativeCurrency] = useRainbowSelector(state => [
    state.settings.network,
    state.settings.nativeCurrency,
  ]);

  const isMessageRequest = isMessageDisplayType(payload.method);

  useCalculateGas(isMessageRequest, payload.params);
  const onConfirm = useConfirmTransaction();
  const onCancel = useCancelTransaction();

  const methodName = useMethodName(
    isMessageRequest,
    openAutomatically,
    payload.params
  );

  const typedData = useMemo(() => extractPayloadParams(payload), [payload]);

  const { message, domain, primaryType } = typedData;

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<TransactionConfirmationData>({
    type: TransactionConfirmationType.GENERIC,
  });

  useEffect(() => {
    const setDecodedData = async () => {
      try {
        setLoading(true);

        const result = await new TransactionConfirmationContext(
          message,
          domain.verifyingContract,
          primaryType,
          network,
          nativeCurrency
        ).getDecodedData();

        setData(result);
      } catch (error) {
        logger.error(`Decoding data error - ${error}`);
      }

      setLoading(false);
    };

    setDecodedData();
  }, [message, domain, primaryType, network, nativeCurrency]);

  return {
    data,
    loading,
    onConfirm,
    onCancel,
    message,
    isMessageRequest,
    dappUrl,
    methodName,
    messageRequest: parseMessageRequestJson(displayDetails),
  };
};
