import { useState, useCallback, useEffect } from 'react';
import { Vibration, InteractionManager } from 'react-native';
import { isEmulatorSync } from 'react-native-device-info';
import { methodRegistryLookupAndParse } from '../../../../src/utils/methodRegistry';
import { useIsMessageRequest } from './use-is-message-request';
import { useRouteParams } from './use-route-params';
import { useGas } from '@rainbow-me/hooks';

export const useMethodName = () => {
  const [methodName, setMethodName] = useState<string | null>(null);
  const isMessageRequest = useIsMessageRequest();
  const { startPollingGasPrices } = useGas();

  const {
    openAutomatically,
    transactionDetails: {
      payload: { params },
    },
  } = useRouteParams();

  const fetchMethodName = useCallback(
    async data => {
      if (!data) return;
      const methodSignaturePrefix = data.substr(0, 10);
      let fallbackHandler;

      try {
        fallbackHandler = setTimeout(() => {
          setMethodName('Transaction Request');
        }, 5000);

        const { name } = await methodRegistryLookupAndParse(
          methodSignaturePrefix
        );

        if (name) {
          setMethodName(name);
          clearTimeout(fallbackHandler);
        }
      } catch (e) {
        setMethodName('Transaction Request');
        clearTimeout(fallbackHandler as any);
      }
    },
    [setMethodName]
  );

  useEffect(() => {
    if (openAutomatically && !isEmulatorSync()) {
      Vibration.vibrate();
    }

    InteractionManager.runAfterInteractions(() => {
      if (!isMessageRequest) {
        startPollingGasPrices();
        fetchMethodName(params[0].data);
      } else {
        setMethodName('Message Signing Request');
      }
    });
  }, [
    fetchMethodName,
    isMessageRequest,
    openAutomatically,
    params,
    startPollingGasPrices,
  ]);

  return methodName;
};
