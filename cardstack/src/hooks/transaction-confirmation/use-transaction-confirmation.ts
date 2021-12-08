import { useEffect, useRef, useState } from 'react';
import { TransactionConfirmationContext } from '../../transaction-confirmation-strategies/context';
import { useCalculateGas } from './use-calculate-gas';
import { useCancelTransaction } from './use-cancel-transaction';
import { useConfirmTransaction } from './use-confirm-transaction';
import { extractPayloadParams, parseMessageRequestJson } from './utils';
import { useMethodName } from './use-method-name';
import { useRouteParams } from './use-route-params';
import { isMessageDisplayType } from '@rainbow-me/utils/signingMethods';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import {
  TransactionConfirmationData,
  TransactionConfirmationType,
} from '@cardstack/types';
import { logger } from '@rainbow-me/utils';
import { TypedData } from '@rainbow-me/model/wallet';

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

  const methodName = useMethodName(
    isMessageRequest,
    openAutomatically,
    payload.params
  );

  const payloadRef = useRef<any>();
  const typedDataRef = useRef<TypedData>();

  if (payloadRef.current !== payload) {
    payloadRef.current = payload;
    typedDataRef.current = extractPayloadParams(payload);
  }

  const { message, domain, primaryType } = typedDataRef.current as TypedData;

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
    onConfirm: useConfirmTransaction(),
    onCancel: useCancelTransaction(),
    message,
    isMessageRequest,
    dappUrl,
    methodName,
    messageRequest: parseMessageRequestJson(displayDetails),
  };
};
